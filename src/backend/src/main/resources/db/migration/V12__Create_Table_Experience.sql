CREATE TABLE IF NOT EXISTS experience (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(150) NOT NULL,
    modality VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description VARCHAR(1000),
    professional_id BIGINT NOT NULL,
    CONSTRAINT fk_experience_professional FOREIGN KEY (professional_id)
        REFERENCES professional(user_id) ON DELETE CASCADE
);