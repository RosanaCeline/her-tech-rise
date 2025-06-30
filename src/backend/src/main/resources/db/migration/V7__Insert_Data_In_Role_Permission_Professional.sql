INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'EDIT_PROFILE';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'VIEW_STATISTICS';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'FOLLOW_USER';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'CREATE_POST';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'LIKE_POST';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'COMMENT';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'SHARE_POST';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'CREATE_COMMUNITY';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'JOIN_COMMUNITY';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'PARTICIPATE_COMMUNITY';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'APPLY_TO_JOB';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'VIEW_MY_APPLICATIONS';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p
WHERE r.name = 'PROFESSIONAL' AND p.description = 'BUY_COURSE';