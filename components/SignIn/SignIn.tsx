import { singInMethod } from "@/lib/signIn";

export default function SignIn() {
  return (
    <form
      action={async () => {
        await singInMethod();
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  );
}
