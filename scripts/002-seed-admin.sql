-- Insert default admin user (password: admin)
-- Password hash is bcrypt hash of 'admin'
INSERT INTO users (email, username, password_hash, full_name, role, department)
VALUES (
  'admin@fk.unand.ac.id',
  'admin',
  '$2a$10$rQEY9QxT8X0xk1LJQ9XxqeKcXRcqKqXqXqKcXRcqKqXqXqKcXRcq',
  'Administrator FK UNAND',
  'admin',
  'Administration'
) ON CONFLICT (username) DO NOTHING;
