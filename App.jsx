import { useState } from "react";

const STATUSES = [
  { key: "new", label: "New", color: "#D4A843", bg: "#D4A84312" },
  { key: "assigned", label: "Assigned", color: "#5B9BD5", bg: "#5B9BD512" },
  { key: "awaiting_diagnosis", label: "Diagnosing", color: "#9678C9", bg: "#9678C912" },
  { key: "diagnosed", label: "Diagnosed", color: "#C97850", bg: "#C9785012" },
  { key: "waiting_parts", label: "Parts Hold", color: "#D06060", bg: "#D0606012" },
  { key: "ready_repair", label: "Repair Ready", color: "#50B89A", bg: "#50B89A12" },
  { key: "in_repair", label: "In Repair", color: "#5B9BD5", bg: "#5B9BD512" },
  { key: "complete", label: "Complete", color: "#5CB868", bg: "#5CB86812" },
  { key: "awaiting_pickup", label: "Pickup", color: "#D4A843", bg: "#D4A84312" },
  { key: "closed", label: "Closed", color: "#666", bg: "#66666612" },
];

const MECHANICS = [
  { id: 1, name: "Dave", specialty: "Brakes & Suspension" },
  { id: 2, name: "Tony", specialty: "Transmission & Drivetrain" },
  { id: 3, name: "Steve", specialty: "Electrical & Diagnostics" },
  { id: 4, name: "Carlos", specialty: "Engine & Exhaust" },
];

const SAMPLE_TICKETS = [
  { id: 1001, customer: "Sarah Johnson", phone: "(555) 234-5678", carMake: "Honda", carModel: "Civic", carYear: "2019", plate: "ABC-1234", problem: "Grinding noise when I brake, gets worse going downhill", status: "in_repair", mechanicId: 1, diagnosis: "Front brake pads worn to metal, rotors scored", partsUsed: ["Front brake pads (ceramic)", "Front rotors x2"], created: "2026-02-25 09:15", estimatedHours: 2.5 },
  { id: 1002, customer: "Mike Torres", phone: "(555) 876-5432", carMake: "Ford", carModel: "F-150", carYear: "2021", plate: "TRK-9876", problem: "Check engine light on, truck feels sluggish on acceleration", status: "awaiting_diagnosis", mechanicId: 3, diagnosis: "", partsUsed: [], created: "2026-02-25 10:30", estimatedHours: 1 },
  { id: 1003, customer: "Linda Chen", phone: "(555) 345-6789", carMake: "Toyota", carModel: "Camry", carYear: "2017", plate: "LCH-4455", problem: "AC blowing warm air, used to work fine last summer", status: "waiting_parts", mechanicId: 4, diagnosis: "AC compressor failing, refrigerant leak at compressor seal", partsUsed: [], created: "2026-02-24 14:00", estimatedHours: 3 },
  { id: 1004, customer: "James Wright", phone: "(555) 999-1111", carMake: "Chevrolet", carModel: "Malibu", carYear: "2020", plate: "JW-2020", problem: "Car pulls to the right when driving straight", status: "complete", mechanicId: 2, diagnosis: "Front end alignment off, tie rod end worn", partsUsed: ["Tie rod end (passenger)", "Alignment service"], created: "2026-02-24 08:00", estimatedHours: 1.5 },
  { id: 1005, customer: "Rachel Kim", phone: "(555) 222-3333", carMake: "Subaru", carModel: "Outback", carYear: "2022", plate: "RK-SUB22", problem: "Weird clicking sound when turning left, only at low speeds", status: "new", mechanicId: null, diagnosis: "", partsUsed: [], created: "2026-02-26 08:45", estimatedHours: null },
];

const getStatus = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];
const getNext = (current) => {
  const i = STATUSES.findIndex((s) => s.key === current);
  return i < STATUSES.length - 1 ? STATUSES[i + 1] : STATUSES[i];
};

