"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function Login() {
  const [state, action, pending] = useActionState(login, { error: null });
  return (
    <main className="admin">
      <form className="admin-card narrow" action={action}>
        <h1>Invitation Admin</h1>
        <p className="muted">Sign in to manage guests and send invitations.</p>
        <input name="password" type="password" placeholder="Password" required autoFocus autoComplete="current-password" />
        {state.error && <p className="error">{state.error}</p>}
        <button className="a-btn primary" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
