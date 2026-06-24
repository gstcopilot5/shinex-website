import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const WHATSAPP = "918918604945";
const PHONE = "7349152274";
const EMAIL = "info@shinexcardetailing.com";
const INSTAGRAM = "https://instagram.com/shinexcardetailing5";
const FACEBOOK = "https://facebook.com/share/1978Y5JYQa/";
const YOUTUBE = "https://youtube.com/@shinexcardetailing";
const ADDRESS = "Krishna Dev Pur, Kalna, Purba Bardhaman, 713405";
const LANDMARK = "Near Baghnapara Railway Station";
const MAPS_EMBED = "https://www.google.com/maps?q=Baghnapara+Railway+Station+Kalna+Purba+Bardhaman&output=embed";
const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Baghnapara+Railway+Station+Kalna";
const waLink = (m) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(m)}`;
const PHONE_DISPLAY = "+91 73491 52274";
const WHATSAPP_DISPLAY = "+91 89186 04945";

const servicesFallback = [
  { id: 1, icon: "💎", title: "Ceramic Coating", price: "₹11,999", img: "/img/svc-ceramic.jpg",
    desc: "9H hardness. Mirror gloss. Water slides right off.",
    features: ["High Gloss Finish", "UV Protection", "Hydrophobic Layer", "Easy Maintenance", "Long-Term Protection"], tag: "MOST POPULAR" },
  { id: 2, icon: "🧬", title: "Graphene Coating", price: "₹32,999", img: "/img/svc-graphene.jpg",
    desc: "Next-gen protection. Extreme water beading, superior heat resistance.",
    features: ["Extreme Water Repellency", "Superior Heat Resistance", "Deep Gloss Finish", "Enhanced Durability", "Anti Water-Spotting"], tag: "ADVANCED" },
  { id: 3, icon: "🛡️", title: "Paint Protection Film", price: "₹49,999", img: "/img/svc-ppf.jpg",
    desc: "Self-healing armour against scratches, stone chips and UV.",
    features: ["Self-Healing Technology", "Scratch Resistance", "Stone Chip Protection", "UV Protection", "10-Year Durability"], tag: "PREMIUM" },
];

const cities = ["Kolkata", "Howrah", "Hooghly", "Serampore", "Kalyani", "Durgapur", "Bardhaman", "Kalna"];

const galleryFallback = [
  { src: "/img/gal-lambo.jpg", label: "Paint Correction" },
  { src: "/img/gal-ferrari.jpg", label: "Foam Wash" },
  { src: "/img/gal-audi.jpg", label: "Ceramic Coating" },
  { src: "/img/gal-jaguar.jpg", label: "Paint Protection Film" },
  { src: "/img/gal-subaru.jpg", label: "Window Tinting" },
  { src: "/img/gal-mercedes.jpg", label: "Exterior Detailing" },
  { src: "/img/gal-interior.jpg", label: "Ceramic Gloss" },
  { src: "/img/gal-seat.jpg", label: "Hydrophobic Finish" },
];

const beforeAfters = [
  { label: "Exterior Detail", before: "/img/ba-ext-before.jpg", after: "/img/ba-ext-after.jpg" },
  { label: "Interior Deep Clean", before: "/img/ba-int-before.jpg", after: "/img/ba-int-after.jpg" },
  { label: "Seat Restoration", before: "/img/ba-seat-before.jpg", after: "/img/ba-seat-after.jpg" },
];

const whyUs = [
  { icon: "🏠", title: "True Doorstep Service", desc: "We bring power, water, products and equipment to you. You don't move your car an inch." },
  { icon: "👨‍🔧", title: "Master Technicians", desc: "10+ years of hands-on detailing. Trained, certified and obsessed with perfection." },
  { icon: "⭐", title: "Premium Products Only", desc: "Certified professional-grade coatings — never local substitutes that fail in months." },
  { icon: "📸", title: "Proof In Pictures", desc: "Every job documented with before & after photos. See exactly what you paid for." },
  { icon: "💰", title: "Transparent Pricing", desc: "The price we quote is the price you pay. No hidden charges, no surprises." },
  { icon: "🔄", title: "Satisfaction Guaranteed", desc: "Not happy? We come back and make it right. Your satisfaction is our only standard." },
];

const journey = [
  { year: "2015", title: "The Beginning", desc: "Started as a passion for making cars look perfect, one vehicle at a time." },
  { year: "2018", title: "Going Professional", desc: "Trained in advanced ceramic coating and premium paint protection systems." },
  { year: "2022", title: "Doorstep Revolution", desc: "Pioneered fully-equipped doorstep detailing across West Bengal." },
  { year: "2026", title: "500+ Cars & Counting", desc: "Trusted by car lovers across 8 cities. Every car is a relationship earned." },
];

const testimonials = [
  { name: "Arjun Das", area: "Salt Lake", text: "Ceramic coating done at my home. Car looks better than showroom delivery day.", service: "Ceramic" },
  { name: "Priya Sharma", area: "New Town", text: "Deep glossy shine even after weeks. The water just rolls off. Incredible.", service: "Ceramic" },
  { name: "Sourav Mitra", area: "Howrah", text: "PPF installed flawlessly. They explained every step. True professionals.", service: "PPF" },
  { name: "Debanjali Roy", area: "Rajarhat", text: "Graphene coating at my doorstep — the water beading is unreal!", service: "Graphene" },
  { name: "Rahul Ghosh", area: "Garia", text: "No driving to a studio, no waiting. They came, they detailed, car shines.", service: "PPF" },
  { name: "Tanushree Paul", area: "Behala", text: "Worth every rupee. My neighbours keep asking who did the car.", service: "Ceramic" },
];

const steps = [
  { num: "1", title: "Message Us", desc: "WhatsApp us your car model, service and area." },
  { num: "2", title: "We Arrive", desc: "Fully-equipped team reaches your doorstep on time." },
  { num: "3", title: "We Detail", desc: "Premium products, master technicians, zero shortcuts." },
  { num: "4", title: "You Shine", desc: "Walk out to a car that turns every head on the street." },
];

const faqs = [
  { q: "Do you really come to my home?", a: "Yes! 100% doorstep service. We bring everything — power, water, products, equipment." },
  { q: "How long does ceramic coating take?", a: "Typically 6–8 hours for a full ceramic coating, done in a single day at your location." },
  { q: "Which areas do you cover?", a: "Kolkata, Howrah, Hooghly, Serampore, Kalyani, Durgapur, Bardhaman, Kalna — and nearby areas." },
  { q: "Is doorstep quality same as studio?", a: "Yes. Same products, same technicians, same process. We just need a shaded parking spot." },
];

// --- Official full-color social brand icons (inline SVG) ---
function IGIcon({ size = 18 }) {
  const gid = "ig-grad";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ verticalAlign: "middle", marginRight: 7 }}>
      <defs>
        <radialGradient id={gid} cx="30%" cy="107%" r="135%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${gid})`} />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" />
    </svg>
  );
}
function FBIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ verticalAlign: "middle", marginRight: 7 }}>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#1877F2" />
      <path d="M15.4 12.3l.36-2.35h-2.25V8.42c0-.64.31-1.27 1.32-1.27h1.02V5.15s-.93-.16-1.82-.16c-1.86 0-3.07 1.13-3.07 3.16v1.8H8.86v2.35h2.12V18h2.6v-5.7h1.82z" fill="#fff" />
    </svg>
  );
}
function YTIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ verticalAlign: "middle", marginRight: 7 }}>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
      <path d="M10 8.5l5.5 3.5L10 15.5z" fill="#fff" />
    </svg>
  );
}

