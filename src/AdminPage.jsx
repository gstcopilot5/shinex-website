import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const C = {
  bg: "#0b0b0d",
  card: "#15151a",
  border: "#26262e",
  red: "#e10600",
  text: "#f2f2f4",
  dim: "#85858d",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  background: "#1d1d23",
  color: C.text,
  fontSize: 15,
  marginBottom: 12,
  boxSizing: "border-box",
};

const btnStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: 10,
  border: "none",
  background: C.red,
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  // login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // data
  const [bookings, setBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) loadAll();
  }, [session]);

  async function loadAll() {
    setLoadingData(true);
    try {
      const { data: b } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      setBookings(b || []);
    } catch (e) {
      // ignore
    }
    setLoadingData(false);
  }

  async function handleLogin() {
    setLoginErr("");
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoggingIn(false);
    if (error) setLoginErr(error.message || "Login failed");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  // ---- Loading splash ----
  if (checking) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.dim }}>
        Loading…
      </div>
    );
  }

  // ---- Login screen ----
  if (!session) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 380, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
          <h2 style={{ color: C.text, margin: "0 0 6px", fontSize: 22 }}>ShineX Admin</h2>
          <p style={{ color: C.dim, margin: "0 0 20px", fontSize: 14 }}>Sign in to manage your site.</p>
          <input
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="current-password"
          />
          {loginErr && <p style={{ color: C.red, fontSize: 13, margin: "0 0 12px" }}>{loginErr}</p>}
          <button style={{ ...btnStyle, opacity: loggingIn ? 0.6 : 1 }} onClick={handleLogin} disabled={loggingIn}>
            {loggingIn ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  // ---- Dashboard ----
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: C.text, margin: 0, fontSize: 22 }}>Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{ background: "none", border: `1px solid ${C.border}`, color: C.dim, padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
        >
          Log out
        </button>
      </div>

      {/* Bookings */}
      <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ color: C.text, margin: 0, fontSize: 17 }}>Bookings ({bookings.length})</h3>
          <button onClick={loadAll} style={{ background: "none", border: "none", color: C.red, fontSize: 13, cursor: "pointer" }}>
            ↻ Refresh
          </button>
        </div>
        {loadingData ? (
          <p style={{ color: C.dim, fontSize: 14 }}>Loading…</p>
        ) : bookings.length === 0 ? (
          <p style={{ color: C.dim, fontSize: 14 }}>No bookings yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bookings.map((b) => (
              <div key={b.id} style={{ background: "#1d1d23", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ color: C.text, fontSize: 15 }}>{b.name || "—"}</strong>
                  <span style={{ color: C.dim, fontSize: 12 }}>
                    {b.created_at ? new Date(b.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
                <div style={{ color: C.dim, fontSize: 13, marginTop: 4 }}>
                  <a href={`tel:${b.phone}`} style={{ color: C.red, textDecoration: "none" }}>{b.phone || "—"}</a>
                  {b.city ? ` · ${b.city}` : ""}
                  {b.vehicle ? ` · ${b.vehicle}` : ""}
                </div>
                {b.service ? <div style={{ color: C.text, fontSize: 13, marginTop: 4 }}>{b.service}</div> : null}
                {b.message ? <div style={{ color: C.dim, fontSize: 13, marginTop: 4 }}>{b.message}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <p style={{ color: C.dim, fontSize: 12, textAlign: "center" }}>
        Services, gallery & offer editing coming in the next update.
      </p>
    </div>
  );
          }

