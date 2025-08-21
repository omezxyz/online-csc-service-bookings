import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Refunds from "./pages/Refunds.jsx";
import favicon from "./assets/favicon.ico";
import appleIcon from "./assets/apple-touch-icon.png";
import socialImage from "./assets/social-preview.png";
import { Helmet, HelmetProvider } from "react-helmet-async";

import {
  Check,
  Calendar,
  FileText,
  Shield,
  ChevronRight,
  Loader2,
  Eye,
  EyeOff,
  X,
  Copy,
  Phone, Mail, Sparkles
} from "lucide-react";
import {
  getServices,
  createRequest,
  trackRequest,
  adminLogin,
  adminListRequests,
  adminUpdateStatus,
  adminListServices,
  adminCreateService,
  adminDeleteService
} from "./api";
import ProcessFlow from "./ProcessFlow";

const cn = (...c) => c.filter(Boolean).join(" ");
const fmtMoney = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function App() {
  const [route, setRoute] = useState("home");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    getServices().then((s) => {
      setServices(s);
      setSelectedService(s[0]?._id || null);
    });
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Online Services | Fast & Reliable Service Booking</title>
        <meta name="description" content="Book PAN, Scholarship, Caste & Income certificates online quickly." />
        <meta name="keywords" content="PAN, Scholarship, Certificate, Online Services, Assam" />
        <meta name="author" content="Online Services || CSC Services" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content="Online Services | Fast & Reliable" />
        <meta property="og:description" content="Book PAN, Scholarship, Caste & Income certificates online quickly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content={socialImage} />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Online Services | Fast & Reliable" />
        <meta name="twitter:description" content="Book PAN, Scholarship, Caste & Income certificates online quickly." />
        <meta name="twitter:image" content={socialImage} />

        {/* Favicon */}
        <link rel="icon" href={favicon} />
        <link rel="apple-touch-icon" sizes="180x180" href={appleIcon} />
      </Helmet>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Header
        onNav={setRoute}
        route={route}
        onAdmin={() => setShowAdmin(true)}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <AnimatePresence mode="wait">
          {route === "terms" && <Terms/>}
{route === "privacy" && <Privacy/>}
{route === "refunds" && <Refunds/>}

          {route === "home" && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-8"
            >
              <Hero onGetStarted={() => setRoute("book")} />
              <ProcessFlow />
              <WhyUs />
              <ServicesGrid
                services={services}
                selectedService={selectedService}
                onSelect={setSelectedService}
                onBook={() => setRoute("book")}
              />
            </motion.section>
          )}

          {route === "book" && (
            <motion.section
              key="book"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-10"
            >
              <BookingForm
                services={services}
                defaultService={selectedService}
                onNav={setRoute}
              />
            </motion.section>
          )}

          {route === "track" && (
            <motion.section
              key="track"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-10"
            >
              <Tracker />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <Footer  setRoute={setRoute}/>
      <AdminModal open={showAdmin} onClose={() => setShowAdmin(false)} />
    </div>
    </HelmetProvider>
  );
}

function Header({ onNav, route, onAdmin }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-4 z-40 w-[90%] mx-auto rounded-3xl backdrop-blur bg-white/70 border border-slate-200/70 shadow-xl p-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">
            OS
          </div>
          <div className="font-semibold">Online Services</div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink active={route === "home"} onClick={() => onNav("home")}>
            Home
          </NavLink>
          <NavLink active={route === "book"} onClick={() => onNav("book")}>
            Book
          </NavLink>
          <NavLink active={route === "track"} onClick={() => onNav("track")}>
            Track
          </NavLink>
          <button
            onClick={onAdmin}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
            title="Admin Login"
          >
            <Shield size={16} /> Admin
          </button>
        </nav>
        <button
          className="md:hidden"
          onClick={() => setOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <ChevronRight />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200/70">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <NavLink
              active={route === "home"}
              onClick={() => {
                onNav("home");
                setOpen(false);
              }}
            >
              Home
            </NavLink>
            <NavLink
              active={route === "book"}
              onClick={() => {
                onNav("book");
                setOpen(false);
              }}
            >
              Book
            </NavLink>
            <NavLink
              active={route === "track"}
              onClick={() => {
                onNav("track");
                setOpen(false);
              }}
            >
              Track
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
function NavLink({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full transition border",
        active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white hover:bg-slate-100 border-slate-200"
      )}
    >
      {children}
    </button>
  );
}
function Footer({setRoute}) {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Online Services. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
         <button onClick={() => setRoute("terms")} className="hover:text-slate-900">Terms</button>
<button onClick={() => setRoute("privacy")} className="hover:text-slate-900">Privacy</button>
<button onClick={() => setRoute("refunds")} className="hover:text-slate-900">Refunds</button>

        </div>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/+918011891618" // replace with your number
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 w-14 h-14 rounded-full shadow-lg items-center justify-center transition-all duration-300
                     fixed bottom-6 right-6 md:flex hidden sm:hidden lg:flex"
          title="Contact Support / Manual Bookings"
        >
          {/* WhatsApp SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </a>

        {/* WhatsApp Button for Mobile (inside footer) */}
        <a
          href="https://wa.me/+918011891618"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 md:hidden"
          title="Contact Support / Manual Bookings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </a>
      </div>
    </footer>
  );
}

