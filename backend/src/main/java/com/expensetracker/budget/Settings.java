package com.expensetracker.budget;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "settings")
public class Settings {
    @Id
    private Long id = 1L;

    @Column(name = "monthly_budget", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyBudget = BigDecimal.ZERO;

    @Column(nullable = false, length = 3)
    private String currency = "INR";

    public Settings() {
    }

    public Settings(Long id, BigDecimal monthlyBudget, String currency) {
        this.id = id != null ? id : 1L;
        this.monthlyBudget = monthlyBudget != null ? monthlyBudget : BigDecimal.ZERO;
        this.currency = currency != null ? currency : "INR";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
