export type UserDetail = {
  email: string;
  password: string;
  role?: string;
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

export type TQueryGetAll = {
  title: string;
  page: string;
  sort: string;
  limit: string;
  fields: string;
};
