export class User {
  id!: string;
  username!: string;
  email!: string;
  password?: string; // Optional for security reasons
  lastLogin!: Date;
  creationDate!: Date;
  authorities!: { authority: string }[];
  type!:string;
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