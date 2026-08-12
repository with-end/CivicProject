import React from "react";
import { Outlet, useParams } from "react-router-dom";
import OfficeNavbar from "../navbars/OfficeNavbar";

export default function OfficeLayout({ mode }) {
  let variable;

  if (mode === "department") {
    const { deptId } = useParams();
    variable = deptId;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <OfficeNavbar
        isLoggedIn={false}
        mode={mode}
        variable={variable}
      />

      <main className="flex-grow p-6">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 text-white text-center p-3">
        © 2025 Nagarpalika Dashboard | Designed for Civic Management
      </footer>
    </div>
  );
}