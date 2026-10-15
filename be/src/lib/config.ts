import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  tzOffsetMinutes: Number(process.env.TZ_OFFSET_MINUTES ?? 420),
};
