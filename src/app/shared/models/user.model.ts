export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Optional for security reasons
  lastLogin?: Date;
  creationDate?: Date;
  authorities: { authority: string }[];
  avatarUrl?: string;
}

export interface UserResponse {
  user: User & {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    enabled: boolean;
  };
  token: string;
}