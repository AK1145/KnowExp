package com.expensetracker.common.util;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class IndianNumberFormatter {
    private static final Locale INDIA = new Locale("en", "IN");

    public static String formatINR(BigDecimal amount) {
        if (amount == null) {
            return "₹0";
        }

        NumberFormat formatter = NumberFormat.getCurrencyInstance(INDIA);
        formatter.setMaximumFractionDigits(0);
        formatter.setMinimumFractionDigits(0);
        return formatter.format(amount);
    }
}
