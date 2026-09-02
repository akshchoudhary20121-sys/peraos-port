import type { AuthConfig } from "convex/server";

// Standard Convex Auth provider for this project's own sign-in ("Get
// Started" email/guest, see src/convex/auth.ts). The deployment
// self-issues JWTs (iss = CONVEX_SITE_URL, no `kid` header) validated
// via OIDC discovery at `${domain}/.well-known/openid-configuration`,
// served by auth.addHttpRoutes() in convex/http.ts.
//
// NOTE: Do NOT convert this entry to `type: "customJwt"` — that path
// rejects tokens without a `kid` header, so sign-in would silently
// never confirm and RequireAuth would loop back to /auth forever.
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
