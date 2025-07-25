import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * By opting in by setting `localStorage.BETA_REDIRECT` the user
 * can automatically be redirect to beta version of the tool.
 */
export function redirectToBeta(betaHost: string) {
  try {
    const shouldRedirectLocal = localStorage.getItem("BETA_REDIRECT");
    if (shouldRedirectLocal === null) {
      return;
    }
    const url = new URL(window.location.href);
    url.host = betaHost;
    window.location.href = url.toString();
  } catch (e) {
    console.warn(`Error redirecting to beta: ${e}`);
  }
}
