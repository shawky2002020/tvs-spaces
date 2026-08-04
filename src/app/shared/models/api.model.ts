import { User } from './user.model';

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  type?: string;
}

export interface ApiResponse {
  message: string;
}

export interface UserUpdateResponse extends ApiResponse {
  user: User;
}

export interface ApiError {
  error: ApiResponse;
  statusCode?: number;
  details?: unknown;
}
