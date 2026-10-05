package com.expensetracker.budget;

import com.expensetracker.budget.dto.BudgetRequest;
import com.expensetracker.budget.dto.BudgetResponse;
import com.expensetracker.common.util.IndianNumberFormatter;
import com.expensetracker.expense.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;

@Service
public class BudgetService {
    private final SettingsRepository settingsRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(SettingsRepository settingsRepository, ExpenseRepository expenseRepository) {
        this.settingsRepository = settingsRepository;
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudget() {
        Settings settings = settingsRepository.findById(1L).orElseGet(() -> new Settings(1L, BigDecimal.ZERO, "INR"));
        
        YearMonth currentMonth = YearMonth.now();
        LocalDate start = currentMonth.atDay(1);
        LocalDate end = currentMonth.atEndOfMonth();
        
        BigDecimal spent = expenseRepository.findTotalInDateRange(start, end);
        BigDecimal budget = settings.getMonthlyBudget();
        BigDecimal remaining = budget.subtract(spent);
        
        double percentage = 0;
        if (budget.compareTo(BigDecimal.ZERO) > 0) {
            percentage = spent.divide(budget, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).doubleValue();
        }

        return new BudgetResponse(
                budget,
                spent,
                remaining,
                Math.min(percentage, 100.0),
                settings.getCurrency(),
                IndianNumberFormatter.formatINR(budget),
                IndianNumberFormatter.formatINR(spent),
                IndianNumberFormatter.formatINR(remaining)
        );
    }

    @Transactional
    public BudgetResponse updateBudget(BudgetRequest request) {
        Settings settings = settingsRepository.findById(1L).orElseGet(() -> new Settings(1L, BigDecimal.ZERO, "INR"));
        settings.setMonthlyBudget(request.monthlyBudget());
        settingsRepository.save(settings);
        return getBudget();
    }
}
