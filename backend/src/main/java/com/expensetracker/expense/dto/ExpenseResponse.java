package com.expensetracker.expense.dto;

import com.expensetracker.category.dto.CategoryResponse;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        BigDecimal amount,
        CategoryResponse category,
        LocalDate expenseDate,
        String note,
        Instant createdAt,
        Instant updatedAt
) {}
