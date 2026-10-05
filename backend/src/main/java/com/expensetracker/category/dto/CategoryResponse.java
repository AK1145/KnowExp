package com.expensetracker.category.dto;

public record CategoryResponse(
        Long id,
        String name,
        String icon,
        Boolean isActive
) {}
