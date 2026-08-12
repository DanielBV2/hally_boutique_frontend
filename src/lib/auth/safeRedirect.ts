export function getSafeRedirect(redirect: string | null): string {
  return redirect && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/";
}
