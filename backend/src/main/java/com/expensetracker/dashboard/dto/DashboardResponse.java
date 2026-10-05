package com.expensetracker.dashboard.dto;

import com.expensetracker.expense.dto.ExpenseResponse;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        String period,
        String periodLabel,
        BigDecimal totalSpending,
        String formattedTotal,
        BigDecimal monthlyBudget,
        String formattedBudget,
        BigDecimal remainingBudget,
        String formattedRemaining,
        double budgetPercentage,
        BigDecimal previousPeriodSpending,
        String formattedPreviousSpending,
        double comparisonPercentage,
        List<CategoryBreakdown> categoryBreakdown,
        List<SpendingTrend> spendingTrend,
        List<ExpenseResponse> recentTransactions
) {}
