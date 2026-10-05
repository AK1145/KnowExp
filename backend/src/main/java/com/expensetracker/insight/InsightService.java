package com.expensetracker.insight;

import com.expensetracker.budget.BudgetService;
import com.expensetracker.budget.dto.BudgetResponse;
import com.expensetracker.category.Category;
import com.expensetracker.common.util.IndianNumberFormatter;
import com.expensetracker.expense.ExpenseRepository;
import com.expensetracker.insight.dto.InsightResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
public class InsightService {
    private final ExpenseRepository expenseRepository;
    private final BudgetService budgetService;

    public InsightService(ExpenseRepository expenseRepository, BudgetService budgetService) {
        this.expenseRepository = expenseRepository;
        this.budgetService = budgetService;
    }

    public List<InsightResponse> getInsights(String period) {
        List<InsightResponse> insights = new ArrayList<>();
        LocalDate now = LocalDate.now();
        LocalDate start = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate end = now.with(TemporalAdjusters.lastDayOfMonth());
        
        BigDecimal totalSpent = expenseRepository.findTotalInDateRange(start, end);
        if (totalSpent == null) totalSpent = BigDecimal.ZERO;

        BudgetResponse budget = budgetService.getBudget();
        
        // 1 & 5. Highest Category & Top Category Spending
        List<Object[]> categorySums = expenseRepository.findCategoryWiseSum(start, end);
        if (categorySums != null && !categorySums.isEmpty()) {
            Object[] highest = categorySums.stream()
                .max((a, b) -> ((BigDecimal) a[1]).compareTo((BigDecimal) b[1]))
                .orElse(categorySums.get(0));
            Category cat = (Category) highest[0];
            BigDecimal amt = (BigDecimal) highest[1];
            
            insights.add(new InsightResponse("category_highest", cat.getName() + " is your highest spending category at " + IndianNumberFormatter.formatINR(amt) + ".", cat.getIcon()));
            insights.add(new InsightResponse("category_spending", "You spent " + IndianNumberFormatter.formatINR(amt) + " on " + cat.getName() + " this month.", cat.getIcon()));
        }

        // 2 & 6. Budget Remaining / Exceeded
        if (budget.monthlyBudget() != null && totalSpent.compareTo(budget.monthlyBudget()) > 0 && budget.monthlyBudget().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal exceeded = totalSpent.subtract(budget.monthlyBudget());
            insights.add(new InsightResponse("budget_exceeded", "⚠️ You've exceeded your monthly budget by " + IndianNumberFormatter.formatINR(exceeded) + "!", "⚠️"));
        } else if (budget.monthlyBudget() != null && budget.monthlyBudget().compareTo(BigDecimal.ZERO) > 0) {
            insights.add(new InsightResponse("budget_remaining", "You have " + IndianNumberFormatter.formatINR(budget.amountRemaining()) + " remaining from your monthly budget.", "💰"));
        }

        // 3. Period Comparison
        LocalDate prevStart = start.minusMonths(1);
        LocalDate prevEnd = end.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth());
        BigDecimal prevSpent = expenseRepository.findTotalInDateRange(prevStart, prevEnd);
        if (prevSpent == null) prevSpent = BigDecimal.ZERO;
        
        if (prevSpent.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = totalSpent.subtract(prevSpent);
            double pct = diff.abs().divide(prevSpent, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).doubleValue();
            String direction = diff.compareTo(BigDecimal.ZERO) >= 0 ? "higher" : "lower";
            insights.add(new InsightResponse("comparison", "Your spending is " + pct + "% " + direction + " than last month.", "📈"));
        }

        // 4. Daily Average
        long daysPassed = ChronoUnit.DAYS.between(start, now) + 1;
        if (daysPassed > 0 && totalSpent.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal dailyAvg = totalSpent.divide(new BigDecimal(daysPassed), 0, RoundingMode.HALF_UP);
            insights.add(new InsightResponse("daily_average", "Your average daily spending is " + IndianNumberFormatter.formatINR(dailyAvg) + ".", "📅"));
        }

        return insights;
    }
}
