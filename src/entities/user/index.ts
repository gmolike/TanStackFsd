// src/entities/user/index.ts

// ================= MODEL EXPORTS =================
export type {
  User,
  UserProfile,
  UserPreferences,
  UserStatistics,
  UsersResponse,
  UserProfileResponse,
  UsersQueryParams,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UserWithoutSensitiveData,
  PublicUserProfile,
  UserFormData,
  UpdateUserFormData,
} from './model/types';

export {
  UserRole,
  UserStatus,
  userSchema,
  createUserSchema,
  updateUserSchema,
  isUser,
  hasRole,
  hasPermission,
  isActive,
} from './model/types';

// ================= API EXPORTS =================
export {
  userQueryKeys,
  useUser,
  useUsers,
  useUserProfile,
  useCurrentUser,
  useCreateUser,
  useUpdateUser,
  useUpdateCurrentUser,
  useUpdateUserPassword,
  useUpdateCurrentUserPassword,
  useUpdateUserEmail,
  useUpdateCurrentUserEmail,
  useDeleteUser,
  useUploadUserAvatar,
  useUploadCurrentUserAvatar,
} from './api/userApi';
