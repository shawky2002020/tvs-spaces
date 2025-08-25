import { User } from "./user.model";
//REQUESTS
export class UserUpdateRequest {
  username!:string;
  email!: string;
  password?: string;
  type?:string;
}











export interface ApiResponse {
  message:string;
}
export interface ApiError {
  error: ApiResponse;
  statusCode?: number;
  details?: any;
}