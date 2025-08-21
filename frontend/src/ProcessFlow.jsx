import { ShieldCheck, FileText, Upload, CheckCircle, PhoneCall } from "lucide-react";

export default function ProcessFlow() {
  const steps = [
    {
      icon: <FileText className="w-12 h-12 text-blue-600" />,
      title: "1. Submit Your Request",
      desc: "Fill out the online form with all required information and upload necessary documents securely.",
    },
    {
      icon: <PhoneCall className="w-12 h-12 text-indigo-600" />,
      title: "2. Contact for Verification",
      desc: "If any OTPs, documents, or additional information are needed, our team contacts you promptly for accurate processing.",
    },
    {
      icon: <Upload className="w-12 h-12 text-green-600" />,
      title: "3. Secure Document Verification",
      desc: "Our team carefully reviews and verifies all submitted documents to prevent errors or rejections.",
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-purple-600" />,
      title: "4. Processing With Authorities",
      desc: "We forward your application securely to the relevant authorities or government portals.",
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-teal-600" />,
      title: "5. Track & Receive Updates",
      desc: "Receive real-time updates on your request until it is completed, delivered via WhatsApp or email.",
    },
  ];

  return (
   <section className="bg-gray-50 py-10 px-6">
  <section className="bg-neutral-150 py-8 px-4 sm:px-6 md:px-10 rounded-2xl shadow-sm">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
        How We Process Your Requests
      </h2>
    </div>
  </section>

  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-10">
    {steps.map((step, idx) => (
      <div
        key={idx}
        className="bg-white shadow-md hover:shadow-xl rounded-2xl p-5 flex flex-col items-center text-center transition duration-300"
      >
        <div className="p-3 bg-gray-100 rounded-full mb-3 flex items-center justify-center">
          {step.icon}
        </div>
        <h3 className="text-base md:text-lg font-semibold text-gray-800">{step.title}</h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base leading-relaxed">
          {step.desc}
        </p>
      </div>
    ))}
  </div>
</section>

  );
}
