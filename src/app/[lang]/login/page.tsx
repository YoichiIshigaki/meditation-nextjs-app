'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    console.dir(res, { depth: null, maxArrayLength: null })

    if (res?.ok) {
      alert('ログイン成功');
      router.push(callbackUrl);
    } else {
      alert('ログイン失敗');
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-sm mx-auto space-y-4">
      <h1 className="text-xl font-bold">ログイン</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2"
      />
      <input
        type="password"
        name="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        ログイン
      </button>
    </form>
  );
}
