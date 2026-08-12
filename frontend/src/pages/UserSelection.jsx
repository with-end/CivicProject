import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserSelection() {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLocation() {
      try {
        const nagarId = localStorage.getItem("nagarId");

        if (nagarId) return;

        if (!navigator.geolocation) {
          console.error("Geolocation not supported by this browser.");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const { latitude, longitude } = pos.coords;

              const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/nagarpalika/find?lat=${latitude}&lng=${longitude}`
              );

              console.log("Backend response:", res.data);

              if (res.data) {
                localStorage.setItem("nagarId", res.data.nagarId);
                localStorage.setItem(
                  "center",
                  JSON.stringify(res.data.center)
                );
                localStorage.setItem(
                  "myLocation",
                  JSON.stringify([latitude, longitude])
                );
              }
            } catch (err) {
              console.error("API error:", err);
            }
          },
          (geoError) => {
            console.error("Geolocation error:", geoError);
          },
          { enableHighAccuracy: true }
        );
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    fetchLocation();
  }, []);

  const options = [
    { label: "Public", path: "/public" },
    { label: "Municipal Council", path: "/login" },
    { label: "State Govt.", path: "/state" },
  ];

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-5 py-3 -mt-2">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center"
      >
        <span className="hidden md:inline-block">Welcome to</span>{" "}
        CivicConnect{" "}
        <span className="hidden md:inline-block">🚀</span>

        <span className="mt-2 md:mt-0 block text-lg font-medium text-gray-600">
          Please select who you are
        </span>
      </motion.h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {options.map((opt, i) => (
          <motion.div
            key={opt.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-between hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => navigate(opt.path)}
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              {opt.label}
            </h2>

            <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow hover:from-indigo-600 hover:to-purple-600">
              Go →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}