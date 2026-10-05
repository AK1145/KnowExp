package com.expensetracker.category;

import com.expensetracker.category.dto.CategoryMapper;
import com.expensetracker.category.dto.CategoryRequest;
import com.expensetracker.category.dto.CategoryResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllActiveCategories() {
        return categoryMapper.toResponseList(categoryRepository.findByIsActiveTrue());
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        category.setIsActive(true);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toResponse(saved);
    }
}
