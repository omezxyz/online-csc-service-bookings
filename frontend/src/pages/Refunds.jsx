export default function Refunds() {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      <p className="mb-4 text-gray-700">
        Online Services strives for accuracy and timely processing. Refunds are handled under the following terms:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Refunds are issued only if the service could not be completed due to our error.</li>
        <li>Partial refunds may be considered if work has already been processed.</li>
        <li>No refund is available for delays caused by third-party authorities.</li>
        <li>Refund requests must be submitted via email or WhatsApp within 7 days of the request.</li>
        <li>All refund approvals are final and subject to verification.</li>
      </ul>
      <p className="mt-6 text-gray-700">
        For any issues, contact support via WhatsApp or email. We are committed to resolving concerns promptly.
      </p>
    </div>
  );
}
