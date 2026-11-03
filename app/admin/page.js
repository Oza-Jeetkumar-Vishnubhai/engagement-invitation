import { adminConfigured, isAdmin } from "@/lib/auth";
import { listGuests, listRsvps, storeReady } from "@/lib/store";
import Login from "@/components/admin/Login";
import Dashboard from "@/components/admin/Dashboard";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Invitation Admin",
  robots: { index: false, follow: false },
};

function Setup({ title, children }) {
  return (
    <main className="admin">
      <div className="admin-card narrow">
        <h1>{title}</h1>
        {children}
      </div>
    </main>
  );
}

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <Setup title="Almost there">
        <p>
          Set an <code>ADMIN_PASSWORD</code> environment variable in Vercel (Project → Settings → Environment Variables), then
          redeploy.
        </p>
      </Setup>
    );
  }

  if (!(await isAdmin())) return <Login />;

  if (!storeReady()) {
    return (
      <Setup title="Connect a database">
        <p>
          In Vercel, open this project → <b>Storage</b> → <b>Create Database</b> → <b>Neon</b>, connect it to the project, then
          redeploy. It sets <code>DATABASE_URL</code> automatically.
        </p>
      </Setup>
    );
  }

  const [guests, rsvps] = await Promise.all([listGuests(), listRsvps()]);
  return <Dashboard guests={guests} rsvps={rsvps} />;
}
