import { requireAdmin, getCurrentUser } from "../../../lib/server-auth";

export default async function AdminOnlyPage() {
  // This will redirect to /gold-redemption if user is not admin
  await requireAdmin();
  
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Only Page</h1>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          Welcome, {user?.name}!
        </h2>
        <p className="text-green-700">
          This page is only accessible to admin users. Your role is: <strong>{user?.role}</strong>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Permissions</h3>
        <ul className="space-y-2">
          {user?.permissions.map((permission) => (
            <li key={permission} className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              {permission}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Server-Side Benefits</h3>
        <ul className="text-blue-700 space-y-1">
          <li>• Authentication happens on the server before page loads</li>
          <li>• No client-side redirects or flashing content</li>
          <li>• Better security - authorization checks happen server-side</li>
          <li>• Improved performance - no client-side auth checks</li>
          <li>• SEO friendly - pages are properly rendered on server</li>
        </ul>
      </div>
    </div>
  );
} 