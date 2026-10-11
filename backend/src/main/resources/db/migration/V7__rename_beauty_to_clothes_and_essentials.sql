-- Rename the existing category in place so expenses linked to its ID remain intact.
UPDATE category
SET name = 'Clothes and essentials',
    icon = '👕'
WHERE name = 'Beauty';
