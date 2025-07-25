CREATE TABLE IF NOT EXISTS job_posting (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    requirements VARCHAR(1000) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_model VARCHAR(20) NOT NULL CHECK (job_model IN ('REMOTO', 'HIBRIDO', 'PRESENCIAL')),
    salary_min NUMERIC(10, 2),
    salary_max NUMERIC(10, 2),
    contract_type VARCHAR(20) NOT NULL CHECK (contract_type IN ('CLT', 'PJ', 'ESTAGIO', 'TRAINEE', 'TEMPORARIO', 'FREELANCER', 'VOLUNTARIO', 'APRENDIZ')),
    job_level VARCHAR(20) NOT NULL CHECK (job_level IN ('JUNIOR', 'PLENO', 'SENIOR')),
    application_deadline DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_updated BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ,

    company_user_id BIGINT,

    CONSTRAINT fk_jobposting_company
        FOREIGN KEY (company_user_id)
        REFERENCES company (user_id)
        ON DELETE SET NULL
);

CREATE INDEX idx_job_posting_company ON job_posting (company_user_id);
CREATE INDEX idx_job_posting_contract_type ON job_posting (contract_type);
CREATE INDEX idx_job_posting_job_level ON job_posting (job_level);
CREATE INDEX idx_job_posting_job_model ON job_posting (job_model);
