package com.expensetracker.dashboard.dto;

import java.math.BigDecimal;

public record CategoryBreakdown(
        Long categoryId,
        String categoryName,
        String categoryIcon,
        BigDecimal amount,
        double percentage,
        String formattedAmount
) {}
