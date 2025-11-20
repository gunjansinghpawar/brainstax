// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  // 1️⃣ Not logged in → kick to login
  if (!user) return <Navigate to="/login" replace />;

  // 2️⃣ Logged in but role not allowed
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3️⃣ All good → show component
  return children;
};

export default ProtectedRoute;
