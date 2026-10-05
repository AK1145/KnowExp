package com.expensetracker.config;

import com.expensetracker.budget.Settings;
import com.expensetracker.budget.SettingsRepository;
import com.expensetracker.category.Category;
import com.expensetracker.category.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(CategoryRepository categoryRepository, SettingsRepository settingsRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                categoryRepository.saveAll(List.of(
                        new Category(null, "Food", "🍕", true),
                        new Category(null, "Grocery", "🛒", true),
                        new Category(null, "Beauty", "💄", true),
                        new Category(null, "Bills", "📄", true),
                        new Category(null, "Travel", "✈️", true),
                        new Category(null, "Snacks", "🍿", true)
                ));
            }

            if (!settingsRepository.existsById(1L)) {
                settingsRepository.save(new Settings(1L, new BigDecimal("20000.00"), "INR"));
            }
        };
    }
}
