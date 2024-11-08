import { signOutMethod } from "@/lib/signOut";

export function SignOut() {
  return (
    <form
      action={async () => {
        await signOutMethod();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
