package com.expensetracker.expense;

import com.expensetracker.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    List<Expense> findByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate start, LocalDate end);
    
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.expenseDate BETWEEN :start AND :end GROUP BY e.category")
    List<Object[]> findCategoryWiseSum(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query(value = "SELECT EXTRACT(MONTH FROM e.expense_date) as month, SUM(e.amount) FROM expense e WHERE e.expense_date BETWEEN :start AND :end GROUP BY month ORDER BY month", nativeQuery = true)
    List<Object[]> findMonthlyTrend(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate BETWEEN :start AND :end")
    BigDecimal findTotalInDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);
    
    List<Expense> findTop5ByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate start, LocalDate end);
}
