import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { loading, user } = useSelector((state) => state.auth);
  return (
    <>
      {loading === false &&
        (user.role !== "admin" ? <Navigate to="/" /> : <Outlet />)}
    </>
  );
};

export default AdminRoute;
