'use client'

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
        <p className="text-gray-600 mt-2">Vendor Management (Phase H.1B + H.2)</p>
      </div>

      <div className="card p-6">
        <p className="text-gray-600">Vendor management interface will be built in Week 3</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>• Vendor approval workflow</li>
          <li>• KYC verification management</li>
          <li>• Bank details configuration</li>
          <li>• Document upload & verification</li>
          <li>• Catalog approval workflow</li>
          <li>• Performance metrics & trending</li>
        </ul>
      </div>
    </div>
  )
}
