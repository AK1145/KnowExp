package com.expensetracker.insight.dto;

public record InsightResponse(
        String type,
        String message,
        String icon
) {}
