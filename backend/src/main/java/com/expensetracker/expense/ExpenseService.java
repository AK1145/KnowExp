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

import java.time.LocalDate;
import java.time.YearMonth;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
