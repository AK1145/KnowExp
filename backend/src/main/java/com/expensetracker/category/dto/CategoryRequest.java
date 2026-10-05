package com.expensetracker.category.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Icon is required") String icon
) {}
