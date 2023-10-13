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
  _id: string;
  email: string;
  fullname: string;
  role: string;
};

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedDecode;
}
