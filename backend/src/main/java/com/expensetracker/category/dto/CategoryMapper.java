package com.expensetracker.category.dto;

import com.expensetracker.category.Category;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {
    public Category toEntity(CategoryRequest request) {
        if (request == null) return null;
        Category category = new Category();
        category.setName(request.name());
        category.setIcon(request.icon());
        category.setIsActive(true);
        return category;
    }

    public CategoryResponse toResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getIcon(),
                category.getIsActive()
        );
    }

    public List<CategoryResponse> toResponseList(List<Category> categories) {
        if (categories == null) return Collections.emptyList();
        return categories.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
