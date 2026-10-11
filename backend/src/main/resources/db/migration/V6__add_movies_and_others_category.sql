INSERT INTO category (name, icon, is_active)
VALUES ('Movies and Others', '🎬', true)
ON CONFLICT (name) DO UPDATE SET is_active = true;
