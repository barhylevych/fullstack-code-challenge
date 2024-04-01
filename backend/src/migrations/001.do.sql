CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

INSERT INTO users (name) VALUES ('Morgan Freeman'), ('Tom Hanks'), ('Brad Pitt'), ('Angelina Jolie'), ('Jennifer Aniston');

