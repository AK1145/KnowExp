CREATE TABLE expense (
    id BIGSERIAL PRIMARY KEY,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    category_id BIGINT NOT NULL REFERENCES category(id),
    expense_date DATE NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expense_date ON expense(expense_date);
CREATE INDEX idx_expense_category ON expense(category_id);
