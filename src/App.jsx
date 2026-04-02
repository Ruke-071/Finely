import { useState, useMemo, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2024-01-03", desc: "Salary Deposit",   category: "Income",        amount:  85000, type: "income"  },
  { id: 2,  date: "2024-01-05", desc: "Grocery Store",    category: "Food",          amount:  -3200, type: "expense" },
  { id: 3,  date: "2024-01-07", desc: "Netflix",          category: "Entertainment", amount:   -649, type: "expense" },
  { id: 4,  date: "2024-01-09", desc: "Electricity Bill", category: "Utilities",     amount:  -2100, type: "expense" },
  { id: 5,  date: "2024-01-12", desc: "Freelance Work",   category: "Income",        amount:  12000, type: "income"  },
  { id: 6,  date: "2024-01-15", desc: "Petrol",           category: "Transport",     amount:  -1800, type: "expense" },
  { id: 7,  date: "2024-01-18", desc: "Restaurant",       category: "Food",          amount:  -1450, type: "expense" },
  { id: 8,  date: "2024-01-22", desc: "Rent Payment",     category: "Housing",       amount: -18000, type: "expense" },
  { id: 9,  date: "2024-01-25", desc: "Amazon Purchase",  category: "Shopping",      amount:  -3400, type: "expense" },
  { id: 10, date: "2024-01-28", desc: "Gym Membership",   category: "Health",        amount:  -1200, type: "expense" },
  { id: 11, date: "2024-02-01", desc: "Salary Deposit",   category: "Income",        amount:  85000, type: "income"  },
  { id: 12, date: "2024-02-03", desc: "Grocery Store",    category: "Food",          amount:  -2900, type: "expense" },
  { id: 13, date: "2024-02-06", desc: "Doctor Visit",     category: "Health",        amount:   -800, type: "expense" },
  { id: 14, date: "2024-02-10", desc: "Spotify",          category: "Entertainment", amount:   -119, type: "expense" },
  { id: 15, date: "2024-02-14", desc: "Gift Shopping",    category: "Shopping",      amount:  -2200, type: "expense" },
  { id: 16, date: "2024-02-18", desc: "Petrol",           category: "Transport",     amount:  -1600, type: "expense" },
  { id: 17, date: "2024-02-20", desc: "Freelance Work",   category: "Income",        amount:   9500, type: "income"  },
  { id: 18, date: "2024-02-22", desc: "Rent Payment",     category: "Housing",       amount: -18000, type: "expense" },
  { id: 19, date: "2024-02-25", desc: "Grocery Store",    category: "Food",          amount:  -2600, type: "expense" },
  { id: 20, date: "2024-02-28", desc: "Internet Bill",    category: "Utilities",     amount:   -999, type: "expense" },
  { id: 21, date: "2024-03-01", desc: "Salary Deposit",   category: "Income",        amount:  85000, type: "income"  },
  { id: 22, date: "2024-03-05", desc: "Grocery Store",    category: "Food",          amount:  -3100, type: "expense" },
  { id: 23, date: "2024-03-08", desc: "Movie Tickets",    category: "Entertainment", amount:   -550, type: "expense" },
  { id: 24, date: "2024-03-12", desc: "New Shoes",        category: "Shopping",      amount:  -4500, type: "expense" },
  { id: 25, date: "2024-03-15", desc: "Consulting Gig",   category: "Income",        amount:  15000, type: "income"  },
  { id: 26, date: "2024-03-18", desc: "Electricity Bill", category: "Utilities",     amount:  -1900, type: "expense" },
  { id: 27, date: "2024-03-20", desc: "Taxi Fare",        category: "Transport",     amount:   -420, type: "expense" },
  { id: 28, date: "2024-03-22", desc: "Rent Payment",     category: "Housing",       amount: -18000, type: "expense" },
  { id: 29, date: "2024-03-26", desc: "Grocery Store",    category: "Food",          amount:  -2800, type: "expense" },
  { id: 30, date: "2024-03-30", desc: "Gym Membership",   category: "Health",        amount:  -1200, type: "expense" },
];

const CATEGORY_COLORS = {
  Food: "#f97316", Housing: "#6366f1", Transport: "#06b6d4",
  Entertainment: "#ec4899", Shopping: "#8b5cf6", Utilities: "#14b8a6",
  Health: "#84cc16", Income: "#22c55e",
};

