import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">Dashboard</h1>
          <p className="text-lg mb-2 md:mb-0">Logged in as: {session.user?.email}</p>
          <a 
            href="/api/auth/signout" 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </a>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <div className="bg-white rounded shadow-lg p-6">
          <p className="text-lg mb-4">You are logged in as:</p>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p><strong className="font-medium">Name:</strong> {session.user.name}</p>
            <p><strong className="font-medium">Email:</strong> {session.user.email}</p>
            <p><strong className="font-medium">Role:</strong> {session.user.role}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const Redirect = ({ to }: { to: string }) => {
  if (typeof window !== 'undefined') {
    window.location.href = to;
  }
  return null;
};
