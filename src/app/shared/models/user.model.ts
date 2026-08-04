export interface User {
  id: number;
  username: string;
  email: string;
  type: string;
  role: string;
  lastLogin: string | Date;
  creationDate: string | Date;
}

export interface UserResponse {
  user: User;
  token: string;
  message?: string;
}
