import { AppError, notFound } from "../lib/errors";
import { AuthPayload } from "../lib/auth";
import { workplaceRepository } from "../repositories/workplace.repository";

/** Users only touch their own rows; admin touches everything. */
const owner = (auth: AuthPayload) => (auth.role === "admin" ? {} : { userId: auth.id });

export const workplaceService = {
  list(auth: AuthPayload, userId?: number) {
    return workplaceRepository.findAll({
      ...owner(auth),
      ...(auth.role === "admin" && userId ? { userId } : {}),
    });
  },

  async get(auth: AuthPayload, id: number) {
    const wp = await workplaceRepository.findOne({ id, ...owner(auth) });
    if (!wp) throw notFound();
    return wp;
  },

  create(auth: AuthPayload, data: { name: string; wage: number; userId?: number }) {
    const userId = auth.role === "admin" ? data.userId : auth.id;
    if (!userId) throw new AppError(400, "userId required");
    return workplaceRepository.create({ userId, name: data.name, wage: data.wage });
  },

  async update(auth: AuthPayload, id: number, data: { name?: string; wage?: number }) {
    await this.get(auth, id);
    return workplaceRepository.update(id, { name: data.name, wage: data.wage });
  },

  async remove(auth: AuthPayload, id: number) {
    await this.get(auth, id);
    await workplaceRepository.delete(id);
  },
};
