import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("userRole");
    console.log('Stored user:', storedUser);
    if (storedUser) {
      try {
        setUserRole(storedUser);
      } catch (err) {
        console.error("Error decoding user:", err);
        setUserRole("");
      }
    } else {
      setUserRole("");
    }
    setLoading(false);
  }, []);

  if (loading) return null;
console.log('AdminRoute user:', userRole);    
console.log(userRole !== "admin");
  if (userRole !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default AdminRoute;