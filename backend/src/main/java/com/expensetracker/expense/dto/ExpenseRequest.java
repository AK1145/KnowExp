package com.expensetracker.expense.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        BigDecimal amount,

        @NotNull(message = "Category is required")
        Long categoryId,

        @NotNull(message = "Date is required")
        LocalDate expenseDate,

        @Size(max = 255, message = "Note cannot exceed 255 characters")
        String note
) {}
