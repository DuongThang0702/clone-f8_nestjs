export type UserDetail = {
  email: string;
  password: string;
  fullname: string;
};

export type UserLogin = {
  email: string;
  password: string;
};

export type AuthenticatedDecode = {
  id: number;
  email: string;
  fullname: string;
  role: string;
};

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedDecode;
}
