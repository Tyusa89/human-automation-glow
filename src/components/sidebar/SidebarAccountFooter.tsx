import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export default function SidebarAccountFooter() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="mt-auto border-t border-white/10 p-3">
        <Link
          to="/auth"
          className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-auto border-t border-white/10 p-3 space-y-2">
      <Link
        to="/profile"
        className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all"
      >
        Profile
      </Link>

      <button
        onClick={async () => {
          try {
            await signOut?.();
          } finally {
            navigate("/");
          }
        }}
        className="flex w-full items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 font-medium hover:bg-red-500/20 hover:border-red-500/50 transition-all"
      >
        Sign out
      </button>
    </div>
  );
}