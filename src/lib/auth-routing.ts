type AuthUser = {
  email?: string | null;
  role?: string | null;
  emailVerified?: boolean | null;
};

export function getAuthenticatedRedirectPath(user: AuthUser | null | undefined) {
  if (!user || user.emailVerified === false) return null;

  if (user.email === "ab@gmail.com") return "/admin";
  return user.role === "host" ? "/host" : "/guest";
}
