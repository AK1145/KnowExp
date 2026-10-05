package com.expensetracker.dashboard.dto;

import java.math.BigDecimal;

public record SpendingTrend(
        int month,
        String monthName,
        BigDecimal amount,
        String formattedAmount
) {}
