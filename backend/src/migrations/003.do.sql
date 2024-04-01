CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message VARCHAR(255) NOT NULL,
    question_id UUID REFERENCES questions(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    edited_at TIMESTAMP DEFAULT NOW() NOT NULL
);
