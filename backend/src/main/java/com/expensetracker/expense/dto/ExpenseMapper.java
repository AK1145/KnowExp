package com.expensetracker.expense.dto;

import com.expensetracker.category.dto.CategoryMapper;
import com.expensetracker.expense.Expense;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExpenseMapper {
    private final CategoryMapper categoryMapper;

    public ExpenseMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public Expense toEntity(ExpenseRequest request) {
        if (request == null) return null;
        Expense expense = new Expense();
        expense.setAmount(request.amount());
        expense.setExpenseDate(request.expenseDate());
        expense.setNote(request.note());
        return expense;
    }

    public ExpenseResponse toResponse(Expense expense) {
        if (expense == null) return null;
        return new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                categoryMapper.toResponse(expense.getCategory()),
                expense.getExpenseDate(),
                expense.getNote(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }

    public List<ExpenseResponse> toResponseList(List<Expense> expenses) {
        if (expenses == null) return Collections.emptyList();
        return expenses.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