function Reveal({ children, delay = 0 }) {
  const [show, setShow] = useState(false);
  const [ref, setRef] = useState(null);
  useEffect(() => {
    if (!ref) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); o.disconnect(); } }, { threshold: 0.12 });
    o.observe(ref); return () => o.disconnect();
  }, [ref]);
  return <div ref={setRef} className={`reveal ${show ? "in" : ""}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Head({ eyebrow, title, sub }) {
  return (
    <Reveal>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display" style={{ fontSize: "clamp(28px, 7vw, 46px)", fontWeight: 700, color: "#ffffff" }}>{title}</h2>
        {sub && <p style={{ color: "#85858d", marginTop: 10, fontSize: 15 }}>{sub}</p>}
      </div>
    </Reveal>
  );
}

/* PAGES */
function HomePage({ go, services }) {
  const [activeBA, setActiveBA] = useState(0);
  const [slider, setSlider] = useState(50);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", city: "", vehicle: "", service: "" });
  const fc = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async () => {
    if (!form.name || !form.phone) return alert("Please enter your name and phone number.");
    try {
      await supabase.from("bookings").insert([{ name: form.name, phone: form.phone, city: form.city, vehicle: form.vehicle, service: form.service }]);
    } catch (e) { /* save best-effort, still open WhatsApp */ }
    window.open(waLink(`Hi ShineX! I want a free quote.\n\nName: ${form.name}\nPhone: ${form.phone}\nCity: ${form.city}\nVehicle: ${form.vehicle}\nService: ${form.service}`), "_blank");
  };
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* HERO — premium reference style */}
      <header className="hero">
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className="hero-strip" />
        <img src="/img/hero-car.png" alt="Premium car detailing" className="hero-photo" />
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <div className="badge">🏠 Doorstep Service · West Bengal</div>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Doorstep Detailing · West Bengal</p>
            <h1 className="display hero-h1">
              <span className="line1 shine-text">Detailing.</span>
              <span className="line2">Showroom Shine.</span>
              <span className="line1 shine-text">At Your Door.</span>
            </h1>
            <div className="hero-rule" />
            <p className="hero-sub">
              Premium ceramic coating, graphene & PPF — installed at your home by master technicians. <strong style={{ color: "#fff" }}>We come to you.</strong>
            </p>
            <div className="hero-feats">
              {[["🛡️", "9H Hardness", "Shield Protection"], ["💧", "Hydrophobic", "Water Repellent"], ["☀️", "UV Protection", "Prevents Fading"], ["✨", "Long Lasting", "Mirror Finish"]].map(([ic, t, s]) => (
                <div key={t} className="hero-feat"><span className="hf-ic">{ic}</span><b className="display">{t}</b><span className="hf-s">{s}</span></div>
              ))}
            </div>
            <div className="hero-cta">
              <a href={waLink("Hi ShineX! I want a free quote.")} target="_blank" rel="noreferrer" className="btn btn-red">Book Appointment →</a>
              <button onClick={() => scrollTo("services")} className="btn btn-ghost">Explore Packages →</button>
            </div>
            <div className="hero-trust"><span className="ht-shield">🛡️</span> TRUSTED BY 500+ CAR OWNERS ACROSS WEST BENGAL</div>
          </div>
        </div>
        <div className="wrap hero-stats">
          {[["500+", "Cars Detailed"], ["10+", "Years Exp."], ["5★", "Rated"], ["8", "Cities"]].map(([n, l]) => (
            <div key={l}><div className="display stat-n">{n}</div><div className="stat-l">{l}</div></div>
          ))}
        </div>
      </header>

      {/* TAGLINE BAND */}
      <div className="tagline-band">
        <div className="tagline-track">
          {Array(6).fill(0).map((_, i) => (
            <span key={i} className="display">Detailing Beyond Perfection <span style={{ color: "#e10600", margin: "0 18px" }}>✦</span></span>
          ))}
        </div>
      </div>

      {/* SERVICES with images */}
      <section id="services" className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div style={{ padding: "0 20px" }}><Head eyebrow="Our Services" title="Pick Your Protection" sub="Swipe to explore →" /></div>
        <div className="snap-row wrap">
          {services.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 80}>
              <div className="card card-accent svc-card">
                <div className="svc-img-wrap"><img src={svc.img} alt={svc.title} className="svc-img" /><span className="svc-tag display">{svc.tag}</span></div>
                <div style={{ padding: 24 }}>
                  <h3 className="display" style={{ fontSize: 23, fontWeight: 600 }}>{svc.icon} {svc.title}</h3>
                  <div style={{ fontSize: 12, color: "#85858d", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8 }}>Starting from</div>
                  <div className="display" style={{ fontSize: 32, fontWeight: 700, color: "#e10600", margin: "2px 0 12px" }}>{svc.price}</div>
                  <p style={{ color: "#9a9aa3", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{svc.desc}</p>
                  <ul style={{ listStyle: "none", marginBottom: 20 }}>
                    {svc.features.map(f => <li key={f} style={{ fontSize: 13.5, color: "#c9c9cf", padding: "5px 0", display: "flex", gap: 10 }}><span style={{ color: "#e10600", fontWeight: 800 }}>✓</span>{f}</li>)}
                  </ul>
                  <a href={waLink(`Hi! I want to book ${svc.title} (${svc.price}).`)} target="_blank" rel="noreferrer" className="btn btn-red" style={{ width: "100%", padding: 14 }}>Book {svc.title.split(" ")[0]}</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FERRARI SHOWCASE BAND */}
      <section className="ferrari-band">
        <div className="fb-glow" />
        <img src="/img/ferrari.png" alt="Ferrari detailed by ShineX" className="fb-car" />
        <div className="wrap fb-inner">
          <p className="eyebrow">Supercar-Grade Care</p>
          <h2 className="display fb-title">From Hatchbacks<br />To Hypercars.</h2>
          <p className="fb-sub">The same obsessive detailing whether it's your daily driver or a weekend exotic. Showroom finish, every single time.</p>
          <a href={waLink("Hi ShineX! I want premium detailing for my car.")} target="_blank" rel="noreferrer" className="btn btn-red">Book Premium Detail →</a>
        </div>
      </section>

      {/* WHY US */}
      <section className="section" style={{ background: "#101013" }}>
        <div className="wrap">
          <Head eyebrow="Why ShineX" title="Why Choose Us" sub="We're obsessed with perfection — no detail untouched." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
            {whyUs.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card" style={{ height: "100%" }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{item.icon}</div>
                  <h3 className="display" style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: "#e10600" }}>{item.title}</h3>
                  <p style={{ color: "#9a9aa3", fontSize: 13.5, lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section id="results" className="section">
        <div className="wrap">
          <Head eyebrow="Real Results" title="Drag. Compare. Believe." />
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
            {beforeAfters.map((ba, i) => (
              <button key={i} onClick={() => { setActiveBA(i); setSlider(50); }} className="chip"
                style={{ cursor: "pointer", border: activeBA === i ? "1px solid #e10600" : "1px solid #26262c", color: activeBA === i ? "#fff" : "#9a9aa3", background: activeBA === i ? "rgba(225,6,0,0.15)" : "#141417" }}>{ba.label}</button>
            ))}
          </div>
          <div className="ba-wrap">
            <img src={beforeAfters[activeBA].after} alt="After" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, width: `${slider}%`, overflow: "hidden" }}>
              <img src={beforeAfters[activeBA].before} alt="Before" style={{ width: `${100 / (slider / 100)}%`, maxWidth: "none", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="display ba-tag" style={{ left: 14 }}>BEFORE</div>
            <div className="display ba-tag" style={{ right: 14, background: "#e10600" }}>AFTER</div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${slider}%`, width: 3, background: "#e10600", transform: "translateX(-50%)" }}>
              <div className="ba-knob">⟺</div>
            </div>
            <input type="range" min={5} max={95} value={slider} onChange={e => setSlider(+e.target.value)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "ew-resize", zIndex: 10, margin: 0 }} />
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}><button onClick={() => go("gallery")} className="btn btn-ghost">View Full Gallery →</button></div>
        </div>
      </section>

      {/* VIDEO SECTION (placeholder for client upload) */}
      <section className="section" style={{ background: "#101013" }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <Head eyebrow="Watch" title="See The Transformation" sub="Our detailing process in action" />
          <Reveal>
            <div className="video-box">
              <img src="/img/video-poster.jpg" alt="Video coming soon" className="video-poster" />
              <div className="video-overlay">
                <div className="play-btn">▶</div>
                <p style={{ marginTop: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 13 }}>Video Coming Soon</p>
              </div>
            </div>
          </Reveal>
          {/* TODO: replace the block above with:
              <video controls poster="/img/video-poster.jpg" style={{width:"100%",borderRadius:14}}>
                <source src="/your-video.mp4" type="video/mp4" />
              </video>  */}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="wrap">
          <Head eyebrow="How It Works" title="Four Steps To Shine" />
          <div className="steps-grid">
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 70}>
                <div className="card" style={{ display: "flex", gap: 18 }}>
                  <div className="display" style={{ fontSize: 40, fontWeight: 700, color: "#e10600", lineHeight: 1 }}>{s.num}</div>
                  <div><h3 className="display" style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{s.title}</h3><p style={{ color: "#9a9aa3", fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="section" style={{ background: "#101013", paddingTop: 56, paddingBottom: 56 }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <Head eyebrow="Service Areas" title="Serving All Of West Bengal" />
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {cities.map(c => <span key={c} className="chip">📍 {c}</span>)}
          </div>
          <p style={{ color: "#85858d", marginTop: 22, fontSize: 14 }}>Your city not listed? <a href={waLink("Hi! Is ShineX available in my city?")} target="_blank" rel="noreferrer" style={{ color: "#e10600", fontWeight: 700 }}>Ask us →</a></p>
        </div>
      </section>

      {/* TESTIMONIALS — auto-scrolling marquee */}
      <section className="section" style={{ paddingLeft: 0, paddingRight: 0, overflow: "hidden" }}>
        <div style={{ padding: "0 20px" }}><Head eyebrow="Customer Stories" title="They Came. They Shined." /></div>
        <div className="review-marquee">
          <div className="review-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="card review-card">
                <div style={{ color: "#e10600", fontSize: 16, letterSpacing: 3, marginBottom: 14 }}>★★★★★</div>
                <p style={{ color: "#d6d6da", fontSize: 14.5, lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div><div style={{ color: "#85858d", fontSize: 12 }}>{t.area}</div></div>
                  <span className="display" style={{ fontSize: 10, color: "#e10600", border: "1px solid rgba(225,6,0,0.4)", padding: "4px 10px", borderRadius: 4, letterSpacing: "0.1em" }}>{t.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section" style={{ background: "#101013" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Head eyebrow="FAQ" title="Questions? Answered." />
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{f.q}</span><span style={{ color: "#e10600", fontSize: 20, fontWeight: 700 }}>{openFaq === i ? "−" : "+"}</span></div>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE FORM */}
      <section id="book" className="section">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <Head eyebrow="Free Quote" title="Get Your Price In Minutes" sub="We reply on WhatsApp within 1 hour" />
          <div className="card card-accent" style={{ padding: 28 }}>
            <input name="name" placeholder="Your Name *" value={form.name} onChange={fc} />
            <input name="phone" type="tel" placeholder="Phone Number *" value={form.phone} onChange={fc} />
            <input name="city" placeholder="Your City" value={form.city} onChange={fc} />
            <input name="vehicle" placeholder="Your Vehicle (e.g. Hyundai Creta)" value={form.vehicle} onChange={fc} />
            <select name="service" value={form.service} onChange={fc} style={{ color: form.service ? "#fff" : "#666" }}>
              <option value="">Select A Service</option>
              {services.map(s => <option key={s.id} value={s.title}>{s.title} — {s.price}</option>)}
            </select>
            <button onClick={submit} className="btn btn-red" style={{ width: "100%", padding: 17, marginTop: 6 }}>📲 Send On WhatsApp</button>
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <div className="page-pad"><div className="wrap" style={{ maxWidth: 760 }}>
      <Head eyebrow="About ShineX" title="Perfection Is In The Detail" />
      <img src="/img/svc-ceramic.jpg" alt="ShineX detailing" style={{ width: "100%", borderRadius: 14, marginBottom: 28 }} />
      <p className="body-text">ShineX Car Detailing is West Bengal's premium doorstep car care service. Your car deserves showroom-level care — without driving across town or leaving it with strangers. So we flipped the model: <strong style={{ color: "#fff" }}>we come to you.</strong></p>
      <p className="body-text">Our fully-equipped mobile team brings professional-grade ceramic coatings, graphene coatings and paint protection films directly to your home or office. Same products, same trained hands, same obsessive attention to detail — at your doorstep.</p>
      <div style={{ margin: "48px 0" }}>
        <Head eyebrow="Our Journey" title="The Road So Far" />
        {journey.map((j, i) => (
          <Reveal key={i} delay={i * 80}><div style={{ display: "flex", gap: 20, paddingBottom: 28 }}>
            <div style={{ flexShrink: 0, width: 64 }}><div className="display" style={{ fontSize: 20, fontWeight: 700, color: "#e10600" }}>{j.year}</div></div>
            <div style={{ borderLeft: "2px solid #26262c", paddingLeft: 20 }}><h3 className="display" style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{j.title}</h3><p style={{ color: "#9a9aa3", fontSize: 14, lineHeight: 1.65 }}>{j.desc}</p></div>
          </div></Reveal>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, textAlign: "center" }}>
        {[["500+", "Cars Detailed"], ["10+", "Years"], ["8", "Cities"]].map(([n, l]) => (
          <div key={l} className="card" style={{ padding: 20 }}><div className="display" style={{ fontSize: 28, fontWeight: 700, color: "#e10600" }}>{n}</div><div style={{ fontSize: 11, color: "#85858d", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{l}</div></div>
        ))}
      </div>
    </div></div>
  );
}

function GalleryPage({ gallery }) {
  return (
    <div className="page-pad"><div className="wrap">
      <Head eyebrow="Our Work" title="Gallery" sub="Real transformations, real shine" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {gallery.map((g, i) => (
          <Reveal key={i} delay={(i % 3) * 70}>
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #232328", background: "#141417" }}>
              <img src={g.src} alt={g.label} loading="lazy" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#c9c9cf" }}>{g.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <p style={{ textAlign: "center", color: "#85858d", fontSize: 14, marginTop: 28 }}>Want your car here? <a href={waLink("Hi ShineX! I want my car detailed.")} target="_blank" rel="noreferrer" style={{ color: "#e10600", fontWeight: 700 }}>Book your service →</a></p>
    </div></div>
  );
}

function ContactPage() {
  return (
    <div className="page-pad"><div className="wrap" style={{ maxWidth: 640 }}>
      <Head eyebrow="Contact Us" title="Let's Talk" sub="We reply within 1 hour, 7 days a week" />
      <div style={{ display: "grid", gap: 14 }}>
        <a href={waLink("Hi ShineX! I have a question.")} target="_blank" rel="noreferrer" className="card contact-row"><span style={{ fontSize: 28 }}>💬</span><div><div className="cl">WhatsApp (fastest)</div><div className="cv">{WHATSAPP_DISPLAY}</div></div></a>
        <a href={`tel:${PHONE}`} className="card contact-row"><span style={{ fontSize: 28 }}>📞</span><div><div className="cl">Call Us</div><div className="cv">{PHONE_DISPLAY}</div></div></a>
        <a href={`mailto:${EMAIL}`} className="card contact-row"><span style={{ fontSize: 28 }}>✉️</span><div><div className="cl">Email</div><div className="cv">{EMAIL}</div></div></a>
        <div className="card contact-row"><span style={{ fontSize: 28 }}>📍</span><div><div className="cl">Service Area</div><div className="cv">Kolkata & West Bengal</div></div></div>
      </div>
      <div style={{ marginTop: 32 }}>
        <p className="eyebrow" style={{ textAlign: "center" }}>Find Us</p>
        <div className="map-box">
          <iframe src={MAPS_EMBED} loading="lazy" title="ShineX location" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <div style={{ color: "#c9c9cf", fontSize: 14, fontWeight: 600 }}>📍 {ADDRESS}</div>
          <div style={{ color: "#85858d", fontSize: 13, marginTop: 4 }}>Landmark: {LANDMARK}</div>
          <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 14, padding: "11px 22px" }}>🧭 Open in Google Maps</a>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
        <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: "12px 22px" }}><IGIcon /> Instagram</a>
        <a href={FACEBOOK} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: "12px 22px" }}><FBIcon /> Facebook</a>
        <a href={YOUTUBE} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: "12px 22px" }}><YTIcon /> YouTube</a>
      </div>
    </div></div>
  );
}

function LegalPage({ kind }) {
  const privacy = kind === "privacy";
  return (
    <div className="page-pad"><div className="wrap legal" style={{ maxWidth: 720 }}>
      <Head eyebrow="Legal" title={privacy ? "Privacy Policy" : "Terms & Conditions"} />
      <p>Last updated: June 2026</p>
      {privacy ? <>
        <h3>Information We Collect</h3><p>When you contact ShineX through our website, WhatsApp or phone, we collect only what you provide: name, phone, city, vehicle details and service requirements — used solely to respond and deliver our services.</p>
        <h3>How We Use It</h3><p>To provide quotes, schedule services, communicate about your booking and follow up on quality.</p>
        <h3>What We Don't Do</h3><p>We never sell, rent or trade your personal information to third parties.</p>
        <h3>Your Rights</h3><p>Request deletion of your details anytime via WhatsApp at {WHATSAPP_DISPLAY}.</p>
        <h3>Contact</h3><p>{EMAIL} · WhatsApp {WHATSAPP_DISPLAY}.</p>
      </> : <>
        <h3>Services</h3><p>ShineX provides doorstep detailing (ceramic, graphene, PPF) across West Bengal. Listed prices are starting prices; final quotes depend on vehicle size and condition.</p>
        <h3>Booking & Payment</h3><p>Bookings confirmed via WhatsApp or phone. Quoted prices valid 7 days.</p>
        <h3>Service Requirements</h3><p>For doorstep service, please provide a shaded parking spot with reasonable access.</p>
        <h3>Warranty</h3><p>Coating warranties are product-specific and explained at service time, valid under recommended maintenance.</p>
        <h3>Cancellation</h3><p>Reschedule or cancel up to 24 hours before the appointment without charge.</p>
        <h3>Contact</h3><p>{EMAIL} · WhatsApp {WHATSAPP_DISPLAY}.</p>
      </>}
    </div></div>
  );
}

function AdminPage({ offerText, setOfferText, offerOpen, setOfferOpen, authed, setAuthed, pwd, setPwd }) {
  const login = () => {
    if (pwd === "shinex2026") setAuthed(true);
    else alert("Wrong password. (Hint: set by your developer)");
  };
  if (!authed) {
    return (
      <div className="page-pad"><div className="wrap admin-card">
        <Head eyebrow="Staff Only" title="Admin Login" />
        <div className="card card-accent" style={{ padding: 28 }}>
          <input type="password" placeholder="Enter admin password" value={pwd} onChange={(e) => setPwd(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
          <button onClick={login} className="btn btn-red" style={{ width: "100%", padding: 15, marginTop: 4 }}>Login</button>
          <p style={{ color: "#85858d", fontSize: 12.5, marginTop: 14, textAlign: "center" }}>This is a lightweight admin. Full dashboard with database is available as an upgrade.</p>
        </div>
      </div></div>
    );
  }
  return (
    <div className="page-pad"><div className="wrap admin-card">
      <Head eyebrow="Dashboard" title="Manage Site" />
      <div className="card card-accent" style={{ padding: 28 }}>
        <label className="cl" style={{ display: "block", marginBottom: 8 }}>Special Offer Text</label>
        <input value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="Offer text" />
        <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "8px 0 18px" }}>
          <button onClick={() => setOfferOpen(!offerOpen)} className="btn btn-ghost" style={{ padding: "10px 18px", fontSize: 13 }}>
            {offerOpen ? "Hide" : "Show"} Offer Bar
          </button>
          <span style={{ color: "#85858d", fontSize: 13 }}>Currently: <strong style={{ color: offerOpen ? "#1faa53" : "#e10600" }}>{offerOpen ? "Visible" : "Hidden"}</strong></span>
        </div>
        <div style={{ background: "#101013", borderRadius: 10, padding: 16, border: "1px solid #232328" }}>
          <div className="cl" style={{ marginBottom: 8 }}>Live Preview</div>
          <div style={{ background: "linear-gradient(90deg,#e10600,#ff3b30)", color: "#fff", padding: "8px 14px", borderRadius: 6, fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 13 }}>{offerText}</div>
        </div>
        <button onClick={() => setAuthed(false)} className="footer-link" style={{ marginTop: 20, color: "#e10600" }}>Log out</button>
      </div>
      <p style={{ color: "#85858d", fontSize: 12.5, marginTop: 16, textAlign: "center", lineHeight: 1.6 }}>
        Note: changes here are temporary (reset on refresh). For permanent changes saved to a database and visible to all visitors, ask your developer about the Phase 2 upgrade.
      </p>
    </div></div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(true);
  const [admin, setAdmin] = useState(false);

  // --- SEO: document title, meta description & LocalBusiness structured data ---
  useEffect(() => {
    document.title = "ShineX Car Detailing | Doorstep Ceramic Coating in Kolkata & West Bengal";
    const setMeta = (name, content, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    const desc = "Premium doorstep car detailing & ceramic coating across Kolkata and West Bengal. We come to your home or office. Ceramic, graphene & paint protection by trained technicians. Book on WhatsApp today.";
    setMeta("description", desc);
    setMeta("keywords", "car detailing Kolkata, ceramic coating Kolkata, doorstep car detailing, paint protection film, graphene coating West Bengal, car detailing near me");
    setMeta("og:title", "ShineX Car Detailing | Doorstep Ceramic Coating in Kolkata", "property");
    setMeta("og:description", desc, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", "https://shinexcardetailing.com", "property");
    setMeta("og:image", "https://shinexcardetailing.com/shinex-logo.png", "property");
    setMeta("twitter:card", "summary_large_image");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://shinexcardetailing.com");
    let ld = document.getElementById("shinex-ldjson");
    if (!ld) { ld = document.createElement("script"); ld.type = "application/ld+json"; ld.id = "shinex-ldjson"; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "AutoDetailing", "name": "ShineX Car Detailing",
      "image": "https://shinexcardetailing.com/shinex-logo.png", "url": "https://shinexcardetailing.com",
      "telephone": "+917349152274", "email": EMAIL, "priceRange": "₹₹",
      "address": { "@type": "PostalAddress", "addressLocality": "Kolkata", "addressRegion": "West Bengal", "addressCountry": "IN" },
      "areaServed": cities.map((c) => ({ "@type": "City", "name": c })),
      "sameAs": [INSTAGRAM, FACEBOOK, YOUTUBE], "description": desc
    });
  }, []);

  const [offerText, setOfferText] = useState("🎉 MONSOON OFFER — Flat 15% OFF on Ceramic Coating this month! 🎉");
  const [pwd, setPwd] = useState("");
  const [services, setServices] = useState(servicesFallback);
  const [gallery, setGallery] = useState(galleryFallback);

  // --- Load services from Supabase ---
  useEffect(() => {
    async function loadServices() {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error || !data || data.length === 0) return;
      setServices(data.map((s) => ({
        id: s.id, icon: s.icon, title: s.title, price: s.price,
        img: s.image, desc: s.description, features: s.features || [], tag: s.tag,
      })));
    }
    loadServices();
  }, []);

  // --- Load gallery from Supabase ---
  useEffect(() => {
    async function loadGallery() {
      const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
      if (error || !data || data.length === 0) return;
      setGallery(data.map((g) => ({ src: g.src, label: g.label })));
    }
    loadGallery();
  }, []);

  // --- Load offer bar settings from Supabase ---
  useEffect(() => {
    async function loadOffer() {
      const { data, error } = await supabase.from("settings").select("key, value");
      if (error || !data) return;
      const map = {};
      data.forEach((row) => { map[row.key] = row.value; });
      if (map.offer_text) setOfferText(map.offer_text);
      if (map.offer_open !== undefined) setOfferOpen(map.offer_open === "true");
    }
    loadOffer();
  }, []);
  const go = (p) => { setPage(p); setMenuOpen(false); setNotifOpen(false); window.scrollTo(0, 0); };
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; }, [menuOpen]);

  const navItems = [{ id: "home", label: "Home" }, { id: "about", label: "About Us" }, { id: "gallery", label: "Gallery" }, { id: "contact", label: "Contact" }];
  const notifs = [
    { icon: "🎉", title: "Monsoon Offer!", desc: "Flat 15% off on Ceramic Coating this month." },
    { icon: "🚗", title: "Now in Durgapur", desc: "Doorstep service just expanded to your area." },
    { icon: "⭐", title: "500+ Cars Detailed", desc: "Thank you for trusting ShineX!" },
  ];

  return (
    <div className={`sx-root ${offerOpen ? "has-offer" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        html { scroll-behavior: smooth; }
        .sx-root { font-family: 'Inter', system-ui, sans-serif; background: #0b0b0d; color: #f2f2f4; overflow-x: hidden; }
        .display { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; }
        .eyebrow { font-family: 'Oswald', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: #e10600; margin-bottom: 12px; }
        .section { padding: 72px 20px; }
        .wrap { max-width: 1100px; margin: 0 auto; }
        .page-pad { padding: 130px 20px 80px; min-height: 70vh; }
        .body-text { color: #b9b9c0; font-size: 15.5px; line-height: 1.8; margin-bottom: 18px; }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }

        /* HERO */
        .hero { position: relative; padding: 130px 0 44px; display: flex; flex-direction: column; justify-content: center; overflow: hidden; background: radial-gradient(70% 60% at 82% 38%, rgba(225,6,0,0.20), transparent 60%), linear-gradient(180deg,#070708,#0c0c0f); }
        .has-offer .hero { padding-top: 150px; }
        .hero-glow { position: absolute; top: 20%; right: 4%; width: 70vw; height: 60vh; background: radial-gradient(ellipse at center, rgba(225,6,0,0.22) 0%, transparent 62%); filter: blur(18px); pointer-events: none; }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 44px 44px; mask-image: radial-gradient(ellipse at 28% 40%, #000 22%, transparent 72%); }
        .hero-strip { position: absolute; left: 50%; top: 0; width: 2px; height: 50%; background: linear-gradient(#e10600, transparent); box-shadow: 0 0 18px #e10600; opacity: .5; }
        .hero-photo { position: absolute; right: -6%; top: 50%; transform: translateY(-50%); width: 64%; max-width: 800px; height: auto; z-index: 1; object-fit: contain; -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 32%); mask-image: linear-gradient(90deg, transparent 0%, #000 32%); filter: drop-shadow(0 30px 50px rgba(0,0,0,0.6)); opacity: 0; animation: carin 1.1s cubic-bezier(.16,1,.3,1) .3s forwards; }
        @keyframes carin { from { opacity: 0; transform: translateY(-50%) translateX(40px) scale(.97); } to { opacity: .92; transform: translateY(-50%); } }
        @keyframes rise { to { opacity: 1; transform: none; } }
        .hero-inner { position: relative; z-index: 3; padding: 0 20px; }
        .hero-copy { text-align: left; max-width: 600px; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(225,6,0,0.14); border: 1px solid rgba(225,6,0,0.45); border-radius: 999px; padding: 7px 16px; font-size: 12px; font-weight: 700; color: #ff8a85; margin-bottom: 18px; letter-spacing: 0.1em; text-transform: uppercase; }
        .hero-h1 { font-family: 'Archivo Black', sans-serif; font-weight: 900; letter-spacing: 2px; font-size: clamp(32px, 8.5vw, 68px); line-height: 1.04; margin-bottom: 4px; }
        .hero-h1 span { display: block; }
        .hero-h1 .line2 { color: #e10600; }
        .hero-rule { width: 54px; height: 3px; background: #e10600; margin: 18px 0; }
        .hero-sub { font-size: clamp(15px, 4vw, 17px); color: #c2c2c9; max-width: 440px; margin: 0 0 26px; line-height: 1.6; }
        .hero-feats { display: flex; flex-wrap: wrap; gap: 0; margin-bottom: 28px; }
        .hero-feat { padding: 0 16px; border-left: 1px solid rgba(255,255,255,0.1); }
        .hero-feat:first-child { padding-left: 0; border-left: none; }
        .hf-ic { font-size: 20px; }
        .hero-feat b { display: block; font-size: 13px; font-weight: 600; letter-spacing: 0.03em; margin-top: 6px; color: #fff; }
        .hf-s { font-size: 11px; color: #85858d; }
        .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-trust { display: flex; align-items: center; gap: 10px; margin-top: 26px; color: #85858d; font-size: 12px; letter-spacing: 0.08em; font-family: 'Oswald', sans-serif; }
        .ht-shield { font-size: 18px; }
        @media (max-width: 859px) {
          .hero-photo { position: relative; right: auto; top: auto; transform: none; width: 118%; max-width: none; margin: 6px 0 -6% -9%; -webkit-mask-image: linear-gradient(180deg,#000 72%,transparent); mask-image: linear-gradient(180deg,#000 72%,transparent); animation: carinm 1s ease .25s forwards; }
          @keyframes carinm { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
          .hero-copy { max-width: 100%; }
          .hero-feat { padding: 0 12px; margin-bottom: 8px; }
        }
        @media (prefers-reduced-motion: reduce) { .hero-photo { animation: none; opacity: .92; } }
        .hero-stats { position: relative; z-index: 3; display: flex; gap: 28px; justify-content: flex-start; margin-top: 30px; padding: 22px 20px 0; border-top: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap; }
        .stat-n { font-size: 24px; font-weight: 700; color: #e10600; }
        .stat-l { font-size: 11px; color: #85858d; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 2px; }

        .shine-text { background: linear-gradient(110deg, #d8d8de 28%, #ffffff 46%, #7a7a82 50%, #d8d8de 54%, #d8d8de 72%); background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: sweep 4.5s ease-in-out infinite; }
        .hero-h1 .shine-text { animation: rise .7s ease forwards, sweep 4.5s ease-in-out infinite; }
        @keyframes sweep { 0%{background-position:100% 0;} 60%{background-position:0 0;} 100%{background-position:0 0;} }

        .snap-row { display: flex; gap: 14px; overflow-x: auto; padding: 4px 20px 18px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .snap-row::-webkit-scrollbar { display: none; }
        .snap-row > * { scroll-snap-align: center; flex: 0 0 86%; }
        @media (min-width: 760px) { .snap-row { display: grid; grid-template-columns: repeat(3, 1fr); overflow: visible; padding: 0; } .snap-row > * { flex: none; } }
        .card { background: #141417; border: 1px solid #232328; border-radius: 14px; padding: 26px; position: relative; }
        .card-accent { border-top: 3px solid #e10600; }
        .svc-card { padding: 0; overflow: hidden; }
        .svc-img-wrap { position: relative; aspect-ratio: 16/10; overflow: hidden; }
        .svc-img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
        .svc-card:hover .svc-img { transform: scale(1.07); }
        .svc-tag { position: absolute; top: 12px; right: 12px; background: #e10600; color: #fff; font-size: 10px; font-weight: 600; padding: 5px 10px; border-radius: 4px; letter-spacing: 0.15em; }
        /* FERRARI SHOWCASE BAND */
        .ferrari-band { position: relative; overflow: hidden; padding: 84px 20px; background: radial-gradient(80% 90% at 16% 50%, rgba(225,6,0,0.16), transparent 60%), linear-gradient(135deg,#0c0c0f,#070708); border-top: 1px solid #1d1d21; border-bottom: 1px solid #1d1d21; }
        .fb-glow { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 60vw; height: 60vh; background: radial-gradient(ellipse at center, rgba(225,6,0,0.22), transparent 62%); filter: blur(20px); pointer-events: none; }
        .fb-car { position: absolute; right: -8%; top: 50%; transform: translateY(-50%); width: 58%; max-width: 740px; z-index: 1; filter: drop-shadow(0 30px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 50px rgba(225,6,0,0.35)); }
        .fb-inner { position: relative; z-index: 2; max-width: 1100px; }
        .fb-title { font-size: clamp(30px, 8vw, 56px); font-weight: 700; line-height: 1; margin: 10px 0 16px; color: #fff; }
        .fb-sub { color: #b9b9c0; font-size: 15px; line-height: 1.6; max-width: 380px; margin-bottom: 24px; }
        @media (max-width: 859px) {
          .fb-car { position: relative; right: auto; top: auto; transform: none; width: 118%; max-width: none; margin: 0 0 18px -9%; display: block; }
          .ferrari-band { padding: 54px 20px; }
        }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Oswald', sans-serif; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 8px; cursor: pointer; text-decoration: none; border: none; transition: transform .15s ease; }
        .btn:active { transform: scale(0.97); }
        .btn-red { background: linear-gradient(135deg, #e10600, #ff3b30); color: #fff; padding: 16px 30px; font-size: 14px; box-shadow: 0 8px 24px rgba(225,6,0,0.35); }
        .btn-ghost { background: rgba(255,255,255,0.06); color: #fff; border: 1px solid #2e2e34; padding: 15px 26px; font-size: 14px; }
        .chip { background: #141417; border: 1px solid #26262c; border-radius: 999px; padding: 9px 18px; font-size: 13px; font-weight: 600; color: #d6d6da; white-space: nowrap; }
        input, select { width: 100%; background: #18181c; border: 1px solid #2a2a30; border-radius: 10px; padding: 15px 16px; color: #fff; font-size: 16px; margin-bottom: 12px; outline: none; font-family: 'Inter', sans-serif; }
        input:focus, select:focus { border-color: #e10600; }
        .ba-wrap { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 4/3; user-select: none; border: 1px solid #232328; }
        @media (min-width: 760px) { .ba-wrap { aspect-ratio: 16/9; } }
        .ba-tag { position: absolute; top: 14px; background: rgba(0,0,0,0.75); padding: 5px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; }
        .ba-knob { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 42px; height: 42px; background: #e10600; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; color: #fff; box-shadow: 0 4px 16px rgba(225,6,0,0.5); }
        .video-box { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 16/9; border: 1px solid #232328; }
        .video-poster { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.5); }
        .video-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; }
        .play-btn { width: 76px; height: 76px; border-radius: 50%; background: rgba(225,6,0,0.92); display: flex; align-items: center; justify-content: center; font-size: 28px; padding-left: 6px; box-shadow: 0 0 0 0 rgba(225,6,0,0.6); animation: pulse 2s infinite; }
        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(225,6,0,0.6);} 70%{box-shadow:0 0 0 22px rgba(225,6,0,0);} 100%{box-shadow:0 0 0 0 rgba(225,6,0,0);} }
        .faq-item { border-bottom: 1px solid #232328; }
        .faq-q { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px 0; cursor: pointer; font-weight: 600; font-size: 15px; }
        .faq-a { color: #9a9aa3; font-size: 14px; line-height: 1.7; padding-bottom: 18px; }
        .steps-grid { display: grid; gap: 14px; } @media (min-width: 760px) { .steps-grid { grid-template-columns: repeat(4, 1fr); } }
        .contact-row { display: flex; gap: 18px; align-items: center; text-decoration: none; }
        .cl { font-size: 12px; color: #85858d; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 3px; } .cv { font-size: 16px; font-weight: 700; color: #f2f2f4; }
        .legal h3 { font-family: 'Oswald', sans-serif; font-size: 18px; text-transform: uppercase; color: #e10600; margin: 28px 0 10px; }
        .legal p { color: #b9b9c0; font-size: 14.5px; line-height: 1.75; margin-bottom: 12px; }
        .footer-grid { display: grid; gap: 32px; } @media (min-width: 760px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
        .footer-link { color: #85858d; font-size: 14px; margin-bottom: 9px; cursor: pointer; background: none; border: none; display: block; text-align: left; font-family: 'Inter', sans-serif; padding: 0; }

        /* NAV */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 260; background: rgba(11,11,13,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #1d1d21; }
        .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 92px; padding: 0 16px; }
        .nav-links { display: none; }
        @media (min-width: 760px) { .nav-links { display: flex; gap: 22px; align-items: center; } }
        .nav-link { cursor: pointer; color: #c9c9cf; font-size: 14px; font-weight: 600; background: none; border: none; font-family: 'Inter', sans-serif; }
        .nav-link.active { color: #e10600; }
        .nav-actions { display: flex; align-items: center; gap: 10px; }
        .icon-btn { position: relative; width: 42px; height: 42px; border-radius: 10px; background: #161619; border: 1px solid #26262c; color: #fff; font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .notif-dot { position: absolute; top: 7px; right: 7px; width: 9px; height: 9px; background: #e10600; border-radius: 50%; border: 2px solid #0b0b0d; }
        .call-btn { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg,#e10600,#ff3b30); color: #fff; padding: 10px 16px; border-radius: 10px; font-family: 'Oswald',sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.08em; text-decoration: none; text-transform: uppercase; }
        .hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 9px; }
        .hamburger span { width: 24px; height: 2.5px; background: #fff; border-radius: 2px; transition: all .25s ease; }
        .hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
        @media (min-width: 760px) { .hamburger { display: none; } }
        .notif-panel { position: absolute; top: 84px; right: 12px; width: 290px; background: #141417; border: 1px solid #2a2a30; border-radius: 14px; padding: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); z-index: 270; }
        .notif-item { display: flex; gap: 12px; padding: 12px; border-radius: 10px; }
        .notif-item:active { background: #1b1b1f; }
        .menu-drawer { position: fixed; inset: 0; z-index: 250; background: rgba(11,11,13,0.98); backdrop-filter: blur(10px); display: flex; flex-direction: column; justify-content: center; padding: 40px 32px; }
        .menu-item { font-family: 'Oswald', sans-serif; font-size: 30px; font-weight: 600; text-transform: uppercase; color: #f2f2f4; background: none; border: none; text-align: left; padding: 14px 0; cursor: pointer; letter-spacing: 0.05em; border-bottom: 1px solid #1d1d21; }
        .menu-item.active { color: #e10600; }

        /* FLOATING BUTTONS */
        .float-stack { position: fixed; right: 18px; bottom: 22px; z-index: 290; display: flex; flex-direction: column; gap: 12px; }
        .fab { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; text-decoration: none; box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
        .fab-wa { background: #1faa53; animation: pulse2 2.4s infinite; }
        .fab-call { background: linear-gradient(135deg,#e10600,#ff3b30); }
        @keyframes pulse2 { 0%{box-shadow:0 0 0 0 rgba(31,170,83,0.5);} 70%{box-shadow:0 0 0 16px rgba(31,170,83,0);} 100%{box-shadow:0 0 0 0 rgba(31,170,83,0);} }
        @media (prefers-reduced-motion: reduce) { .fab-wa, .play-btn { animation: none; } }

        /* OFFER BAR */
        .offer-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 270; background: linear-gradient(90deg,#e10600,#ff3b30); color: #fff; height: 34px; display: flex; align-items: center; overflow: hidden; }
        .offer-track { display: inline-flex; white-space: nowrap; animation: marquee 16s linear infinite; font-family: 'Oswald',sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.08em; }
        .offer-track span { padding: 0 40px; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .offer-close { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.25); border: none; color: #fff; width: 22px; height: 22px; border-radius: 50%; cursor: pointer; font-size: 13px; z-index: 2; }
        .has-offer .nav { top: 34px; }
        .has-offer .hero { padding-top: 126px; }
        @media (prefers-reduced-motion: reduce) { .offer-track { animation: none; } }
        /* SOCIAL ICONS */
        .soc { width: 38px; height: 38px; border-radius: 10px; background: #161619; border: 1px solid #26262c; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; text-decoration: none; }
        .soc:active { border-color: #e10600; }
        .nav-soc { display: none; }
        @media (min-width: 980px) { .nav-soc { display: flex; gap: 8px; } }
        /* MAP */
        .map-box { border-radius: 16px; overflow: hidden; border: 1px solid #232328; }
        .map-box iframe { width: 100%; height: 320px; border: 0; display: block; filter: grayscale(0.3) invert(0.9) hue-rotate(180deg); }
        /* ADMIN */
        .admin-card { max-width: 460px; margin: 0 auto; }
      
        /* REVIEW MARQUEE */
        .review-marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        .review-track { display: flex; gap: 16px; width: max-content; animation: review-scroll 38s linear infinite; padding: 4px 8px; }
        .review-marquee:hover .review-track { animation-play-state: paused; }
        .review-card { flex: 0 0 300px; }
        @keyframes review-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .review-track { animation: none; flex-wrap: wrap; justify-content: center; } }
        /* TAGLINE BAND */
        .tagline-band { background: #101013; border-top: 1px solid #1d1d21; border-bottom: 1px solid #1d1d21; overflow: hidden; padding: 26px 0; }
        .tagline-track { display: inline-flex; white-space: nowrap; animation: marquee 22s linear infinite; }
        .tagline-track span.display { font-size: clamp(28px, 6vw, 44px); font-weight: 700; letter-spacing: 0.14em; color: #ffffff; display: inline-flex; align-items: center; }
        @media (prefers-reduced-motion: reduce) { .tagline-track { animation: none; } }
        /* TEXT / CARD ANIMATIONS */
        .card { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .card:hover { transform: translateY(-5px); border-color: rgba(225,6,0,0.5); box-shadow: 0 14px 34px rgba(0,0,0,0.45); }
        .chip { transition: transform .2s ease, border-color .2s ease; }
        .chip:hover { transform: translateY(-2px); border-color: #e10600; }
        .eyebrow { position: relative; display: inline-block; }
        .stat-n { animation: statpulse 3s ease-in-out infinite; }
        @keyframes statpulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
        @media (prefers-reduced-motion: reduce) { .stat-n { animation: none; } .card:hover { transform: none; } }
            `}</style>

      {/* ANIMATED OFFER BAR */}
      {offerOpen && (
        <div className="offer-bar">
          <div className="offer-track">
            <span>{offerText}</span><span>{offerText}</span>
          </div>
          <button className="offer-close" onClick={() => setOfferOpen(false)} aria-label="Close">×</button>
        </div>
      )}

      {/* NAV */}
      <nav className="nav"><div className="wrap nav-inner">
        <img src="/shinex-logo.png" alt="ShineX Car Detailing" onClick={() => go("home")} style={{ height: 84, width: "auto", objectFit: "contain", cursor: "pointer" }} />
        <div className="nav-links">
          {navItems.map(n => <button key={n.id} className={`nav-link ${page === n.id ? "active" : ""}`} onClick={() => go(n.id)}>{n.label}</button>)}
        </div>
        <div className="nav-actions">
          <div className="nav-soc">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="soc" aria-label="Instagram"><IGIcon /></a>
            <a href={FACEBOOK} target="_blank" rel="noreferrer" className="soc" aria-label="Facebook"><FBIcon /></a>
            <a href={YOUTUBE} target="_blank" rel="noreferrer" className="soc" aria-label="YouTube"><YTIcon /></a>
          </div>
          <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">🔔<span className="notif-dot" /></button>
          <a href={`tel:${PHONE}`} className="call-btn">📞 Call</a>
          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><span /><span /><span /></button>
        </div>
      </div></nav>

      {notifOpen && (
        <div className="notif-panel">
          {notifs.map((n, i) => (
            <div key={i} className="notif-item">
              <span style={{ fontSize: 22 }}>{n.icon}</span>
              <div><div style={{ fontWeight: 700, fontSize: 14 }}>{n.title}</div><div style={{ color: "#9a9aa3", fontSize: 12.5, marginTop: 2 }}>{n.desc}</div></div>
            </div>
          ))}
        </div>
      )}

      {menuOpen && (
        <div className="menu-drawer">
          {navItems.map(n => <button key={n.id} className={`menu-item ${page === n.id ? "active" : ""}`} onClick={() => go(n.id)}>{n.label}</button>)}
          <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: "12px 20px", fontSize: 13 }}><IGIcon /> Instagram</a>
            <a href={FACEBOOK} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: "12px 20px", fontSize: 13 }}><FBIcon /> Facebook</a>
          </div>
          <a href={waLink("Hi ShineX!")} target="_blank" rel="noreferrer" className="btn btn-red" style={{ marginTop: 16, padding: 16 }}>💬 WhatsApp Us</a>
        </div>
      )}

      {page === "home" && <HomePage go={go} services={services} />}
      {page === "about" && <AboutPage />}
      {page === "gallery" && <GalleryPage gallery={gallery} />}
      {page === "contact" && <ContactPage />}
      {page === "privacy" && <LegalPage kind="privacy" />}
      {page === "terms" && <LegalPage kind="terms" />}
      {page === "admin" && <AdminPage offerText={offerText} setOfferText={setOfferText} offerOpen={offerOpen} setOfferOpen={setOfferOpen} authed={admin} setAuthed={setAdmin} pwd={pwd} setPwd={setPwd} />}

      <footer style={{ background: "#070709", borderTop: "1px solid #1d1d21", padding: "56px 20px 40px" }}>
        <div className="wrap footer-grid">
          <div>
            <img src="/shinex-logo.png" alt="ShineX" style={{ height: 76, width: "auto", objectFit: "contain", marginBottom: 16 }} />
            <p style={{ color: "#85858d", fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>West Bengal's premium doorstep car detailing service. Detailing beyond perfection.</p>
            <h4 className="display" style={{ fontSize: 12, fontWeight: 600, color: "#e10600", letterSpacing: "0.2em", margin: "20px 0 12px" }}>FOLLOW US</h4>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="soc" aria-label="Instagram"><IGIcon /></a>
              <a href={FACEBOOK} target="_blank" rel="noreferrer" className="soc" aria-label="Facebook"><FBIcon /></a>
              <a href={YOUTUBE} target="_blank" rel="noreferrer" className="soc" aria-label="YouTube"><YTIcon /></a>
              <a href={waLink("Hi ShineX!")} target="_blank" rel="noreferrer" className="soc" aria-label="WhatsApp">💬</a>
              <a href={`mailto:${EMAIL}`} className="soc" aria-label="Email">✉️</a>
            </div>
          </div>
          <div><h4 className="display" style={{ fontSize: 13, fontWeight: 600, color: "#e10600", letterSpacing: "0.2em", marginBottom: 16 }}>SERVICES</h4>{services.map(s => <div key={s.id} style={{ color: "#85858d", fontSize: 14, marginBottom: 9 }}>{s.title}</div>)}</div>
          <div><h4 className="display" style={{ fontSize: 13, fontWeight: 600, color: "#e10600", letterSpacing: "0.2em", marginBottom: 16 }}>COMPANY</h4>
            <button className="footer-link" onClick={() => go("about")}>About Us</button>
            <button className="footer-link" onClick={() => go("gallery")}>Gallery</button>
            <button className="footer-link" onClick={() => go("contact")}>Contact</button>
            <button className="footer-link" onClick={() => go("privacy")}>Privacy Policy</button>
            <button className="footer-link" onClick={() => go("terms")}>Terms & Conditions</button>
          </div>
          <div><h4 className="display" style={{ fontSize: 13, fontWeight: 600, color: "#e10600", letterSpacing: "0.2em", marginBottom: 16 }}>CONTACT</h4>
            <div style={{ color: "#85858d", fontSize: 14, marginBottom: 9 }}>📍 Kolkata & West Bengal</div>
            <a href={`tel:${PHONE}`} style={{ color: "#85858d", fontSize: 14, display: "block", marginBottom: 9, textDecoration: "none" }}>📞 {PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`} style={{ color: "#85858d", fontSize: 14, display: "block", marginBottom: 9, textDecoration: "none", wordBreak: "break-all" }}>✉️ {EMAIL}</a>
          </div>
        </div>
        <div className="wrap" style={{ borderTop: "1px solid #1d1d21", marginTop: 40, paddingTop: 22, textAlign: "center", color: "#4a4a52", fontSize: 12.5 }}>© 2026 ShineX Car Detailing · All Rights Reserved · Serving Kolkata & West Bengal
          <button onClick={() => go("admin")} style={{ background: "none", border: "none", color: "#2c2c32", fontSize: 12, cursor: "pointer", marginLeft: 8 }}>·  Admin</button>
        </div>
      </footer>

      {/* FLOATING BUTTONS (WhatsApp + Call) */}
      <div className="float-stack">
        <a href={waLink("Hi ShineX! I want to book a service.")} target="_blank" rel="noreferrer" className="fab fab-wa" aria-label="WhatsApp">💬</a>
        <a href={`tel:${PHONE}`} className="fab fab-call" aria-label="Call">📞</a>
      </div>
    </div>
  );
}
