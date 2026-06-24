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

const smallInput = { ...inputStyle, padding: "9px 11px", fontSize: 14, marginBottom: 8 };

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

const labelStyle = { color: C.dim, fontSize: 12, display: "block", marginBottom: 4, marginTop: 4 };

const emptyService = { title: "", icon: "", price: "", tag: "", image: "", description: "", features: [], sort_order: 0 };
const emptyGallery = { src: "", label: "", sort_order: 0 };

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
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // offer editor
  const [offerText, setOfferText] = useState("");
  const [offerOpen, setOfferOpen] = useState(true);
  const [offerSaving, setOfferSaving] = useState(false);
  const [offerMsg, setOfferMsg] = useState("");

  // service editor
  const [editing, setEditing] = useState(null);
  const [svcSaving, setSvcSaving] = useState(false);
  const [svcMsg, setSvcMsg] = useState("");

  // gallery editor
  const [galEditing, setGalEditing] = useState(null);
  const [galSaving, setGalSaving] = useState(false);
  const [galMsg, setGalMsg] = useState("");

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

      const { data: sv } = await supabase.from("services").select("*").order("sort_order");
      setServices(sv || []);

      const { data: g } = await supabase.from("gallery").select("*").order("sort_order");
      setGallery(g || []);

      const { data: s } = await supabase.from("settings").select("*");
      if (s) {
        const map = {};
        s.forEach((row) => { map[row.key] = row.value; });
        if (map.offer_text !== undefined) setOfferText(map.offer_text);
        if (map.offer_open !== undefined) setOfferOpen(map.offer_open === "true");
      }
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

  async function saveOffer() {
    setOfferSaving(true);
    setOfferMsg("");
    try {
      await supabase.from("settings").update({ value: offerText }).eq("key", "offer_text");
      await supabase.from("settings").update({ value: offerOpen ? "true" : "false" }).eq("key", "offer_open");
      setOfferMsg("Saved ✓");
    } catch (e) {
      setOfferMsg("Save failed");
    }
    setOfferSaving(false);
    setTimeout(() => setOfferMsg(""), 2500);
  }

  // ---- Service CRUD ----
  function startNew() {
    const maxOrder = services.reduce((m, s) => Math.max(m, s.sort_order || 0), 0);
    setEditing({ ...emptyService, sort_order: maxOrder + 1 });
    setSvcMsg("");
  }
  function startEdit(s) {
    setEditing({ ...s, features: Array.isArray(s.features) ? s.features : [] });
    setSvcMsg("");
  }
  function cancelEdit() { setEditing(null); setSvcMsg(""); }
  async function saveService() {
    if (!editing.title) { setSvcMsg("Title is required"); return; }
    setSvcSaving(true);
    setSvcMsg("");
    const payload = {
      title: editing.title,
      icon: editing.icon,
      price: editing.price,
      tag: editing.tag,
      image: editing.image,
      description: editing.description,
      features: editing.features,
      sort_order: Number(editing.sort_order) || 0,
    };
    try {
      if (editing.id) {
        await supabase.from("services").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("services").insert([payload]);
      }
      await loadAll();
      setEditing(null);
    } catch (e) {
      setSvcMsg("Save failed");
    }
    setSvcSaving(false);
  }
  async function deleteService(id) {
    if (!window.confirm("Delete this service?")) return;
    try {
      await supabase.from("services").delete().eq("id", id);
      await loadAll();
    } catch (e) {}
  }

  // ---- Gallery CRUD ----
  function startNewGal() {
    const maxOrder = gallery.reduce((m, g) => Math.max(m, g.sort_order || 0), 0);
    setGalEditing({ ...emptyGallery, sort_order: maxOrder + 1 });
    setGalMsg("");
  }
  function startEditGal(g) { setGalEditing({ ...g }); setGalMsg(""); }
  function cancelGal() { setGalEditing(null); setGalMsg(""); }
  async function saveGallery() {
    if (!galEditing.src) { setGalMsg("Image path is required"); return; }
    setGalSaving(true);
    setGalMsg("");
    const payload = {
      src: galEditing.src,
      label: galEditing.label,
      sort_order: Number(galEditing.sort_order) || 0,
    };
    try {
      if (galEditing.id) {
        await supabase.from("gallery").update(payload).eq("id", galEditing.id);
      } else {
        await supabase.from("gallery").insert([payload]);
      }
      await loadAll();
      setGalEditing(null);
    } catch (e) {
      setGalMsg("Save failed");
    }
    setGalSaving(false);
  }
  async function deleteGallery(id) {
    if (!window.confirm("Delete this image?")) return;
    try {
      await supabase.from("gallery").delete().eq("id", id);
      await loadAll();
    } catch (e) {}
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
          <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} autoComplete="current-password" />
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
        <button onClick={handleLogout} style={{ background: "none", border: `1px solid ${C.border}`, color: C.dim, padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
          Log out
        </button>
      </div>

      {/* Offer bar editor */}
      <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 20 }}>
        <h3 style={{ color: C.text, margin: "0 0 14px", fontSize: 17 }}>Offer Bar</h3>
        <label style={labelStyle}>Banner text</label>
        <input style={inputStyle} value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="Launch Offer: 15% OFF…" />
        <label style={{ display: "flex", alignItems: "center", gap: 10, color: C.text, fontSize: 14, marginBottom: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={offerOpen} onChange={(e) => setOfferOpen(e.target.checked)} style={{ width: 18, height: 18, accentColor: C.red }} />
          Show offer bar on site
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={saveOffer} disabled={offerSaving} style={{ ...btnStyle, width: "auto", padding: "10px 22px", opacity: offerSaving ? 0.6 : 1 }}>
            {offerSaving ? "Saving…" : "Save"}
          </button>
          {offerMsg && <span style={{ color: offerMsg.includes("fail") ? C.red : "#4ade80", fontSize: 14 }}>{offerMsg}</span>}
        </div>
      </section>

      {/* Services CRUD */}
      <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ color: C.text, margin: 0, fontSize: 17 }}>Services ({services.length})</h3>
          {!editing && (
            <button onClick={startNew} style={{ background: C.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 8, cursor: "pointer" }}>+ Add</button>
          )}
        </div>

        {editing ? (
          <div style={{ background: "#1d1d23", borderRadius: 10, padding: 14 }}>
            <h4 style={{ color: C.text, margin: "0 0 12px", fontSize: 15 }}>{editing.id ? "Edit service" : "New service"}</h4>
            <label style={labelStyle}>Title *</label>
            <input style={smallInput} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Ceramic Coating" />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Icon (emoji)</label>
                <input style={smallInput} value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="💎" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Price</label>
                <input style={smallInput} value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="₹11,999" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Tag / badge</label>
                <input style={smallInput} value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} placeholder="MOST POPULAR" />
              </div>
              <div style={{ width: 90 }}>
                <label style={labelStyle}>Order</label>
                <input style={smallInput} type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} />
              </div>
            </div>
            <label style={labelStyle}>Image path</label>
            <input style={smallInput} value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="/img/svc-ceramic.jpg" />
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...smallInput, minHeight: 56, resize: "vertical" }} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="9H hardness. Mirror gloss…" />
            <label style={labelStyle}>Features (one per line)</label>
            <textarea style={{ ...smallInput, minHeight: 90, resize: "vertical" }} value={(editing.features || []).join("\n")} onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n").map((f) => f.trim()).filter(Boolean) })} placeholder={"High Gloss Finish\nUV Protection"} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <button onClick={saveService} disabled={svcSaving} style={{ ...btnStyle, width: "auto", padding: "10px 22px", opacity: svcSaving ? 0.6 : 1 }}>{svcSaving ? "Saving…" : "Save"}</button>
              <button onClick={cancelEdit} style={{ background: "none", border: `1px solid ${C.border}`, color: C.dim, padding: "10px 18px", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              {svcMsg && <span style={{ color: C.red, fontSize: 13 }}>{svcMsg}</span>}
            </div>
          </div>
        ) : services.length === 0 ? (
          <p style={{ color: C.dim, fontSize: 14 }}>No services yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {services.map((s) => (
              <div key={s.id} style={{ background: "#1d1d23", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: C.text, fontSize: 15 }}>
                    <span style={{ marginRight: 6 }}>{s.icon}</span>{s.title}
                    {s.tag ? <span style={{ color: C.red, fontSize: 11, marginLeft: 8 }}>{s.tag}</span> : null}
                  </div>
                  <div style={{ color: C.dim, fontSize: 13, marginTop: 2 }}>{s.price}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => startEdit(s)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.text, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteService(s.id)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.red, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gallery CRUD */}
      <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ color: C.text, margin: 0, fontSize: 17 }}>Gallery ({gallery.length})</h3>
          {!galEditing && (
            <button onClick={startNewGal} style={{ background: C.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 8, cursor: "pointer" }}>+ Add</button>
          )}
        </div>

        {galEditing ? (
          <div style={{ background: "#1d1d23", borderRadius: 10, padding: 14 }}>
            <h4 style={{ color: C.text, margin: "0 0 12px", fontSize: 15 }}>{galEditing.id ? "Edit image" : "New image"}</h4>
            <label style={labelStyle}>Image path *</label>
            <input style={smallInput} value={galEditing.src} onChange={(e) => setGalEditing({ ...galEditing, src: e.target.value })} placeholder="/img/gal-audi.jpg" />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Label</label>
                <input style={smallInput} value={galEditing.label} onChange={(e) => setGalEditing({ ...galEditing, label: e.target.value })} placeholder="Ceramic Coating" />
              </div>
              <div style={{ width: 90 }}>
                <label style={labelStyle}>Order</label>
                <input style={smallInput} type="number" value={galEditing.sort_order} onChange={(e) => setGalEditing({ ...galEditing, sort_order: e.target.value })} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <button onClick={saveGallery} disabled={galSaving} style={{ ...btnStyle, width: "auto", padding: "10px 22px", opacity: galSaving ? 0.6 : 1 }}>{galSaving ? "Saving…" : "Save"}</button>
              <button onClick={cancelGal} style={{ background: "none", border: `1px solid ${C.border}`, color: C.dim, padding: "10px 18px", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              {galMsg && <span style={{ color: C.red, fontSize: 13 }}>{galMsg}</span>}
            </div>
          </div>
        ) : gallery.length === 0 ? (
          <p style={{ color: C.dim, fontSize: 14 }}>No images yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {gallery.map((g) => (
              <div key={g.id} style={{ background: "#1d1d23", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <img src={g.src} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0, background: "#000" }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: C.text, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.label || "—"}</div>
                    <div style={{ color: C.dim, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.src}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => startEditGal(g)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.text, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteGallery(g.id)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.red, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookings */}
      <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ color: C.text, margin: 0, fontSize: 17 }}>Bookings ({bookings.length})</h3>
          <button onClick={loadAll} style={{ background: "none", border: "none", color: C.red, fontSize: 13, cursor: "pointer" }}>↻ Refresh</button>
        </div>
        {loadingData ? (
          <p s
