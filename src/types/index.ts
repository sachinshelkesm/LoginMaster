export interface User {
  id: number;
  username: string;
  password: string;
}

export interface UsersData {
  users: User[];
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}