function Badge({ status }) {
  const s = getStatus(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "3px 10px", borderRadius: "6px", fontSize: "11px",
      fontWeight: 600, letterSpacing: "0.3px", color: s.color,
      background: s.bg, border: `1px solid ${s.color}20`,
      fontFamily: "var(--font-mono)",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, opacity: 0.8 }} />
      {s.label}
    </span>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: "var(--surface)", borderRadius: 10, padding: "18px 22px",
      border: "1px solid var(--border)", flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function MechCard({ mechanic, tickets }) {
  const mine = tickets.filter((t) => t.mechanicId === mechanic.id && t.status !== "closed");
  const active = mine.find((t) => t.status === "in_repair");
  const queue = mine.filter((t) => t.status !== "in_repair");

  return (
    <div style={{
      background: "var(--surface)", borderRadius: 10, padding: 18,
      border: "1px solid var(--border)", flex: 1, minWidth: 240,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{mechanic.name}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{mechanic.specialty}</div>
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: active ? "#5CB868" : "var(--border)",
          boxShadow: active ? "0 0 8px #5CB86844" : "none",
        }} />
      </div>
      {active ? (
        <div style={{
          background: "var(--bg)", borderRadius: 8, padding: 12,
          borderLeft: "2px solid #5B9BD5", marginBottom: 8,
        }}>
          <div style={{ fontSize: 10, color: "#5B9BD5", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
            Working on
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>
            {active.carYear} {active.carMake} {active.carModel}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, lineHeight: 1.4 }}>
            {active.diagnosis || active.problem}
          </div>
          {active.estimatedHours && (
            <div style={{ fontSize: 10, color: "var(--border-hover)", marginTop: 5, fontFamily: "var(--font-mono)" }}>
              ~{active.estimatedHours}h est.
            </div>
          )}
        </div>
      ) : (
        <div style={{
          background: "var(--bg)", borderRadius: 8, padding: 14,
          textAlign: "center", color: "var(--border-hover)", fontSize: 12, marginBottom: 8,
        }}>
          Available
        </div>
      )}
      {queue.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Queue · {queue.length}
          </div>
          {queue.map((t) => (
            <div key={t.id} style={{
              padding: "7px 10px", background: "var(--bg)", borderRadius: 6,
              marginBottom: 3, display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                {t.carMake} {t.carModel}
              </span>
              <Badge status={t.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TicketRow({ ticket, onClick }) {
  const mech = MECHANICS.find((m) => m.id === ticket.mechanicId);
  return (
    <div onClick={onClick} style={{
      background: "var(--surface)", borderRadius: 10, padding: "14px 18px",
      border: "1px solid var(--border)", cursor: "pointer",
      transition: "border-color 0.15s, background 0.15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "#16161A"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "var(--border-hover)", fontFamily: "var(--font-mono)", width: 44 }}>
            #{ticket.id}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{ticket.customer}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              {ticket.carYear} {ticket.carMake} {ticket.carModel}
              <span style={{ margin: "0 6px", opacity: 0.3 }}>·</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>{ticket.plate}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {mech && <span style={{ fontSize: 11, color: "var(--muted)" }}>{mech.name}</span>}
          <Badge status={ticket.status} />
        </div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(6px)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", borderRadius: 14, padding: 28,
        maxWidth: 520, width: "92%", border: "1px solid var(--border)",
        maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        {children}
      </div>
    </div>
  );
}

function TicketDetail({ ticket, onClose, onAdvance, onAssign }) {
  if (!ticket) return null;
  const status = getStatus(ticket.status);
  const mech = MECHANICS.find((m) => m.id === ticket.mechanicId);
  const next = getNext(ticket.status);

  const Field = ({ label, children, full }) => (
    <div style={full ? { gridColumn: "1 / -1" } : {}}>
      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>{children}</div>
    </div>
  );

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", marginBottom: 3 }}>#{ticket.id}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{ticket.customer}</div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "var(--muted)", fontSize: 20,
          cursor: "pointer", padding: "2px 6px", lineHeight: 1, borderRadius: 6,
        }}>×</button>
      </div>

      <Badge status={ticket.status} />

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Phone">{ticket.phone}</Field>
        <Field label="Vehicle">{ticket.carYear} {ticket.carMake} {ticket.carModel}</Field>
        <Field label="Plate"><span style={{ fontFamily: "var(--font-mono)" }}>{ticket.plate}</span></Field>
        <Field label="Mechanic">{mech ? mech.name : "Unassigned"}</Field>
        <Field label="Customer Description" full>
          <div style={{ background: "var(--bg)", padding: 11, borderRadius: 7, fontStyle: "italic", color: "var(--muted)" }}>
            "{ticket.problem}"
          </div>
        </Field>
        {ticket.diagnosis && (
          <Field label="Diagnosis" full>
            <div style={{ background: "#C9785010", padding: 11, borderRadius: 7, color: "#C97850" }}>
              {ticket.diagnosis}
            </div>
          </Field>
        )}
        {ticket.partsUsed.length > 0 && (
          <Field label="Parts" full>
            <div style={{ background: "var(--bg)", padding: 11, borderRadius: 7 }}>
              {ticket.partsUsed.map((p, i) => (
                <div key={i} style={{ color: "#5CB868", fontSize: 12, padding: "2px 0" }}>✓ {p}</div>
              ))}
            </div>
          </Field>
        )}
      </div>

      <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {ticket.status === "new" && (
          <select onChange={(e) => onAssign(ticket.id, parseInt(e.target.value))} defaultValue="" style={{
            background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "9px 14px", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)",
          }}>
            <option value="" disabled>Assign mechanic…</option>
            {MECHANICS.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.specialty}</option>)}
          </select>
        )}
        {ticket.status !== "closed" && ticket.status !== "new" && (
          <button onClick={() => onAdvance(ticket.id)} style={{
            background: status.color, color: "#111", border: "none", borderRadius: 8,
            padding: "9px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}>
            Move to {next.label} →
          </button>
        )}
      </div>
    </Modal>
  );
}

function NewTicketForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ customer: "", phone: "", carMake: "", carModel: "", carYear: "", plate: "", problem: "" });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const ok = form.customer && form.phone && form.carMake && form.carModel && form.problem;

  const fields = [
    { k: "customer", l: "Full Name", p: "Sarah Johnson" },
    { k: "phone", l: "Phone", p: "(555) 234-5678" },
    { k: "carMake", l: "Make", p: "Honda" },
    { k: "carModel", l: "Model", p: "Civic" },
    { k: "carYear", l: "Year", p: "2019" },
    { k: "plate", l: "Plate", p: "ABC-1234" },
  ];

  const inputStyle = {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 7, padding: "9px 11px", color: "var(--text-secondary)", fontSize: 13,
    fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <Modal onClose={onCancel}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>New Ticket</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>Capture the customer info</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {fields.map((f) => (
          <div key={f.k}>
            <label style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 3, fontWeight: 600 }}>{f.l}</label>
            <input type="text" placeholder={f.p} value={form[f.k]} onChange={(e) => set(f.k, e.target.value)} style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "var(--border-hover)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 3, fontWeight: 600 }}>Problem Description</label>
        <textarea placeholder="Grinding noise when braking…" value={form.problem} onChange={(e) => set("problem", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => e.target.style.borderColor = "var(--border-hover)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{
          background: "none", border: "1px solid var(--border)", borderRadius: 8,
          padding: "8px 18px", color: "var(--muted)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)",
        }}>Cancel</button>
        <button onClick={() => ok && onSubmit(form)} style={{
          background: ok ? "#D4A843" : "var(--border)", color: ok ? "#111" : "var(--muted)",
          border: "none", borderRadius: 8, padding: "8px 22px", fontSize: 12, fontWeight: 700,
          cursor: ok ? "pointer" : "default", fontFamily: "var(--font-body)",
        }}>Create Ticket</button>
      </div>
    </Modal>
  );
}

function Toast({ notification, onDismiss }) {
  if (!notification) return null;
  return (
    <div style={{
      position: "fixed", top: 16, right: 16, background: "#5CB86815",
      border: "1px solid #5CB86830", borderRadius: 10, padding: "13px 20px",
      zIndex: 2000, display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)", animation: "slideIn 0.25s ease-out",
      maxWidth: 340,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5CB868", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ color: "#5CB868", fontSize: 12, fontWeight: 600 }}>{notification.title}</div>
        <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 2, lineHeight: 1.3 }}>{notification.message}</div>
      </div>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: "var(--border-hover)", cursor: "pointer", fontSize: 14, flexShrink: 0 }}>×</button>
    </div>
  );
}

function NavBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "var(--bg-elevated)" : "transparent",
      border: "1px solid " + (active ? "var(--border)" : "transparent"),
      borderRadius: 7, padding: "7px 14px",
      color: active ? "var(--text)" : "var(--muted)",
      fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
      transition: "all 0.15s",
    }}>{label}</button>
  );
}

