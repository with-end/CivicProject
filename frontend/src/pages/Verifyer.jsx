import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

export default function OfficerDashboard() {
  const location = useLocation();
  const { officer } = location.state || {};
  const officerId = officer ? officer._id : null;

  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState(
    officer && officer.status !== "inactive" ? "active" : "inactive"
  );
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(null);

  useEffect(() => {
    console.log(officer);
    fetchReports();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND);

    socket.on("assigned", (report) => {
      if (report.assignedOfficer === officerId) {
        setReports((prev) => [...prev, report]);
        console.log("new report assigned", report);
      }
    });

    return () => {
      socket.off("assigned");
    };
  }, []);

  async function fetchReports() {
    setLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/officer/${officerId}/reports`
      );

      setReports(res.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function updateStatus(newStatus) {
    setStatus(newStatus);

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/officer/${officerId}/status`,
      { status: newStatus }
    );

    fetchReports();
  }

  async function approveReport(reportId) {
    setApproveLoading(reportId);

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/officer/${officerId}/reports/${reportId}/approve`
    );

    setApproveLoading(null);

    setReports((prev) => prev.filter((r) => r._id !== reportId));
  }

  const pendingReports = reports.filter(
    (report) => report.status === "pending"
  ).length;

  return (
    <div className="p-1 max-w-6xl mx-auto h-screen bg-gray-100">
      <div className="min-h-[93%] bg-gray-50 md:px-2">

        {/* Header */}
        <div className="bg-gradient-to-r -mt-1 from-indigo-500 via-pink-500 to-yellow-500 text-white p-4 shadow-lg flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Officer Dashboard
          </h1>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-3">
            <span className="font-semibold">
              Status:
              <span
                className={`ml-2 font-bold ${
                  status === "active"
                    ? "text-green-300"
                    : "text-gray-700"
                }`}
              >
                {status.toUpperCase()}
              </span>
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus("active")}
                className="px-4 py-2 bg-gradient-to-r from-[#9CFF00] via-[#52E600] to-[#1FCB00] hover:bg-green-600 rounded-xl shadow text-white font-medium transition"
              >
                Set Active
              </button>

              <button
                onClick={() => updateStatus("inactive")}
                className="px-4 py-2 bg-gradient-to-r from-[#6B7280] via-[#4B5563] to-[#374151] rounded-xl shadow text-white font-medium transition"
              >
                Set Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="flex justify-end mb-6">
          <span className="bg-gradient-to-r from-[#FEE403] via-[#FCAE10] to-[#F87918] hover:bg-yellow-600 font-bold px-4 py-2 rounded-full shadow-sm text-sm sm:text-base">
            Pending Reports: {pendingReports}
          </span>
        </div>

        {/* Reports */}
        {loading ? (
          <p className="text-center text-gray-500">
            Loading reports...
          </p>
        ) : (
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <div
                key={r._id}
                className="relative w-full bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-5 border border-gray-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                {/* Hover Background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-100/30 via-pink-100/20 to-blue-100/30 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">

                  {/* Header */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-indigo-700 leading-snug break-words">
                      {r.title}
                    </h3>

                    <div className="border-t border-gray-100" />

                    <div>
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${
                          r.status === "submitted"
                            ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900"
                            : r.status === "processing"
                            ? "bg-gradient-to-r from-blue-300 to-blue-500 text-blue-900"
                            : "bg-gradient-to-r from-[#9CFF00] via-[#52E600] to-[#1FCB00] hover:bg-green-600 text-white"
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-3 flex-1">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => approveReport(r._id)}
                      disabled={approveLoading === r._id}
                      className={`w-full px-4 py-2.5 rounded-full text-white font-medium shadow-sm transition-all duration-200 ${
                        approveLoading === r._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#01D2F1] via-[#0B9FE7] to-[#1567D7] hover:shadow-md hover:scale-[1.01]"
                      }`}
                    >
                      {approveLoading === r._id
                        ? "Approving..."
                        : "Approve"}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 text-white text-center p-3">
        © 2025 officer Dashboard
        <span className="hidden md:inline">
          {" "}
          | Designed for Civic Management
        </span>
      </footer>
    </div>
  );
}