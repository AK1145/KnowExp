package com.expensetracker.budget.dto;

import java.math.BigDecimal;

public record BudgetResponse(
        BigDecimal monthlyBudget,
        BigDecimal amountSpent,
        BigDecimal amountRemaining,
        double percentageUsed,
        String currency,
        String formattedBudget,
        String formattedSpent,
        String formattedRemaining
) {}
