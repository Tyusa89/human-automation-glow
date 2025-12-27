import { Navigate } from "react-router-dom";

export default function RedirectTo({ to }: { to: string }) {
  return <Navigate to={to} replace />;
}
