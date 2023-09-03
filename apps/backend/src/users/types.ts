export type JwtUser = {
  id: number;
};

export type CreateUserProps = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export type UpdateUserProps = {
  firstName: string;
  lastName: string;
  password?: string;
};
