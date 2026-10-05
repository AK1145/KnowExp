package com.expensetracker.insight;

import com.expensetracker.insight.dto.InsightResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/insights")
public class InsightController {
    private final InsightService insightService;

    public InsightController(InsightService insightService) {
        this.insightService = insightService;
    }

    @GetMapping
    public List<InsightResponse> getInsights(@RequestParam(defaultValue = "month") String period) {
        return insightService.getInsights(period);
    }
}