function Hero({ onGetStarted }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12 mt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          Book Government & Educational Online Services
        </h1>
        <p className="mt-4 text-slate-200 max-w-2xl">
          PAN card, Scholarships, Income certificate, Caste certificate and more—handled by experts.
          Track your request in real time.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onGetStarted}
            className="px-5 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100"
          >
            Get Started
          </button>
          <a
            href="#why-us"
            className="px-5 py-3 rounded-xl bg-slate-700/70 hover:bg-slate-700"
          >
            Why choose us?
          </a>
        </div>
      </motion.div>
       <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
    </section>
  );
}
function WhyUs() {
  const items = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Trusted",
      desc: "All your documents & data are handled securely and unique Request IDs.",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Schedule Instantly",
      desc: "No need to wait in line—pick a convenient date & time for your service online.",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Document Guidance",
      desc: "Step-by-step checklist & validations to prevent rejections or delays.",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Delivered via WhatsApp",
      desc: "Receive all service updates and final deliverables directly on WhatsApp/Email —no travel required.",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Notifications",
      desc: "Get instant updates and copies of documents via email for record-keeping.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Extra Surprises",
      desc: "Exclusive tips, updates, and perks to make your service experience smooth and delightful.",
    },
  ];

  return (
    <section id="why-us" className="mt-12 scroll-mt-24">
      <section className="bg-neutral-150 py-8 px-4 sm:px-6 md:px-10 rounded-2xl shadow-sm">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
        Why Choose Our Online Services?
      </h2>
    </div>
  </section>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 p-6 bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white grid place-items-center">
              {it.icon}
            </div>
            <div className="mt-4 font-semibold text-lg">{it.title}</div>
            <div className="text-sm text-slate-600 mt-2">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


function ServicesGrid({ services, selectedService, onSelect, onBook }) {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Popular Services</h2>
        <button
          onClick={onBook}
          className="text-sm inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 text-white"
        >
          Book a Request <ChevronRight size={16} />
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((s) => (
          <button
            key={s._id}
            onClick={() => onSelect(s._id)}
            className={cn(
              "text-left rounded-2xl border p-5 bg-white transition",
              selectedService === s._id
                ? "border-slate-900 ring-2 ring-slate-900/10"
                : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-slate-600 mt-1">{s.description}</div>
            <div className="mt-3 text-slate-900 font-semibold">
              {s.price === 0 ? "Free Consultation" : fmtMoney(s.price)}
            </div>
            <div className="mt-3">
              <div className="text-xs text-slate-500">Required Documents:</div>
              <ul className="list-disc ml-5 text-xs text-slate-600">
                {s.requiredDocuments.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

 
function BookingForm({ services, defaultService, onNav={setRoute} }) {
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [utr, setUtr] = useState("");
  const [data, setData] = useState({
    serviceId: defaultService || "",
    fullName: "",
    phone: "",
    email: "",
    // preferredDate: "",
    // preferredTime: "",
    address: "",
    notes: "",
    agree: false,
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!data.serviceId && services[0])
      setData((d) => ({ ...d, serviceId: services[0]._id }));
  }, [services]);

  const selected = useMemo(
    () => services.find((s) => s._id === data.serviceId) || services[0],
    [services, data.serviceId]
  );

  const upiId = "omezrava-2@oksbi"; // Replace with your real UPI ID
  const amount = selected?.price || 0;
  const name = encodeURIComponent("Online Services");
  const note = encodeURIComponent(`Payment for ${selected?.name}`);
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;

  function validate() {
    const errs = [];
    if (!data.fullName.trim()) errs.push("Full name is required");
    if (!/^\d{10}$/.test(data.phone)) errs.push("Phone must be 10 digits");
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email))
      errs.push("Invalid email");
    // if (!data.preferredDate) errs.push("Preferred date is required");
    // if (!data.preferredTime) errs.push("Preferred time is required");
    if (!data.agree) errs.push("You must agree to the Terms & Privacy");
    if (selected?.requiredDocuments?.length && files.length === 0)
      errs.push("Please upload required documents");
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (errs.length) {
      alert("Please fix the following:\n\n" + errs.map((e) => "• " + e).join("\n"));
      return;
    }

    setStep("payment");
  }

 
    function handlePayment() {
    window.location.href = upiUrl;
  }

  async function submitWithUtr() {
    if (!utr.trim()) {
      alert("Please enter the UTR number after completing payment.");
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.append("serviceId", data.serviceId);
    fd.append("fullName", data.fullName);
    fd.append("email", data.email);
    fd.append("phone", data.phone);
    fd.append("address", data.address);
    // fd.append("preferredDate", data.preferredDate);
    // fd.append("preferredTime", data.preferredTime);
    fd.append("notes", data.notes);
    fd.append("utr", utr.trim());
    Array.from(files).forEach((f) => fd.append("documents", f));

    const res = await createRequest(fd);
    setLoading(false);

    if (res?.success) {
      setSavedId(res.requestId);
      setStep("success");
    } else {
      alert(res?.error || "Failed to submit");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Book a Service</h3>
              <div className="text-sm text-slate-500">
                Secure • Fast • Reliable
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Select Service</label>
                <select
                  className="mt-1 w-full p-2 rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                  value={data.serviceId}
                  onChange={(e) =>
                    setData({ ...data, serviceId: e.target.value })
                  }
                >
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  className="mt-1 w-full p-2 rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                  placeholder="Your full name"
                  value={data.fullName}
                  onChange={(e) =>
                    setData({ ...data, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  className="mt-1 w-full p-2 rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                  placeholder="10-digit mobile"
                  value={data.phone}
                  onChange={(e) =>
                    setData({
                      ...data,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  className="mt-1 w-full p-2 rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                  placeholder="your@email.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
              {/* <div>
                <label className="text-sm font-medium">Preferred Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                  value={data.preferredDate}
                  onChange={(e) =>
                    setData({ ...data, preferredDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preferred Time</label>
                <input
                  type="time"
                  className="mt-1 w-full rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                  value={data.preferredTime}
                  onChange={(e) =>
                    setData({ ...data, preferredTime: e.target.value })
                  }
                />
              </div> */}
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea
                rows={3}
                className="mt-1 p-1 w-full rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                placeholder="Full address"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Please Upload the Documents mentioned under required documents (PDF/JPG/PNG)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,image/jpeg,image/png"
                className="mt-1 w-full"
                onChange={(e) => setFiles(e.target.files)}
              />
              <div className="text-xs text-slate-500 mt-1">
                Max 12 files, 500kb each.
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notes (optional)</label>
              <textarea
                rows={3}
                className="mt-1 p-2 w-full rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                placeholder="Anything we should know?"
                value={data.notes}
                onChange={(e) => setData({ ...data, notes: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="agree"
                type="checkbox"
                checked={data.agree}
                onChange={(e) => setData({ ...data, agree: e.target.checked })}
              />
              <label htmlFor="agree" className="text-sm text-slate-700">
  I agree to the{" "}
  <a href="#" onClick={() => onNav("terms")} className="underline">
    Terms
  </a>{" "}
  &{" "}
  <a href="#" onClick={() => onNav("privacy")} className="underline">
    Privacy Policy
  </a>.
</label>

            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800"
              >
                Continue
              </button>
              <div className="text-sm text-slate-500">
                Redirects to payment page to confirm.
              </div>
            </div>
          </form>
        )}
        
         {/* ============ PAYMENT STEP ============ */}
        {step === "payment" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Complete Payment</h3>
            <p className="text-slate-600">
              Please pay <strong>₹{selected?.price}</strong> using UPI. You can
              scan the QR code or click the button below.
            </p>

            {/* ✅ QR Code for UPI */}
            <div className="flex flex-col lg:flex-row items-center gap-6 border rounded-xl p-4">
              <QRCodeCanvas value={upiUrl} size={160} />
              <div className="space-y-2 text-center lg:text-left">
                <p className="font-medium">Scan & Pay</p>
                <p className="text-sm text-slate-500">{upiId}</p>
                <button
                  onClick={handlePayment}
                  className="px-5 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700"
                >
                  Pay Now via UPI
                </button>
              </div>
            </div>

            {/* UTR Input */}
            <div>
              <label className="text-sm font-medium block mt-4">
                Enter UPI Transaction ID / UTR
              </label>
              <input
                className="mt-1 p-2 w-full rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                placeholder="e.g., 2345678910"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={submitWithUtr}
                className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Submit Booking"}
              </button>
              <button
                onClick={() => setStep("form")}
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === "success" && savedId && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <Check /> <div className="font-semibold">Your request is submitted!</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <div className="text-sm text-slate-600">
                Request ID • Please save it for tracking purposes.
              </div>
              <div className="mt-1 flex items-center gap-2">
                <code className="font-mono text-sm bg-white px-2 py-1 rounded border border-slate-200">
                  {savedId}
                </code>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNav("track")}
                className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800"
              >
                Track Status
              </button>
              <button
                onClick={() => onNav("book")}
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50"
              >
                Book Another
              </button>
            </div>
          </div>
        )}
      </div>
      <aside className="rounded-2xl border border-slate-200 bg-white p-6 h-fit">
        <h4 className="font-semibold">Summary</h4>
        {selected && (
          <>
            <div className="mt-3 text-sm text-slate-600">Selected Service</div>
            <div className="font-medium">{selected.name}</div>
            <div className="mt-3 text-sm text-slate-600">Base Fee</div>
            <div className="font-medium">
              {selected.price === 0
                ? "Free Consultation"
                : fmtMoney(selected.price)}
            </div>
            <div className="mt-3 text-sm text-slate-600">
              Required Documents
            </div>
            <ul className="list-disc ml-5 text-xs text-slate-600">
              {selected.requiredDocuments?.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-6 text-xs text-slate-500">
          Note: Government fees, if any, are additional. We will confirm final
          charges after document review.
        </div>
      </aside>
    </div>
  );
}

function Tracker() {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  async function search() {
    const r = await trackRequest(id, phone);
    if (r?.error) setResult({ notFound: true });
    else setResult(r);
  }
  return (
    <div className="rounded-2xl min-h-[300px] border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold">Track your Request</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900 p-5"
          placeholder="Request ID (e.g., REQ-XXXXXXXXXX)"
          value={id}
          onChange={(e) => setId(e.target.value.toUpperCase())}
        />
        <input
          className="rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900 p-5"
          placeholder="Registered Phone (10 digits)"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
        />
        <button
          onClick={search}
          className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800"
        >
          Check Status
        </button>
      </div>
      {result?.notFound && (
        <div className="mt-4 text-sm text-red-600">
          No request found. Double‑check your Request ID and phone number.
        </div>
      )}
      {result && !result.notFound && (
        <div className="mt-6 rounded-xl border border-slate-200 p-4 bg-slate-50">
          <div className="text-sm text-slate-600">Current Status</div>
          <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-300 font-medium">
            {result.status}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-slate-600">Service</div>
              <div className="font-medium">{result?.service?.name}</div>
{/*               <div className="text-sm text-slate-600 mt-3">Scheduled</div>
              <div className="font-medium">
                {result?.schedule?.date} at {result?.schedule?.time}
              </div> */}
            </div>
            <div>
              <div className="text-sm text-slate-600">Applicant</div>
              <div className="font-medium">{result?.applicant?.fullName}</div>
              <div className="text-sm">{result?.applicant?.phone}</div>
              <div className="text-sm">{result?.applicant?.email}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Updated: {new Date(result.updatedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminModal({ open, onClose }) {
  const [authed, setAuthed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("admin@osp.local");
  const [pass, setPass] = useState("OSP@fucking2025");
  const [token, setToken] = useState(null);

  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [tab, setTab] = useState("requests");
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 0,
    requiredDocuments: [],
  });

  useEffect(() => {
    if (authed && token) {
      if (tab === "requests") {
        adminListRequests(token).then(setRequests);
      } else if (tab === "services") {
        adminListServices(token).then(setServices);
      }
    }
  }, [authed, token, open, tab]);

  async function login(e) {
    e.preventDefault();
    const r = await adminLogin(email, pass);
    if (r?.token) {
      setToken(r.token);
      setAuthed(true);
    } else alert(r?.error || "Login failed");
  }

  async function setStatus(id, status) {
    await adminUpdateStatus(token, id, status);
    const next = await adminListRequests(token);
    setRequests(next);
  }

  async function addService(e) {
    e.preventDefault();
    await adminCreateService(token, newService);
    const next = await adminListServices(token);
    setServices(next);
    setNewService({
      name: "",
      description: "",
      price: 0,
      requiredDocuments: [],
    });
  }

  async function removeService(id) {
    await adminDeleteService(token, id);
    const next = await adminListServices(token);
    setServices(next);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-4xl rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Admin Console</div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <X />
            </button>
          </div>

          {!authed ? (
            <form onSubmit={login} className="mt-4 space-y-3">
              <label className="text-sm font-medium">Login</label>
              <div className="flex items-center gap-2">
                <input
                  className="w-full p-2 rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full p-2 rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-900"
                  placeholder="Password"
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="px-3 py-2 rounded-xl border border-slate-300"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
                <button className="px-4 py-2 rounded-xl bg-slate-900 text-white">
                  Login
                </button>
              </div>
              <div className="text-xs text-slate-500">Only Admin</div>
            </form>
          ) : (
            <div className="mt-4">
              {/* Tab switcher */}
              <div className="flex gap-4 border-b mb-4">
                <button
                  onClick={() => setTab("requests")}
                  className={`pb-2 ${
                    tab === "requests" ? "font-bold border-b-2 border-slate-900" : ""
                  }`}
                >
                  Requests
                </button>
                <button
                  onClick={() => setTab("services")}
                  className={`pb-2 ${
                    tab === "services" ? "font-bold border-b-2 border-slate-900" : ""
                  }`}
                >
                  Services
                </button>
              </div>

              {tab === "requests" && (
                <div className="overflow-auto -mx-2">
                  <table className="min-w-[720px] w-full text-sm mx-2">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4">Request ID</th>
                        <th className="py-2 pr-4">Payment Utr.</th>
                        <th className="py-2 pr-4">Service</th>
                        <th className="py-2 pr-4">Applicant</th>
                        <th className="py-2 pr-4">Phone</th>
                        {/* <th className="py-2 pr-4">Schedule</th> */}
                        <th className="py-2 pr-4">Docs</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r._id} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{r.requestId}</td>
                          <td className="py-2 pr-4 font-mono text-xs">{r?.utr}</td>
                          <td className="py-2 pr-4">{r?.service?.name}</td>
                          <td className="py-2 pr-4">{r?.applicant?.fullName}</td>
                          <td className="py-2 pr-4">{r?.applicant?.phone}</td>
                          {/* <td className="py-2 pr-4">
                            {r?.schedule?.date} {r?.schedule?.time}
                          </td> */}
                          <td className="py-2 pr-4">
                            <div className="flex flex-col gap-1 max-w-[180px]">
                              {(r.documents || []).map((d, i) => (
                                <a
                                  key={i}
                                  target="_blank"
                                  rel="noreferrer"
                                  href={d.url}
                                  className="text-xs text-blue-600 underline break-all"
                                >
                                  {d.originalname}
                                </a>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 pr-4">
                            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-slate-100 border border-slate-300">
                              {r.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4">
                            <select
                              className="rounded-lg border-slate-300"
                              defaultValue={r.status}
                              onChange={(e) => setStatus(r._id, e.target.value)}
                            >
                              {[
                                "Pending",
                                "Verified",
                                "Documents Needed",
                                "In Progress",
                                "Completed",
                                "Rejected",
                              ].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === "services" && (
                <div>
                  {/* Add Service Form */}
                  <form onSubmit={addService} className="space-y-2 mb-4">
                    <input
                      className="border rounded p-2 w-full"
                      placeholder="Service name"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                    />
                    <input
                      className="border rounded p-2 w-full"
                      placeholder="Description"
                      value={newService.description}
                      onChange={(e) =>
                        setNewService({ ...newService, description: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="border rounded p-2 w-full"
                      placeholder="Price"
                      value={newService.price}
                      onChange={(e) =>
                        setNewService({ ...newService, price: Number(e.target.value) })
                      }
                    />
                    <input
                      className="border rounded p-2 w-full"
                      placeholder="Required Docs (comma separated)"
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          requiredDocuments: e.target.value.split(","),
                        })
                      }
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 text-white px-3 py-1 rounded-lg"
                    >
                      Add Service
                    </button>
                  </form>

                  {/* Services List */}
<div className="max-h-64 overflow-y-auto border rounded-lg">
  <table className="w-full text-xs border-collapse">
    <thead className="bg-slate-100 sticky top-0">
      <tr>
        <th className="p-2 text-left">Name</th>
        <th className="p-2 text-left">Description</th>
        <th className="p-2 text-left">Price</th>
        <th className="p-2 text-left">Docs</th>
        <th className="p-2 text-left">Action</th>
      </tr>
    </thead>
    <tbody>
      {services.map((s) => (
        <tr key={s._id} className="border-t hover:bg-slate-50">
          <td className="p-2">{s.name}</td>
          <td className="p-2 truncate max-w-[150px]">{s.description}</td>
          <td className="p-2">₹{s.price}</td>
          <td className="p-2 text-slate-600 text-[11px]">
            {s.requiredDocuments.join(", ")}
          </td>
          <td className="p-2">
            <button
              onClick={() => removeService(s._id)}
              className="text-red-600 hover:underline text-xs"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
