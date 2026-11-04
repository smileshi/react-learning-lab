export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export type CreateUserRequest = Omit<User, 'id'>;
