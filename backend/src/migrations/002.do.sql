CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT '',
    user_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    edited_at TIMESTAMP DEFAULT NOW() NOT NULL
);
