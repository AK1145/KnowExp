package com.expensetracker.budget;

import com.expensetracker.budget.dto.BudgetRequest;
import com.expensetracker.budget.dto.BudgetResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public BudgetResponse getBudget() {
        return budgetService.getBudget();
    }

    @PutMapping
    public BudgetResponse updateBudget(@Valid @RequestBody BudgetRequest request) {
        return budgetService.updateBudget(request);
    }
}
