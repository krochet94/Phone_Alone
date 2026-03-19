import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  return (
    <>
      {loading === false &&
        (isAuthenticated === false ? <Navigate to="/login" /> : <Outlet />)}
    </>
  );
};

export default ProtectedRoute;
