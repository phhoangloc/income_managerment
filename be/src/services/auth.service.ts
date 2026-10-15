import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { config } from "../lib/config";
import { AppError } from "../lib/errors";
import { AuthPayload, signToken } from "../lib/auth";
import { adminRepository, userRepository } from "../repositories/account.repository";

const wrong = () => new AppError(401, "Wrong username or password");
const google = new OAuth2Client();

/** Unique username derived from the email's local part. */
async function freeUsername(email: string) {
  let base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9._-]/g, "");
  if (base.length < 3) base = `user${base}`;
  let name = base;
  for (let i = 1; await userRepository.findByUsername(name); i++) name = `${base}${i}`;
  return name;
}

export const authService = {
  async loginUser(username: string, password: string) {
    const user = await userRepository.findByUsername(username);
    if (!user?.password || !(await bcrypt.compare(password, user.password))) throw wrong();
    return {
      token: signToken({ id: user.id, role: "user" }),
      user: { id: user.id, username: user.username, email: user.email },
    };
  },

  googleClientId: () => config.googleClientId,

  /** Verify a Google ID token; sign in the matching user, or register one on first login. */
  async loginGoogle(credential: string) {
    if (!config.googleClientId) throw new AppError(503, "Google login is not configured");
    let payload;
    try {
      const ticket = await google.verifyIdToken({ idToken: credential, audience: config.googleClientId });
      payload = ticket.getPayload();
    } catch {
      throw new AppError(401, "Invalid Google token");
    }
    if (!payload?.sub || !payload.email || !payload.email_verified)
      throw new AppError(401, "Google account has no verified email");

    let user = await userRepository.findByGoogleId(payload.sub);
    if (!user) {
      const existing = await userRepository.findByEmail(payload.email);
      user = existing
        ? await userRepository.linkGoogle(existing.id, payload.sub)
        : await userRepository.createFromGoogle({
            username: await freeUsername(payload.email),
            email: payload.email,
            googleId: payload.sub,
          });
    }
    return {
      token: signToken({ id: user.id, role: "user" }),
      user: { id: user.id, username: user.username, email: user.email },
    };
  },

  async loginAdmin(username: string, password: string) {
    const admin = await adminRepository.findByUsername(username);
    if (!admin || !(await bcrypt.compare(password, admin.password))) throw wrong();
    return {
      token: signToken({ id: admin.id, role: "admin" }),
      admin: { id: admin.id, username: admin.username, email: admin.email },
    };
  },

  async me({ id, role }: AuthPayload) {
    const account =
      role === "admin" ? await adminRepository.findById(id) : await userRepository.findById(id);
    if (!account) throw new AppError(401, "Account not found");
    return { id, role, username: account.username, email: account.email };
  },
};
