CREATE TABLE IF NOT EXISTS job_application (
    id BIGSERIAL PRIMARY KEY,
    job_posting_id BIGINT NOT NULL,
    professional_user_id BIGINT NOT NULL,
    github_link VARCHAR(1000),
    portfolio_link VARCHAR(1000),
    resume_url VARCHAR(1000) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uq_job_application UNIQUE (job_posting_id, professional_user_id),

    CONSTRAINT fk_job_application_posting
        FOREIGN KEY (job_posting_id)
        REFERENCES job_posting (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_job_application_professional
        FOREIGN KEY (professional_user_id)
        REFERENCES professional (user_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_job_application_posting ON job_application (job_posting_id);
CREATE INDEX idx_job_application_professional ON job_application (professional_user_id);
CREATE INDEX idx_job_application_deleted ON job_application (deleted);