export default function App() {
  const [tickets, setTickets] = useState(SAMPLE_TICKETS);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState("all");

  const notify = (title, message) => {
    setNotification({ title, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const advanceTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = getNext(t.status);
        if (next.key === "complete") {
          notify("Calling " + t.customer, `Notifying pickup: ${t.carYear} ${t.carMake} ${t.carModel}`);
        }
        return { ...t, status: next.key };
      })
    );
    setSelectedTicket(null);
  };

  const assignMechanic = (ticketId, mechanicId) => {
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, mechanicId, status: "assigned" } : t));
    notify("Assigned", `Job assigned to ${MECHANICS.find((m) => m.id === mechanicId).name}`);
    setSelectedTicket(null);
  };

  const createTicket = (form) => {
    setTickets([{
      id: 1000 + tickets.length + 1, ...form, status: "new", mechanicId: null,
      diagnosis: "", partsUsed: [], created: new Date().toLocaleString(), estimatedHours: null,
    }, ...tickets]);
    setShowNewForm(false);
    notify("Ticket Created", `${form.customer} — ${form.carMake} ${form.carModel}`);
  };

  const active = tickets.filter((t) => t.status !== "closed");
  const filtered = filter === "all" ? active : tickets.filter((t) => t.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        :root {
          --font-body: 'Outfit', -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --bg: #0E0E11;
          --bg-elevated: #1A1A1F;
          --surface: #141418;
          --border: #222228;
          --border-hover: #3A3A42;
          --text: #E8E8EC;
          --text-secondary: #B8B8C0;
          --muted: #666670;
          --accent: #D4A843;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      `}</style>

      <Toast notification={notification} onDismiss={() => setNotification(null)} />
      {selectedTicket && <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onAdvance={advanceTicket} onAssign={assignMechanic} />}
      {showNewForm && <NewTicketForm onSubmit={createTicket} onCancel={() => setShowNewForm(false)} />}

      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "14px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "var(--surface)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 7,
            background: "linear-gradient(135deg, #D4A843, #C97850)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>🔧</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>Mike's Auto</div>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>Shop Management</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <NavBtn label="Dashboard" active={currentView === "dashboard"} onClick={() => setCurrentView("dashboard")} />
          <NavBtn label="Tickets" active={currentView === "tickets"} onClick={() => setCurrentView("tickets")} />
          <NavBtn label="Mechanics" active={currentView === "mechanics"} onClick={() => setCurrentView("mechanics")} />
          <button onClick={() => setShowNewForm(true)} style={{
            background: "var(--accent)", border: "none", borderRadius: 7,
            padding: "7px 16px", color: "#111", fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-body)", marginLeft: 6,
            transition: "opacity 0.15s",
          }}>+ New</button>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: "22px 28px", maxWidth: 1100, margin: "0 auto" }}>

        {currentView === "dashboard" && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <Stat label="Active" value={active.length} accent="#5B9BD5" />
              <Stat label="In Repair" value={tickets.filter((t) => t.status === "in_repair").length} accent="#5CB868" />
              <Stat label="Parts Hold" value={tickets.filter((t) => t.status === "waiting_parts").length} accent="#D06060" />
              <Stat label="Pickup" value={tickets.filter((t) => ["complete", "awaiting_pickup"].includes(t.status)).length} accent="#D4A843" />
            </div>

            {/* Pipeline */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pipeline</div>
              <div style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border)" }}>
                {STATUSES.filter((s) => s.key !== "closed").map((s) => {
                  const count = tickets.filter((t) => t.status === s.key).length;
                  if (count === 0) return null;
                  return <div key={s.key} style={{ flex: count, background: s.color, borderRadius: 3, transition: "flex 0.3s" }} title={`${s.label}: ${count}`} />;
                })}
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                {STATUSES.filter((s) => s.key !== "closed").map((s) => {
                  const count = tickets.filter((t) => t.status === s.key).length;
                  if (count === 0) return null;
                  return (
                    <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: "inline-block" }} />
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{s.label} ({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Tickets */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Active Tickets
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {active.map((t) => <TicketRow key={t.id} ticket={t} onClick={() => setSelectedTicket(t)} />)}
              </div>
            </div>
          </>
        )}

        {currentView === "tickets" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              <button onClick={() => setFilter("all")} style={{
                background: filter === "all" ? "var(--bg-elevated)" : "transparent",
                border: "1px solid " + (filter === "all" ? "var(--border)" : "transparent"),
                borderRadius: 20, padding: "5px 12px",
                color: filter === "all" ? "var(--text)" : "var(--muted)",
                fontSize: 11, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500,
              }}>All Active</button>
              {STATUSES.filter((s) => s.key !== "closed").map((s) => {
                const count = tickets.filter((t) => t.status === s.key).length;
                if (count === 0) return null;
                return (
                  <button key={s.key} onClick={() => setFilter(s.key)} style={{
                    background: filter === s.key ? s.bg : "transparent",
                    border: "1px solid " + (filter === s.key ? s.color + "30" : "transparent"),
                    borderRadius: 20, padding: "5px 12px",
                    color: filter === s.key ? s.color : "var(--muted)",
                    fontSize: 11, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500,
                  }}>{s.label} ({count})</button>
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filtered.map((t) => <TicketRow key={t.id} ticket={t} onClick={() => setSelectedTicket(t)} />)}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--border-hover)", padding: 40, fontSize: 13 }}>No tickets here</div>
              )}
            </div>
          </>
        )}

        {currentView === "mechanics" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Mechanic Schedule</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 28 }}>
              {MECHANICS.map((m) => <MechCard key={m.id} mechanic={m} tickets={tickets} />)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Bays</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[1, 2, 3, 4].map((bay) => {
                const mech = MECHANICS[bay - 1];
                const job = tickets.find((t) => t.mechanicId === mech.id && t.status === "in_repair");
                return (
                  <div key={bay} style={{
                    background: job ? "#5B9BD508" : "var(--surface)", borderRadius: 9, padding: 14,
                    border: `1px solid ${job ? "#5B9BD520" : "var(--border)"}`, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Bay {bay}</div>
                    <div style={{ fontSize: 13, color: job ? "#5B9BD5" : "var(--border-hover)", fontWeight: 600, marginTop: 6 }}>
                      {job ? `${job.carMake} ${job.carModel}` : "Empty"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{mech.name}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
