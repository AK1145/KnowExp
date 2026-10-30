-- Add a standalone 'Others' category without changing existing categories or expenses.
INSERT INTO category (name, icon, is_active)
VALUES ('Others', '📦', true)
ON CONFLICT (name) DO UPDATE SET is_active = true;
