import bcrypt from "bcryptjs";
import { notFound } from "../lib/errors";
import { userRepository } from "../repositories/account.repository";

interface UserInput {
  username?: string;
  password?: string;
  email?: string;
}

const hash = (data: UserInput) =>
  data.password ? bcrypt.hash(data.password, 10) : Promise.resolve(undefined);

export const userService = {
  list: () => userRepository.findAll(),

  async get(id: number) {
    const user = await userRepository.findPublicById(id);
    if (!user) throw notFound();
    return user;
  },

  async create(data: Required<UserInput>) {
    return userRepository.create({ ...data, password: (await hash(data))! });
  },

  async update(id: number, data: UserInput) {
    await this.get(id);
    return userRepository.update(id, { ...data, password: await hash(data) });
  },

  async remove(id: number) {
    await this.get(id);
    await userRepository.delete(id);
  },
};
