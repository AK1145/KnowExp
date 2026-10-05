package com.expensetracker.budget.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record BudgetRequest(
        @NotNull(message = "Monthly budget is required")
        @DecimalMin(value = "0.0", message = "Budget cannot be negative")
        BigDecimal monthlyBudget
) {}
