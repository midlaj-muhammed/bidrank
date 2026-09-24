import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = (params.email as string) ?? "";
        const rawName = (params.name as string) ?? "";
        const name =
          rawName.trim() ||
          (email.includes("@") ? email.split("@")[0] : "Founder");
        return { email, name };
      },
      validatePasswordRequirements(password: string) {
        if (!password || password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
      },
    }),
  ],
});
