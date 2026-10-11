package com.expensetracker.expense;

import com.expensetracker.category.Category;
import com.expensetracker.category.CategoryRepository;
import com.expensetracker.common.exception.ResourceNotFoundException;
import com.expensetracker.expense.dto.ExpenseMapper;
import com.expensetracker.expense.dto.ExpenseRequest;
import com.expensetracker.expense.dto.ExpenseResponse;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.awt.Color;
import java.time.LocalDate;
import java.time.YearMonth;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Comparator;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.TextStyle;
import java.util.Locale;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseService(ExpenseRepository expenseRepository, CategoryRepository categoryRepository, ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.expenseMapper = expenseMapper;
    }


    @Transactional(readOnly = true)
    public String createMonthlyCsvReport(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        List<Expense> expenses = expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(start, end);
        StringBuilder csv = new StringBuilder("Date,Category,Note,Amount (INR)\r\n");
        BigDecimal total = BigDecimal.ZERO;
        for (Expense expense : expenses) {
            csv.append(csvCell(expense.getExpenseDate().toString())).append(',')
                    .append(csvCell(expense.getCategory().getName())).append(',')
                    .append(csvCell(expense.getNote() == null ? "" : expense.getNote())).append(',')
                    .append(expense.getAmount().toPlainString()).append("\r\n");
            total = total.add(expense.getAmount());
        }
        csv.append("\r\nTotal,,,").append(total.toPlainString()).append("\r\n");
        return "\uFEFF" + csv;
    }

    @Transactional(readOnly = true)
    public byte[] createMonthlyPdfReport(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        List<Expense> expenses = expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(start, end);
        BigDecimal total = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal average = expenses.isEmpty() ? BigDecimal.ZERO : total.divide(BigDecimal.valueOf(expenses.size()), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal highest = expenses.stream().map(Expense::getAmount).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);

        Map<String, BigDecimal> categoryTotals = new LinkedHashMap<>();
        expenses.stream().sorted(Comparator.comparing(Expense::getAmount).reversed()).forEach(expense ->
                categoryTotals.merge(expense.getCategory().getName(), expense.getAmount(), BigDecimal::add));
        List<Map.Entry<String, BigDecimal>> categories = categoryTotals.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed()).toList();

        try (PDDocument document = new PDDocument(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            float margin = 44f;
            float pageWidth = PDRectangle.A4.getWidth();
            float pageHeight = PDRectangle.A4.getHeight();
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            PDPageContentStream stream = new PDPageContentStream(document, page);
            float y = pageHeight - margin;

            y = writeText(stream, "KnowExp | Monthly Expense Report", margin, y, 19, PDType1Font.HELVETICA_BOLD);
            y = writeText(stream, month.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + month.getYear(), margin, y - 8, 12, PDType1Font.HELVETICA);
            y -= 18;
            y = drawKpi(stream, "TOTAL SPENT", formatMoney(total), margin, y, 120);
            y = drawKpi(stream, "TRANSACTIONS", String.valueOf(expenses.size()), margin + 130, y + 48, 120);
            y = drawKpi(stream, "AVERAGE EXPENSE", formatMoney(average), margin + 260, y + 48, 120);
            y = drawKpi(stream, "HIGHEST EXPENSE", formatMoney(highest), margin + 390, y + 48, 120);
            y -= 12;
            y = writeText(stream, "Category breakdown", margin, y, 13, PDType1Font.HELVETICA_BOLD) - 12;

            if (categories.isEmpty()) {
                y = writeText(stream, "No expenses were recorded for this month.", margin, y, 10, PDType1Font.HELVETICA);
            } else {
                BigDecimal maxCategory = categories.get(0).getValue().max(BigDecimal.ONE);
                for (Map.Entry<String, BigDecimal> entry : categories) {
                    if (y < 125) {
                        stream.close();
                        page = new PDPage(PDRectangle.A4); document.addPage(page);
                        stream = new PDPageContentStream(document, page); y = pageHeight - margin;
                        y = writeText(stream, "KnowExp | Monthly Expense Report", margin, y, 16, PDType1Font.HELVETICA_BOLD) - 20;
                    }
                    String name = safePdfText(entry.getKey());
                    y = writeText(stream, trimToWidth(name, 22), margin, y, 9, PDType1Font.HELVETICA);
                    float barY = y + 3;
                    float barX = margin + 145;
                    float barWidth = 210f * entry.getValue().floatValue() / maxCategory.floatValue();
                    stream.setNonStrokingColor(new Color(0.88f, 0.88f, 0.88f)); stream.addRect(barX, barY - 2, 210f, 8f); stream.fill();
                    stream.setNonStrokingColor(new Color(0.30f, 0.30f, 0.30f)); stream.addRect(barX, barY - 2, Math.max(2f, barWidth), 8f); stream.fill();
                    writeText(stream, formatMoney(entry.getValue()), barX + 218, y, 9, PDType1Font.HELVETICA_BOLD);
                    y -= 18;
                }
            }

            y -= 5;
            if (y < 100) {
                stream.close(); page = new PDPage(PDRectangle.A4); document.addPage(page);
                stream = new PDPageContentStream(document, page); y = pageHeight - margin;
            }
            y = writeText(stream, "Expense details", margin, y, 13, PDType1Font.HELVETICA_BOLD) - 12;
            y = drawTableHeader(stream, margin, y);
            for (Expense expense : expenses) {
                if (y < 58) {
                    stream.close(); page = new PDPage(PDRectangle.A4); document.addPage(page);
                    stream = new PDPageContentStream(document, page); y = pageHeight - margin;
                    y = writeText(stream, "KnowExp | Expense details (continued)", margin, y, 15, PDType1Font.HELVETICA_BOLD) - 20;
                    y = drawTableHeader(stream, margin, y);
                }
                stream.setStrokingColor(new Color(0.86f, 0.86f, 0.86f)); stream.moveTo(margin, y - 5); stream.lineTo(pageWidth - margin, y - 5); stream.stroke();
                writeText(stream, expense.getExpenseDate().toString(), margin, y - 1, 8, PDType1Font.HELVETICA);
                writeText(stream, trimToWidth(safePdfText(expense.getCategory().getName()), 20), margin + 78, y - 1, 8, PDType1Font.HELVETICA);
                writeText(stream, trimToWidth(safePdfText(expense.getNote() == null ? "" : expense.getNote()), 42), margin + 205, y - 1, 8, PDType1Font.HELVETICA);
                writeText(stream, formatMoney(expense.getAmount()), pageWidth - margin - 75, y - 1, 8, PDType1Font.HELVETICA_BOLD);
                y -= 18;
            }
            stream.close();
            document.save(output);
            return output.toByteArray();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not generate monthly PDF report", ex);
        }
    }

    private float writeText(PDPageContentStream stream, String text, float x, float y, int size, PDType1Font font) throws IOException {
        stream.beginText(); stream.setFont(font, size); stream.newLineAtOffset(x, y); stream.showText(safePdfText(text)); stream.endText();
        return y - size - 4;
    }

    private float drawKpi(PDPageContentStream stream, String label, String value, float x, float y, float width) throws IOException {
        stream.setNonStrokingColor(new Color(0.95f, 0.95f, 0.95f)); stream.addRect(x, y - 35, width, 48); stream.fill();
        stream.setNonStrokingColor(new Color(0.10f, 0.10f, 0.10f));
        writeText(stream, label, x + 7, y, 7, PDType1Font.HELVETICA_BOLD);
        writeText(stream, value, x + 7, y - 18, 10, PDType1Font.HELVETICA_BOLD);
        return y - 48;
    }

    private float drawTableHeader(PDPageContentStream stream, float x, float y) throws IOException {
        stream.setNonStrokingColor(new Color(0.88f, 0.88f, 0.88f)); stream.addRect(x, y - 6, PDRectangle.A4.getWidth() - 88, 18); stream.fill();
        stream.setNonStrokingColor(new Color(0.10f, 0.10f, 0.10f));
        writeText(stream, "Date", x + 3, y, 8, PDType1Font.HELVETICA_BOLD);
        writeText(stream, "Category", x + 78, y, 8, PDType1Font.HELVETICA_BOLD);
        writeText(stream, "Note", x + 205, y, 8, PDType1Font.HELVETICA_BOLD);
        writeText(stream, "Amount (INR)", PDRectangle.A4.getWidth() - 119, y, 8, PDType1Font.HELVETICA_BOLD);
        return y - 22;
    }

    private String formatMoney(BigDecimal amount) {
        return "INR " + amount.setScale(2, java.math.RoundingMode.HALF_UP).toPlainString();
    }

    private String safePdfText(String value) {
        if (value == null) return "";
        return value.replaceAll("[^\\x20-\\x7E]", "?");
    }

    private String trimToWidth(String value, int maxLength) {
        return value.length() <= maxLength ? value : value.substring(0, Math.max(0, maxLength - 3)) + "...";
    }

    private String csvCell(String value) {
        // Prevent spreadsheet formula execution for user-controlled text fields.
        String safeValue = value.stripLeading();
        if (!safeValue.isEmpty() && "=+-@".indexOf(safeValue.charAt(0)) >= 0) {
            value = "'" + value;
        }
        String escaped = value.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Expense expense = expenseMapper.toEntity(request);
        expense.setCategory(category);
        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .map(expenseMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
    }

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> getAllExpenses(String search, Long categoryId, LocalDate from, LocalDate to, Pageable pageable) {
        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate noteLike = cb.like(cb.lower(root.get("note")), searchPattern);
                Predicate categoryLike = cb.like(cb.lower(root.get("category").get("name")), searchPattern);
                predicates.add(cb.or(noteLike, categoryLike));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expenseDate"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expenseDate"), to));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return expenseRepository.findAll(spec, pageable).map(expenseMapper::toResponse);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        expense.setAmount(request.amount());
        expense.setCategory(category);
        expense.setExpenseDate(request.expenseDate());
        expense.setNote(request.note());

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found");
        }
        expenseRepository.deleteById(id);
    }
}
