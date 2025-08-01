DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'professional_gender') THEN
        CREATE TYPE professional_gender AS ENUM (
            'MULHER',
            'HOMEM',
            'PESSOA_NAO_BINARIA',
            'PREFIRO_NAO_INFORMAR',
            'OUTRO'
        );
    END IF;
END
$$;

ALTER TABLE professional
ADD COLUMN gender professional_gender;

ALTER TABLE professional
ADD COLUMN consent_gender_sharing BOOLEAN;
