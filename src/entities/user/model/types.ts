// src/entities/user/model/types.ts

// ================= BASE USER TYPES =================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  position?: string;
  permissions: string[];
  roles: string[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  locale?: string;
  timezone?: string;
  metadata?: Record<string, unknown>;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

// ================= USER PROFILE TYPES =================

export interface UserProfile extends User {
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
  };
  preferences?: UserPreferences;
  statistics?: UserStatistics;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    emailVisible: boolean;
    phoneVisible: boolean;
  };
}

export interface UserStatistics {
  totalLogins: number;
  lastLoginAt: string;
  createdItemsCount: number;
  updatedItemsCount: number;
}

// ================= API TYPES =================

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UserProfileResponse {
  user: UserProfile;
  permissions: string[];
  roles: string[];
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  filters?: {
    search?: string;
    role?: UserRole | UserRole[];
    status?: UserStatus | UserStatus[];
    department?: string | string[];
    emailVerified?: boolean;
    twoFactorEnabled?: boolean;
    createdAfter?: string;
    createdBefore?: string;
  };
  include?: ('profile' | 'statistics' | 'preferences')[];
}

// ================= DTO TYPES =================

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
  department?: string;
  position?: string;
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  avatar?: string;
}

export interface UpdateUserEmailDto {
  newEmail: string;
  currentPassword: string;
}

export interface UpdateUserPasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserRoleDto {
  role: UserRole;
  permissions?: string[];
}

export interface UpdateUserStatusDto {
  status: UserStatus;
  reason?: string;
}

// ================= VALIDATION SCHEMAS =================

import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  avatar: z.string().url().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  department: z.string().optional(),
  position: z.string().optional(),
  permissions: z.array(z.string()),
  roles: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLoginAt: z.string().optional(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  sendWelcomeEmail: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  avatar: z.string().url().optional(),
});

// ================= TYPE GUARDS =================

export const isUser = (value: unknown): value is User => {
  return userSchema.safeParse(value).success;
};

export const hasRole = (user: User, role: UserRole | UserRole[]): boolean => {
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
};

export const hasPermission = (user: User, permission: string | string[]): boolean => {
  const permissions = Array.isArray(permission) ? permission : [permission];
  return permissions.every((p) => user.permissions.includes(p));
};

export const isActive = (user: User): boolean => {
  return user.status === UserStatus.ACTIVE;
};

// ================= UTILITY TYPES =================

export type UserWithoutSensitiveData = Omit<
  User,
  'permissions' | 'roles' | 'metadata' | 'twoFactorEnabled'
>;

export type PublicUserProfile = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'avatar' | 'department' | 'position'
>;

export type UserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
