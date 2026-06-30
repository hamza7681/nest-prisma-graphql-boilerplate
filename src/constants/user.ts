export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const PERMISSIONS = {
  admin: {
    read: '*',
    write: '*',
    update: '*',
    delete: '*',
  },
  user: {
    read: 'user:read',
    write: 'user:write',
    update: 'user:update',
    delete: 'user:delete',
  },
  permission: {
    read: 'permission:read',
    write: 'permission:write',
    update: 'permission:update',
    delete: 'permission:delete',
  },
  role: {
    read: 'role:read',
    write: 'role:write',
    update: 'role:update',
    delete: 'role:delete',
  },
};

export const PERMISSION_KEYS = Object.values(PERMISSIONS).flatMap(
  Object.values,
) as readonly string[];
