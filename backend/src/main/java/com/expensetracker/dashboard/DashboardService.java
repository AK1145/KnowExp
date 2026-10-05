package com.expensetracker.dashboard;

import com.expensetracker.budget.BudgetService;
import com.expensetracker.budget.dto.BudgetResponse;
import com.expensetracker.category.Category;
import com.expensetracker.common.util.IndianNumberFormatter;
import com.expensetracker.dashboard.dto.CategoryBreakdown;
import com.expensetracker.dashboard.dto.DashboardResponse;
import com.expensetracker.dashboard.dto.SpendingTrend;
import com.expensetracker.expense.ExpenseRepository;
import com.expensetracker.expense.dto.ExpenseMapper;
import com.expensetracker.expense.dto.ExpenseResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class DashboardService {
    private final ExpenseRepository expenseRepository;
    private final BudgetService budgetService;
    private final ExpenseMapper expenseMapper;

    public DashboardService(ExpenseRepository expenseRepository, BudgetService budgetService, ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.budgetService = budgetService;
        this.expenseMapper = expenseMapper;
    }

    public DashboardResponse getDashboard(String period) {
        LocalDate now = LocalDate.now();
        LocalDate start, end, prevStart, prevEnd;
        String periodLabel;

        if ("week".equalsIgnoreCase(period)) {
            start = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            end = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
            prevStart = start.minusWeeks(1);
            prevEnd = end.minusWeeks(1);
            periodLabel = "Week of " + start.format(DateTimeFormatter.ofPattern("MMM dd"));
        } else if ("year".equalsIgnoreCase(period)) {
            start = now.with(TemporalAdjusters.firstDayOfYear());
            end = now.with(TemporalAdjusters.lastDayOfYear());
            prevStart = start.minusYears(1);
            prevEnd = end.minusYears(1);
            periodLabel = "Year " + now.getYear();
        } else {
            // Default to month
            start = now.with(TemporalAdjusters.firstDayOfMonth());
            end = now.with(TemporalAdjusters.lastDayOfMonth());
            prevStart = start.minusMonths(1);
            prevEnd = end.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth());
            periodLabel = now.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            period = "month";
        }

        BigDecimal totalSpending = expenseRepository.findTotalInDateRange(start, end);
        if (totalSpending == null) totalSpending = BigDecimal.ZERO;

        BigDecimal prevSpending = expenseRepository.findTotalInDateRange(prevStart, prevEnd);
        if (prevSpending == null) prevSpending = BigDecimal.ZERO;
        
        double comparisonPercentage = 0;
        if (prevSpending.compareTo(BigDecimal.ZERO) > 0) {
            comparisonPercentage = totalSpending.subtract(prevSpending)
                    .divide(prevSpending, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100")).doubleValue();
        }

        BudgetResponse budgetResponse = budgetService.getBudget();

        List<Object[]> categorySums = expenseRepository.findCategoryWiseSum(start, end);
        List<CategoryBreakdown> breakdowns = new ArrayList<>();
        if (categorySums != null) {
            for (Object[] row : categorySums) {
                Category cat = (Category) row[0];
                BigDecimal amount = (BigDecimal) row[1];
                double pct = totalSpending.compareTo(BigDecimal.ZERO) > 0 
                    ? amount.divide(totalSpending, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).doubleValue() 
                    : 0;
                breakdowns.add(new CategoryBreakdown(cat.getId(), cat.getName(), cat.getIcon(), amount, pct, IndianNumberFormatter.formatINR(amount)));
            }
        }

        List<SpendingTrend> trends = new ArrayList<>();
        if ("year".equalsIgnoreCase(period)) {
            List<Object[]> monthlySums = expenseRepository.findMonthlyTrend(start, end);
            for (int m = 1; m <= 12; m++) {
                int finalM = m;
                BigDecimal amt = BigDecimal.ZERO;
                if (monthlySums != null) {
                    amt = monthlySums.stream()
                            .filter(r -> ((Number) r[0]).intValue() == finalM)
                            .map(r -> (BigDecimal) r[1])
                            .findFirst()
                            .orElse(BigDecimal.ZERO);
                }
                String monthName = java.time.Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                trends.add(new SpendingTrend(m, monthName, amt, IndianNumberFormatter.formatINR(amt)));
            }
        }

        List<ExpenseResponse> recent = expenseMapper.toResponseList(
            expenseRepository.findTop5ByExpenseDateBetweenOrderByExpenseDateDesc(start, end)
        );

        return new DashboardResponse(
                period,
                periodLabel,
                totalSpending,
                IndianNumberFormatter.formatINR(totalSpending),
                budgetResponse.monthlyBudget(),
                budgetResponse.formattedBudget(),
                budgetResponse.amountRemaining(),
                budgetResponse.formattedRemaining(),
                budgetResponse.percentageUsed(),
                prevSpending,
                IndianNumberFormatter.formatINR(prevSpending),
                comparisonPercentage,
                breakdowns,
                trends,
                recent
        );
    }
}