const FEATURES = [
  { icon: "📊", title: "Visual Analytics",    desc: "Interactive charts for balance trends, income vs. expenses, and category breakdowns." },
  { icon: "🔍", title: "Smart Filtering",     desc: "Search, sort, and filter transactions by type, category, or keyword in real time."    },
  { icon: "💡", title: "Spending Insights",   desc: "Highest expense category, monthly deltas, savings rate, and daily averages."          },
  { icon: "🔐", title: "Role-Based Access",   desc: "Viewer for safe browsing; Admin mode to add, edit and delete transactions."           },
  { icon: "🌓", title: "Dark & Light Mode",   desc: "Switch seamlessly between a sleek dark theme and a crisp light theme."                },
  { icon: "📱", title: "Responsive Design",   desc: "Looks great on any screen — desktop, tablet, or mobile."                             },
];

const TESTIMONIALS = [
  { name: "Priya M.",  role: "Freelance Designer", avatar: "P", text: "Finally a finance dashboard that doesn't look like a spreadsheet. Clean, fast, and actually fun to use."                              },
  { name: "Arjun K.",  role: "Software Engineer",  avatar: "A", text: "The insights tab alone saved me from overspending on food twice this month. Love the monthly delta card."                             },
  { name: "Sneha R.",  role: "Product Manager",    avatar: "S", text: "The role-based UI is great for sharing with my partner — she can view without accidentally deleting anything!" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtShort = (n) =>
  n >= 100000 ? `₹${(n/100000).toFixed(1)}L` :
  n >= 1000   ? `₹${(n/1000).toFixed(0)}K`   : `₹${n}`;

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
const EmptyState = ({ message }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"3rem", gap:"0.75rem", opacity:0.5 }}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
      <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem" }}>{message}</p>
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ onClose, onSave, editing }) => {
  const [form, setForm] = useState(editing || { date:"", desc:"", category:"Food", amount:"", type:"expense" });
  const cats = ["Food","Housing","Transport","Entertainment","Shopping","Utilities","Health","Income"];
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handle = () => {
    if (!form.date || !form.desc || !form.amount) return;
    onSave({ ...form, amount: form.type==="expense" ? -Math.abs(+form.amount) : +Math.abs(+form.amount), id: editing ? editing.id : Date.now() });
  };
  const inp = { background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"0.5rem", padding:"0.6rem 0.9rem", color:"var(--text)", fontFamily:"'DM Sans',sans-serif", fontSize:"1rem", outline:"none", width:"100%" };
  const lbl = { display:"flex", flexDirection:"column", gap:"0.4rem", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.06em" };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1.25rem", padding:"2rem", width:"min(480px,90vw)", display:"flex", flexDirection:"column", gap:"1.25rem", boxShadow:"0 24px 60px rgba(0,0,0,0.4)" }}>
        <h3 style={{ margin:0, fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", color:"var(--text)" }}>{editing ? "Edit Transaction" : "New Transaction"}</h3>
        {[["Date","date","date"],["Description","desc","text"]].map(([label,key,type]) => (
          <label key={key} style={lbl}>{label}<input type={type} value={form[key]} onChange={e=>set(key,e.target.value)} style={inp}/></label>
        ))}
        <label style={lbl}>Category
          <select value={form.category} onChange={e=>set("category",e.target.value)} style={inp}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
          <label style={lbl}>Amount (₹)<input type="number" value={form.amount} onChange={e=>set("amount",e.target.value)} style={inp}/></label>
          <label style={lbl}>Type
            <select value={form.type} onChange={e=>{ set("type",e.target.value); if(e.target.value==="income") set("category","Income"); }} style={inp}>
              <option value="expense">Expense</option><option value="income">Income</option>
            </select>
          </label>
        </div>
        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"flex-end", marginTop:"0.5rem" }}>
          <button onClick={onClose} style={{ padding:"0.6rem 1.4rem", borderRadius:"0.5rem", border:"1px solid var(--border)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handle} style={{ padding:"0.6rem 1.4rem", borderRadius:"0.5rem", border:"none", background:"var(--accent)", color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>Save</button>
        </div>
      </div>
    </div>
  );
};

