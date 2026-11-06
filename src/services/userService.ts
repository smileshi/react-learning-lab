import http from '../api/http';
import type { CreateUserRequest, User } from '../types/user';


// 查询所有用户
const getUsers = async (): Promise<User[]> => {
  const response = await http.get<User[]>('/api/users');

  return response.data;
};

// 查询单个用户
const getUserById = async (id: number): Promise<User> => {
  const response = await http.get<User>(`/api/users/${id}`);

  return response.data;
};

// 创建用户
const createUser = async (
  user: CreateUserRequest
): Promise<User> => {
  const response = await http.post<User>('/api/users', user);

  return response.data;
};

// 删除用户
const deleteUser = async (id: number): Promise<void> => {
  await http.delete(`/api/users/${id}`);
};

export const userService = {
  getUsers,
  getUserById,
  createUser,
  deleteUser
};