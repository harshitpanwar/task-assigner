"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        role
      }),
    });

    if (res.ok) {
      router.push('/auth/login');
    } else {
      setError('Failed to sign up');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Sign Up</h1>
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 mb-3 border rounded text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          className="w-full p-2 mb-3 border rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className="w-full p-2 mb-3 border rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <select
          className="w-full p-2 mb-3 border rounded text-black"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="project manager">Project Manager</option>
          <option value="annotator">Annotater</option>
        </select>

        <button className="w-full bg-green-500 text-white p-2 rounded" type="submit">
          Sign Up
        </button>
      </form>
      {error && <p className="mt-3 text-red-500">{error}</p>}
      <p className="mt-4">
        Already have an account? <Link href="/auth/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
}
