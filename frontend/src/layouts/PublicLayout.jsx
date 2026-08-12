import { Outlet } from "react-router-dom";
import PublicNavbar from "../navbars/publicNavbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <div>
        <Outlet />
      </div>

      <footer className="mx-1 mb-1 md:mb-1 md:mx-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 text-white text-center p-3">
        © 2025 Nagarpalika Dashboard{" "}
        <span className="hidden md:inline-block">
          | Designed for Civic Management
        </span>
      </footer>
    </div>
  );
}