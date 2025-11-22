"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "AccessDenied") {
      setError("You are not authorized to access this admin panel.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetch("/api/auth/set-cookie", { method: "POST" })
        .then(() => {
          router.push("/admin");
          router.refresh();
        })
        .catch((err) => console.error("Cookie error:", err));
    }
  }, [status, session, router]);

  const handleSignIn = () => {
    setError(null);
    signIn("google", {
      callbackUrl: "/admin-login",
      redirect: true,
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden px-4">
      
      {/* Background glow layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-gradient-to-br from-indigo-200/60 to-purple-200/60 rounded-full blur-3xl opacity-60 animate-glow" />
        <div className="absolute bottom-[-10%] right-[20%] w-[380px] h-[380px] bg-gradient-to-br from-blue-200/50 to-pink-200/50 rounded-full blur-3xl opacity-60 animate-glow-delayed" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-200/70 shadow-2xl p-12 space-y-10 animate-fadeSlide">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Error Box */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm shadow-sm">
            {error}
          </div>
        )}

        {/* Google Sign-in */}
        {status === "loading" ? (
          <div className="text-center text-gray-400 animate-pulse">
            Checking authentication…
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="group w-full cursor-pointer py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition shadow-lg hover:shadow-xl text-white border border-gray-900 flex items-center justify-center gap-3 font-medium"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              className="h-5 w-5"
            />
            <span>Sign in with Google</span>
            <span className="opacity-0 group-hover:opacity-100 transition">
              →
            </span>
          </button>
        )}

        {/* Back to Home Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full text-gray-600 text-sm cursor-pointer font-medium bg-white border border-gray-200 rounded-xl py-2.5 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition mt-2"
        >
          ← Back to Home
        </button>

        <p className="text-center text-xs text-gray-400/70 pt-2">
          Access is restricted to verified admin emails only.
        </p>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeSlide {
          animation: fadeSlide 0.7s ease-out forwards;
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-glow {
          animation: glowPulse 6s ease-in-out infinite;
        }
        .animate-glow-delayed {
          animation: glowPulse 7s ease-in-out infinite 0.8s;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-gray-400 animate-pulse">
          Loading...
        </div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
