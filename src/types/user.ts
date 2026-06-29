import { ROLES } from 'src/constants/user';
import {
  Organization,
  Permission,
  Role,
  User,
} from 'src/generated/prisma/client';

export type CurrentUser = {
  userId: string;
  email: string;
  organizationId: string;
};

type PermissionData = Pick<Permission, 'id' | 'key' | 'description'>;

type RoleData = Pick<Role, 'id' | 'name'> & {
  permissions: { permission: PermissionData }[];
};

type OrganizationData = Pick<Organization, 'id' | 'name'>;

type UserData = Pick<
  User,
  'id' | 'name' | 'email' | 'isVerified' | 'createdAt' | 'updatedAt'
>;

export type FormatUserInput = {
  user: UserData;
  organization?: OrganizationData;
  role?: RoleData;
};

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