// ─── CHART TOOLTIP ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"0.5rem", padding:"0.6rem 1rem", fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", color:"var(--text)" }}>
      <p style={{ margin:"0 0 0.3rem", color:"var(--muted)", fontSize:"0.75rem" }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ margin:0, color:p.color||"var(--accent)" }}>{p.name}: {fmtShort(p.value)}</p>)}
    </div>
  );
};

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
const Counter = ({ target }) => {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return; done.current = true;
    let cur = 0; const step = target / 60;
    const t = setInterval(() => { cur += step; if (cur >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <span>{val.toLocaleString()}</span>;
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({ onEnter, theme, setTheme }) => {
  const isDark = theme === "dark";
  const miniData = [
    {m:"Jan",v:42000},{m:"Feb",v:55000},{m:"Mar",v:48000},
    {m:"Apr",v:61000},{m:"May",v:57000},{m:"Jun",v:72000},
  ];

  const Logo = () => (
    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
      <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#ec4899)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 10L6 6L9 9L14 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.25rem", fontWeight:700, letterSpacing:"-0.02em", color:"var(--text)" }}>Finely</span>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text)", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, borderBottom:"1px solid var(--border)", background: isDark?"rgba(10,12,16,0.88)":"rgba(245,245,240,0.88)", backdropFilter:"blur(14px)", padding:"1rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Logo/>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <button onClick={()=>setTheme(isDark?"light":"dark")} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"0.5rem", padding:"0.4rem 0.75rem", cursor:"pointer", color:"var(--text)", fontSize:"0.9rem" }}>{isDark?"☀️":"🌙"}</button>
          <button onClick={onEnter} style={{ padding:"0.55rem 1.4rem", background:"var(--accent)", color:"#fff", border:"none", borderRadius:"0.6rem", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.9rem" }}>Open Dashboard →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth:1100, margin:"0 auto", padding:"5rem 2rem 3rem", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"3rem", alignItems:"center" }}>
        {/* copy */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:"99px", padding:"0.35rem 1rem", width:"fit-content" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--accent)", display:"inline-block", animation:"hpulse 2s infinite" }}/>
            <span style={{ fontSize:"0.75rem", color:"var(--accent)", fontWeight:600, letterSpacing:"0.05em" }}>PERSONAL FINANCE DASHBOARD</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,5vw,3.4rem)", fontWeight:700, lineHeight:1.15, letterSpacing:"-0.03em", margin:0 }}>
            Your money,<br/>
            <span style={{ background:"linear-gradient(135deg,#6366f1,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>beautifully clear.</span>
          </h1>
          <p style={{ fontSize:"1.05rem", color:"var(--muted)", lineHeight:1.7, maxWidth:420, margin:0 }}>
            Track income, monitor expenses, and uncover spending patterns — all in one clean, interactive interface.
          </p>
          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
            <button onClick={onEnter}
              style={{ padding:"0.75rem 2rem", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:"0.75rem", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"1rem", boxShadow:"0 8px 24px rgba(99,102,241,0.35)", transition:"transform 0.15s,box-shadow 0.15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 30px rgba(99,102,241,0.45)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";   e.currentTarget.style.boxShadow="0 8px 24px rgba(99,102,241,0.35)"; }}>
              Get Started Free
            </button>
            <button onClick={onEnter} style={{ padding:"0.75rem 1.75rem", background:"transparent", color:"var(--text)", border:"1px solid var(--border)", borderRadius:"0.75rem", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:"1rem" }}>
              View Demo →
            </button>
          </div>
          <div style={{ display:"flex", gap:"1.75rem", flexWrap:"wrap", paddingTop:"0.25rem" }}>
            {[["30+","Transactions tracked"],["3","Months of data"],["100%","Free to use"]].map(([n,l]) => (
              <div key={l} style={{ display:"flex", flexDirection:"column" }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", fontWeight:700, color:"var(--accent)" }}>{n}</span>
                <span style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* mini preview card */}
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1.5rem", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1rem", boxShadow: isDark?"0 40px 80px rgba(0,0,0,0.5)":"0 40px 80px rgba(0,0,0,0.1)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:180, height:180, borderRadius:"50%", background:"rgba(99,102,241,0.12)", filter:"blur(40px)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", fontWeight:700 }}>Balance Overview</span>
            <span style={{ fontSize:"0.72rem", color:"var(--muted)", background:"var(--bg)", padding:"0.2rem 0.65rem", borderRadius:"99px" }}>Q1 2024</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.6rem" }}>
            {[["Balance","₹1.84L","var(--accent)"],["Income","₹2.06L","var(--green)"],["Expenses","₹22.9K","var(--red)"]].map(([l,v,c]) => (
              <div key={l} style={{ background:"var(--bg)", borderRadius:"0.75rem", padding:"0.75rem", display:"flex", flexDirection:"column", gap:"0.3rem" }}>
                <span style={{ fontSize:"0.65rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", fontWeight:700, color:c }}>{v}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={miniData}>
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2.5} fill="url(#heroGrad)" dot={false}/>
              <XAxis dataKey="m" tick={{fill:"var(--muted)",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={v=>fmtShort(v)} contentStyle={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"0.5rem",fontSize:"0.75rem"}}/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
            <span style={{ fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--muted)" }}>Recent</span>
            {[["Salary Deposit","Income","+₹85K","var(--green)"],["Rent Payment","Housing","−₹18K","var(--red)"],["Grocery Store","Food","−₹3.1K","var(--red)"]].map(([d,c,a,col]) => (
              <div key={d} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.45rem 0.7rem", background:"var(--bg)", borderRadius:"0.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:CATEGORY_COLORS[c]||"var(--accent)" }}/>
                  <span style={{ fontSize:"0.8rem" }}>{d}</span>
                </div>
                <span style={{ fontSize:"0.8rem", fontWeight:700, color:col }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ background: isDark?"rgba(99,102,241,0.07)":"rgba(99,102,241,0.04)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"2.5rem 2rem" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"2rem", textAlign:"center" }}>
          {[["₹","206500","Total Income"],["₹","51318","Total Expenses"],["","30","Transactions"],["","29","% Savings Rate"]].map(([prefix,n,label]) => (
            <div key={label} style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", fontWeight:700, color:"var(--accent)" }}>
                {prefix}<Counter target={parseInt(n)}/>
                {label.startsWith("%") ? "%" : ""}
              </span>
              <span style={{ fontSize:"0.76rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label.replace("% ","")}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth:1100, margin:"0 auto", padding:"5rem 2rem" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.6rem)", fontWeight:700, letterSpacing:"-0.02em", margin:"0 0 0.75rem" }}>Everything you need to stay on track</h2>
          <p style={{ color:"var(--muted)", fontSize:"1rem", maxWidth:500, margin:"0 auto" }}>Six powerful features built into one lightweight interface — no subscription, no bloat.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"1rem" }}>
          {FEATURES.map((f) => (
            <div key={f.title}
              style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.75rem", transition:"transform 0.2s,border-color 0.2s", cursor:"default" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor="rgba(99,102,241,0.5)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";   e.currentTarget.style.borderColor="var(--border)"; }}>
              <span style={{ fontSize:"1.8rem" }}>{f.icon}</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", fontWeight:700 }}>{f.title}</span>
              <span style={{ fontSize:"0.88rem", color:"var(--muted)", lineHeight:1.65 }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: isDark?"rgba(99,102,241,0.05)":"rgba(99,102,241,0.03)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"5rem 2rem" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:700, letterSpacing:"-0.02em", margin:"0 0 0.75rem" }}>How it works</h2>
            <p style={{ color:"var(--muted)", fontSize:"1rem" }}>Up and running in three steps — no setup required.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"2.5rem" }}>
            {[
              ["01","Pick a Role",       "Choose Viewer for read-only access or Admin to manage your transactions."],
              ["02","Explore Your Data", "Navigate Overview, Transactions, and Insights to see the full picture."],
              ["03","Take Action",       "Spot trends, cut unnecessary expenses, and track your savings progress."],
            ].map(([n,t,d]) => (
              <div key={n} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.5rem", fontWeight:700, color:"rgba(99,102,241,0.22)", lineHeight:1 }}>{n}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700 }}>{t}</span>
                <span style={{ fontSize:"0.88rem", color:"var(--muted)", lineHeight:1.65 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth:1100, margin:"0 auto", padding:"5rem 2rem" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:700, letterSpacing:"-0.02em", margin:0 }}>People love Finely</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1rem" }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1rem" }}>
              <div style={{ display:"flex", gap:"0.15rem" }}>{[...Array(5)].map((_,i)=><span key={i} style={{ color:"#f59e0b", fontSize:"0.85rem" }}>★</span>)}</div>
              <p style={{ fontSize:"0.9rem", color:"var(--muted)", lineHeight:1.7, margin:0, fontStyle:"italic" }}>"{t.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginTop:"auto" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#ec4899)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:"0.9rem" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:"0.9rem" }}>{t.name}</div>
                  <div style={{ fontSize:"0.75rem", color:"var(--muted)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth:680, margin:"0 auto", padding:"4rem 2rem 6rem", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"1.5rem" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700, letterSpacing:"-0.03em", margin:0, lineHeight:1.2 }}>
          Start tracking your<br/>
          <span style={{ background:"linear-gradient(135deg,#6366f1,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>finances today.</span>
        </h2>
        <p style={{ color:"var(--muted)", fontSize:"1rem", maxWidth:380, margin:0 }}>No sign-up. No credit card. Just open the dashboard and go.</p>
        <button onClick={onEnter}
          style={{ padding:"0.85rem 2.5rem", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:"0.85rem", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"1.05rem", boxShadow:"0 8px 28px rgba(99,102,241,0.4)", transition:"transform 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
          Open Dashboard →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid var(--border)", padding:"1.5rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"0.75rem" }}>
        <Logo/>
        <span style={{ fontSize:"0.78rem", color:"var(--muted)" }}>© 2024 Finely. Built with React & Recharts.</span>
        <button onClick={onEnter} style={{ fontSize:"0.8rem", color:"var(--accent)", background:"transparent", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>Open Dashboard →</button>
      </footer>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]           = useState("home");
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [role, setRole]           = useState("viewer");
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch]       = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat]   = useState("all");
  const [sortBy, setSortBy]         = useState("date-desc");
  const [modal, setModal]           = useState(null);
  const [theme, setTheme]           = useState("dark");
  const [mounted, setMounted]       = useState(false);
  useEffect(() => setMounted(true), []);

  const isAdmin = role === "admin";
  const isDark  = theme === "dark";

  const vars = isDark ? {
    "--bg":"#0a0c10","--card":"#111318","--border":"#1e2230",
    "--text":"#e8eaf0","--muted":"#6b7280","--accent":"#6366f1",
    "--green":"#22c55e","--red":"#f43f5e",
  } : {
    "--bg":"#f5f5f0","--card":"#ffffff","--border":"#e2e2dc",
    "--text":"#1a1a2e","--muted":"#6b7280","--accent":"#6366f1",
    "--green":"#16a34a","--red":"#dc2626",
  };

  const totalIncome   = useMemo(() => transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),             [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+Math.abs(t.amount),0),  [transactions]);
  const balance       = totalIncome - totalExpenses;

  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const m = new Date(t.date).toLocaleString("en",{month:"short"});
      if (!map[m]) map[m] = { month:m, income:0, expense:0 };
      if (t.type==="income") map[m].income += t.amount;
      else map[m].expense += Math.abs(t.amount);
    });
    return Object.values(map).map(m => ({ ...m, balance: m.income - m.expense }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions.filter(t=>t.type==="expense").forEach(t => { map[t.category] = (map[t.category]||0) + Math.abs(t.amount); });
    return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  }, [transactions]);

  const topCategory = categoryData[0] || null;
  const prevExp     = monthlyData[monthlyData.length-2]?.expense || 0;
  const currExp     = monthlyData[monthlyData.length-1]?.expense || 0;
  const expDelta    = prevExp ? ((currExp-prevExp)/prevExp)*100 : 0;

  const allCategories = [...new Set(transactions.map(t=>t.category))];

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search)           list = list.filter(t => t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterType!=="all") list = list.filter(t => t.type===filterType);
    if (filterCat!=="all")  list = list.filter(t => t.category===filterCat);
    const [key,dir] = sortBy.split("-");
    list.sort((a,b) => {
      const av = key==="date"?new Date(a.date):key==="amount"?Math.abs(a.amount):a.desc;
      const bv = key==="date"?new Date(b.date):key==="amount"?Math.abs(b.amount):b.desc;
      return dir==="asc" ? (av>bv?1:-1) : (av<bv?1:-1);
    });
    return list;
  }, [transactions,search,filterType,filterCat,sortBy]);

  const saveTransaction = (tx) => {
    if (modal?.id) setTransactions(list => list.map(t => t.id===tx.id ? tx : t));
    else           setTransactions(list => [...list, tx]);
    setModal(null);
  };
  const deleteTransaction = (id) => setTransactions(list => list.filter(t => t.id!==id));

  const tabStyle = (t) => ({
    padding:"0.5rem 1.25rem", borderRadius:"0.5rem", border:"none", cursor:"pointer",
    fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:"0.9rem",
    background: activeTab===t ? "var(--accent)" : "transparent",
    color:      activeTab===t ? "#fff"          : "var(--muted)",
    transition:"all 0.2s",
  });

  if (!mounted) return null;

  return (
    <div style={{ ...vars }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
        input::placeholder{color:var(--muted);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes hpulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
        .card{animation:fadeUp 0.4s ease both;}
        .row-hover:hover{background:rgba(99,102,241,0.06)!important;}
        .btn-del{opacity:0;transition:opacity 0.15s;}
        .row-hover:hover .btn-del{opacity:1;}
      `}</style>

      {/* ── HOME PAGE ── */}
      {page==="home" && <HomePage onEnter={()=>setPage("app")} theme={theme} setTheme={setTheme}/>}

      {/* ── DASHBOARD ── */}
      {page==="app" && (
        <div style={{ background:"var(--bg)", minHeight:"100vh", color:"var(--text)", fontFamily:"'DM Sans',sans-serif" }}>

          {/* HEADER */}
          <header style={{ borderBottom:"1px solid var(--border)", padding:"1rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, background: isDark?"rgba(10,12,16,0.9)":"rgba(245,245,240,0.9)", backdropFilter:"blur(12px)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <button onClick={()=>{ setPage("home"); }} style={{ background:"transparent", border:"none", cursor:"pointer", color:"var(--muted)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", display:"flex", alignItems:"center", gap:"0.35rem" }}>← Home</button>
              <span style={{ color:"var(--border)" }}>│</span>
              <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#ec4899)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 10L6 6L9 9L14 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, letterSpacing:"-0.02em" }}>Finely</span>
            </div>
            <nav style={{ display:"flex", gap:"0.25rem", background:"var(--card)", borderRadius:"0.65rem", padding:"0.25rem", border:"1px solid var(--border)" }}>
              {["overview","transactions","insights"].map(t => (
                <button key={t} style={tabStyle(t)} onClick={()=>setActiveTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </nav>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <button onClick={()=>setTheme(isDark?"light":"dark")} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"0.5rem", padding:"0.4rem 0.7rem", cursor:"pointer", color:"var(--text)", fontSize:"0.85rem" }}>{isDark?"☀️":"🌙"}</button>
              <select value={role} onChange={e=>setRole(e.target.value)}
                style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"0.5rem", padding:"0.4rem 0.8rem", color:role==="admin"?"#f97316":"var(--green)", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.85rem", outline:"none" }}>
                <option value="viewer">👁 Viewer</option>
                <option value="admin">⚡ Admin</option>
              </select>
            </div>
          </header>

          <main style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>

            {/* ── OVERVIEW TAB ── */}
            {activeTab==="overview" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1rem" }}>
                  {[
                    {label:"Total Balance",  value:balance,             color:balance>=0?"var(--green)":"var(--red)", icon:"💳", delay:"0s"},
                    {label:"Total Income",   value:totalIncome,         color:"var(--green)",  icon:"📈", delay:"0.1s"},
                    {label:"Total Expenses", value:totalExpenses,       color:"var(--red)",    icon:"📉", delay:"0.2s"},
                    {label:"Transactions",   value:transactions.length, color:"var(--accent)", icon:"🔀", isCount:true, delay:"0.3s"},
                  ].map(c => (
                    <div key={c.label} className="card" style={{ animationDelay:c.delay, background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--muted)" }}>{c.label}</span>
                        <span style={{ fontSize:"1.2rem" }}>{c.icon}</span>
                      </div>
                      <span style={{ fontSize:"1.8rem", fontWeight:700, fontFamily:"'Playfair Display',serif", color:c.color, letterSpacing:"-0.02em" }}>
                        {c.isCount ? c.value : fmtShort(c.value)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                  <div className="card" style={{ animationDelay:"0.1s", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem" }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", marginBottom:"1.25rem" }}>Balance Trend</h3>
                    {monthlyData.length===0 ? <EmptyState message="No data yet"/> : (
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={monthlyData}>
                          <defs><linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="100%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                          <XAxis dataKey="month" tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false}/>
                          <YAxis tickFormatter={fmtShort} tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false}/>
                          <Tooltip content={<ChartTooltip/>}/>
                          <Area type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" strokeWidth={2} fill="url(#balGrad)"/>
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="card" style={{ animationDelay:"0.2s", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem" }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", marginBottom:"1.25rem" }}>Income vs Expenses</h3>
                    {monthlyData.length===0 ? <EmptyState message="No data yet"/> : (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyData} barGap={4}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                          <XAxis dataKey="month" tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false}/>
                          <YAxis tickFormatter={fmtShort} tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false}/>
                          <Tooltip content={<ChartTooltip/>}/>
                          <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4,4,0,0]}/>
                          <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4,4,0,0]}/>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="card" style={{ animationDelay:"0.3s", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem" }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", marginBottom:"1.25rem" }}>Spending by Category</h3>
                  {categoryData.length===0 ? <EmptyState message="No expense data"/> : (
                    <div style={{ display:"flex", alignItems:"center", gap:"2rem", flexWrap:"wrap" }}>
                      <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                            {categoryData.map(e => <Cell key={e.name} fill={CATEGORY_COLORS[e.name]||"#6366f1"}/>)}
                          </Pie>
                          <Tooltip formatter={v=>fmtShort(v)} contentStyle={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"0.5rem",fontSize:"0.8rem"}}/>
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ flex:1, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:"0.6rem" }}>
                        {categoryData.map(c => (
                          <div key={c.name} style={{ display:"flex", alignItems:"center", gap:"0.6rem", padding:"0.5rem 0.75rem", borderRadius:"0.5rem", background:"var(--bg)" }}>
                            <div style={{ width:10, height:10, borderRadius:"50%", background:CATEGORY_COLORS[c.name]||"#6366f1", flexShrink:0 }}/>
                            <div>
                              <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>{c.name}</div>
                              <div style={{ fontSize:"0.9rem", fontWeight:600 }}>{fmtShort(c.value)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TRANSACTIONS TAB ── */}
            {activeTab==="transactions" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"center" }}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions…"
                    style={{ flex:"1 1 200px", padding:"0.6rem 1rem", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"0.6rem", color:"var(--text)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", outline:"none" }}/>
                  {[
                    [filterType, setFilterType, [["all","All Types"],["income","Income"],["expense","Expense"]]],
                    [filterCat,  setFilterCat,  [["all","All Categories"],...allCategories.map(c=>[c,c])]],
                    [sortBy,     setSortBy,     [["date-desc","Newest"],["date-asc","Oldest"],["amount-desc","Highest"],["amount-asc","Lowest"],["desc-asc","A–Z"]]],
                  ].map(([val,setter,opts],i) => (
                    <select key={i} value={val} onChange={e=>setter(e.target.value)}
                      style={{ padding:"0.6rem 0.9rem", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"0.6rem", color:"var(--text)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", outline:"none", cursor:"pointer" }}>
                      {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  ))}
                  {isAdmin && (
                    <button onClick={()=>setModal("new")} style={{ padding:"0.6rem 1.2rem", background:"var(--accent)", color:"#fff", border:"none", borderRadius:"0.6rem", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, whiteSpace:"nowrap" }}>+ Add</button>
                  )}
                </div>
                <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr 1fr 1fr auto", padding:"0.75rem 1.25rem", borderBottom:"1px solid var(--border)", fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--muted)" }}>
                    {["Date","Description","Category","Type","Amount",""].map(h => <span key={h}>{h}</span>)}
                  </div>
                  {filtered.length===0 ? <EmptyState message="No transactions found"/> : filtered.map((t,i) => (
                    <div key={t.id} className="row-hover" style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr 1fr 1fr auto", padding:"0.9rem 1.25rem", borderBottom: i<filtered.length-1?"1px solid var(--border)":"none", alignItems:"center", transition:"background 0.15s" }}>
                      <span style={{ fontSize:"0.85rem", color:"var(--muted)" }}>{new Date(t.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
                      <span style={{ fontSize:"0.9rem", fontWeight:500 }}>{t.desc}</span>
                      <span><span style={{ fontSize:"0.78rem", padding:"0.2rem 0.6rem", borderRadius:"999px", background:`${CATEGORY_COLORS[t.category]}22`, color:CATEGORY_COLORS[t.category]||"var(--accent)" }}>{t.category}</span></span>
                      <span style={{ fontSize:"0.8rem", color:t.type==="income"?"var(--green)":"var(--muted)" }}>{t.type}</span>
                      <span style={{ fontWeight:700, fontFamily:"'Playfair Display',serif", color:t.type==="income"?"var(--green)":"var(--red)" }}>{t.type==="income"?"+":"−"}{fmtShort(Math.abs(t.amount))}</span>
                      <div style={{ display:"flex", gap:"0.4rem" }}>
                        {isAdmin && <>
                          <button onClick={()=>setModal(t)} className="btn-del" style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:"0.85rem", color:"var(--muted)", padding:"0.2rem 0.4rem" }}>✏️</button>
                          <button onClick={()=>deleteTransaction(t.id)} className="btn-del" style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:"0.85rem", color:"var(--red)", padding:"0.2rem 0.4rem" }}>🗑</button>
                        </>}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize:"0.8rem", color:"var(--muted)" }}>{filtered.length} of {transactions.length} transactions</p>
              </div>
            )}

            {/* ── INSIGHTS TAB ── */}
            {activeTab==="insights" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1rem" }}>
                  <div className="card" style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                    <span style={{ fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--muted)" }}>Highest Spending Category</span>
                    {topCategory ? <>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                        <div style={{ width:12, height:12, borderRadius:"50%", background:CATEGORY_COLORS[topCategory.name]||"var(--accent)" }}/>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:700 }}>{topCategory.name}</span>
                      </div>
                      <span style={{ fontSize:"1.1rem", color:"var(--red)", fontWeight:600 }}>{fmtShort(topCategory.value)} total spent</span>
                      <span style={{ fontSize:"0.8rem", color:"var(--muted)" }}>{((topCategory.value/totalExpenses)*100).toFixed(1)}% of all expenses</span>
                    </> : <EmptyState message="No data"/>}
                  </div>
                  <div className="card" style={{ animationDelay:"0.1s", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                    <span style={{ fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--muted)" }}>Month-over-Month Expenses</span>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:700, color:expDelta>0?"var(--red)":"var(--green)" }}>{expDelta>0?"↑":"↓"} {Math.abs(expDelta).toFixed(1)}%</span>
                    <span style={{ fontSize:"0.85rem" }}>{monthlyData[monthlyData.length-1]?.month||"—"}: {fmtShort(currExp)} vs {monthlyData[monthlyData.length-2]?.month||"prev"}: {fmtShort(prevExp)}</span>
                    <span style={{ fontSize:"0.8rem", color:"var(--muted)" }}>{expDelta>0?"⚠️ Spending increased":"✅ Spending decreased"} vs last month</span>
                  </div>
                  <div className="card" style={{ animationDelay:"0.2s", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                    <span style={{ fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--muted)" }}>Savings Rate</span>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:700, color:"var(--green)" }}>{totalIncome>0?((balance/totalIncome)*100).toFixed(1):0}%</span>
                    <div style={{ height:6, background:"var(--border)", borderRadius:"99px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${Math.min(100,Math.max(0,(balance/totalIncome)*100))}%`, background:"linear-gradient(90deg,#6366f1,#22c55e)", borderRadius:"99px", transition:"width 0.8s ease" }}/>
                    </div>
                    <span style={{ fontSize:"0.8rem", color:"var(--muted)" }}>of total income saved overall</span>
                  </div>
                  <div className="card" style={{ animationDelay:"0.3s", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                    <span style={{ fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--muted)" }}>Avg Daily Expense</span>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:700 }}>{fmtShort(totalExpenses/90)}</span>
                    <span style={{ fontSize:"0.8rem", color:"var(--muted)" }}>based on 90-day window</span>
                    <span style={{ fontSize:"0.8rem", color:totalExpenses/90>1500?"var(--red)":"var(--green)" }}>{totalExpenses/90>1500?"⚠️ Above ₹1.5K/day":"✅ Within target"}</span>
                  </div>
                </div>
                <div className="card" style={{ animationDelay:"0.15s", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"1.5rem" }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", marginBottom:"1.25rem" }}>Monthly Comparison</h3>
                  {monthlyData.length===0 ? <EmptyState message="No monthly data"/> : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={monthlyData} barGap={6}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                        <XAxis dataKey="month" tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false}/>
                        <YAxis tickFormatter={fmtShort} tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false}/>
                        <Tooltip content={<ChartTooltip/>}/>
                        <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4,4,0,0]}/>
                        <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4,4,0,0]}/>
                        <Bar dataKey="balance" name="Balance" fill="#6366f1" radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                {!isAdmin && (
                  <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:"0.75rem", padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
                    <span>🔒</span>
                    <span style={{ fontSize:"0.9rem", color:"var(--muted)" }}>You're in <strong style={{color:"var(--text)"}}>Viewer</strong> mode. Switch to <strong style={{color:"#f97316"}}>Admin</strong> to add or edit transactions.</span>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {modal && <Modal onClose={()=>setModal(null)} onSave={saveTransaction} editing={modal==="new"?null:modal}/>}
    </div>
  );
}
