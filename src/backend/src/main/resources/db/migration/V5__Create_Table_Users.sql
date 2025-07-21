CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    street VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    uf VARCHAR(50) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('PROFESSIONAL', 'COMPANY')),
    user_handle VARCHAR(15) UNIQUE NOT NULL,
    profile_pic VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    external_link VARCHAR(100),

    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (role_id) REFERENCES role(id)
);