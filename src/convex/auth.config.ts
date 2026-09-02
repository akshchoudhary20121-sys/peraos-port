import type { AuthConfig } from "convex/server";

// Freebuff-signed federated tokens — only included when the issuer env var
// is explicitly configured. Without it the customJwt provider is omitted,
// so Convex deployment does not fail on the missing env var.
const freebuffIssuer = process.env.VLY_CONVEX_AUTH_ISSUER;

const freebuffProvider = freebuffIssuer
  ? {
      type: "customJwt" as const,
      issuer: freebuffIssuer,
      jwks: `${freebuffIssuer}/api/web/.well-known/jwks.json`,
      applicationID: "vly-convex",
      algorithm: "RS256" as const,
    }
  : null;

export default {
  providers: [
    // Standard Convex Auth provider for this project's own sign-in ("Get
    // Started" email/guest, see src/convex/auth.ts). The deployment
    // self-issues JWTs (iss = CONVEX_SITE_URL, no `kid` header) validated
    // via OIDC discovery at `${domain}/.well-known/openid-configuration`,
    // served by auth.addHttpRoutes() in convex/http.ts. Do NOT convert this
    // entry to `type: "customJwt"` — that path rejects tokens without a
    // `kid` header, so sign-in would silently never confirm and RequireAuth
    // would loop back to /auth forever.
    {
      domain: process.env.CONVEX_SITE_URL!,
      applicationID: "convex",
    },
    ...(freebuffProvider ? [freebuffProvider] : []),
  ],
} satisfies AuthConfig;
