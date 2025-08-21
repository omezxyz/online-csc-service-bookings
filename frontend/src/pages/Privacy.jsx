export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">
        Your privacy is important to us. Online Services ensures that your personal data is protected:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>We collect only necessary information to process your requests.</li>
        <li>Your data is stored securely and not shared with unauthorized parties.</li>
        <li>OTP and document verification are handled securely.</li>
        <li>Updates are sent via WhatsApp or email, never public platforms.</li>
        <li>You can request deletion of your data at any time.</li>
      </ul>
      <p className="mt-6 text-gray-700">
        By using our services, you consent to the collection and use of information in accordance with this policy.
      </p>
    </div>
  );
}
