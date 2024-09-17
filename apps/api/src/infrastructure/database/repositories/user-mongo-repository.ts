import type { RegisterRequest } from "@common/dto/register-request.js";
import type { User } from "@/domain/entity/user.js";
import type { UserRepository } from "@/domain/gateway/user-repository.js";
import type { RefreshToken } from "@/domain/entity/refresh-token.js";

import { injectable } from "inversify";
import { env } from "@/env.js";
import UserModel, { type UserDocument } from "../models/user.js";
import RefreshTokenModel from "../models/refresh-token.js";

@injectable()
export class UserMongoRepository implements UserRepository {
  async create(user: RegisterRequest): Promise<User> {
    const newUser = await UserModel.create(user);
    return this.toUserEntity(newUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return this.toUserEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return this.toUserEntity(user);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map((user) => this.toUserEntity(user));
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    if (!updatedUser) return null;
    return this.toUserEntity(updatedUser);
  }

  async findRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<RefreshToken | null> {
    const token = await RefreshTokenModel.findOne({
      userId,
      token: refreshToken,
    });
    if (!token) return null;

    return {
      userId: token.userId.toString(),
      token: token.token,
      expiresAt: token.expiresAt,
    };
  }

  async createRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await RefreshTokenModel.create({
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRATION_IN_MS),
    });
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await RefreshTokenModel.findOneAndDelete({ token: refreshToken });
  }

  private toUserEntity(user: UserDocument): User {
    return {
      // @ts-ignore 
      id: user._id.toString(),
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      password: user.password,
      deletedAt: user.deletedAt,
    };
  }
}
