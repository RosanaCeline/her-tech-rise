ALTER TABLE job_application
DROP CONSTRAINT IF EXISTS uq_job_application;

CREATE UNIQUE INDEX uq_job_application_active
ON job_application (job_posting_id, professional_user_id)
WHERE deleted = false;
