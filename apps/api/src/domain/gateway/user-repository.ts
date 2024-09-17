import type { RegisterRequest } from "@common/dto/register-request.js";
import type { User } from "@/domain/entity/user.js";
import type { RefreshToken } from "../entity/refresh-token.js";

export interface UserRepository {
  create(user: RegisterRequest): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  findRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<RefreshToken | null>;
  createRefreshToken(userId: string, refreshToken: string): Promise<void>;
  deleteRefreshToken(refreshToken: string): Promise<void>;
}
