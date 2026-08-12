import { AppError } from "../../errors/AppError";
import { hashPassword } from "../../utils/password";
import { AuthRepository } from "./auth.repository";
import type { SignupInput } from "shared";
export class AuthService {
  constructor(private readonly authRepositoty: AuthRepository) {}
  async singup(data: SignupInput) {
    const { name, email, password } = data;
    const existingUser = await this.authRepositoty.findUserByEmail(email);
    if (existingUser) {
      throw new AppError("User Already Exists", 404);
    }
    const passwordHash = await hashPassword(password);
    const user = await this.authRepositoty.createUser({
      name,
      email,
      passwordHash,
    });
    return {
      user,
    };
  }
}
