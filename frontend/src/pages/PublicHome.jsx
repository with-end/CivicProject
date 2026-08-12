import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import io from "socket.io-client";

export default function PublicHome() {
  const { t, i18n } = useTranslation();
  const nagarId = localStorage.getItem("nagarId");

  const [issues, setIssues] = useState([]);
  const [translatedTitles, setTranslatedTitles] = useState([]);
  const [translatedDescriptions, setTranslatedDescriptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [upvotes, setUpvotes] = useState({});

  const statuses = ["all", "pending", "approved", "inprogress"];
  const departments = [
    "all",
    "electricity",
    "roads",
    "sanitation",
    "water",
    "parks",
    "others",
  ];

  const getDeterministicRandom = (value, max = 6) => {
    let seed = 0;

    for (let i = 0; i < value.toString().length; i++) {
      seed =
        (seed * 31 + value.toString().charCodeAt(i)) %
        1000000007;
    }

    return seed % (max + 1);
  };

  useEffect(() => {
    if (!nagarId) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/reports/${nagarId}`)
      .then((res) => {
        setIssues(res.data);
        setTranslatedTitles(res.data.map((issue) => issue.title));
        setTranslatedDescriptions(
          res.data.map((issue) => issue.description)
        );

        const initialUpvotes = {};

        res.data.forEach((issue, index) => {
          initialUpvotes[issue._id] =
            index >= 6 ? 0 : getDeterministicRandom(index);
        });

        setUpvotes(initialUpvotes);
      })
      .catch((err) => console.error("Error fetching reports:", err));
  }, [nagarId]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND);

    socket.on("assigned", (report) => {
      setIssues((prev) => [...prev, report]);
      setUpvotes((prev) => ({
        ...prev,
        [report._id]: 0,
      }));
    });

    socket.on("reportStatusChanged", ({ report }) => {
      if (report && report.nagarId === nagarId) {
        setIssues((prev) =>
          prev.map((issue) =>
            issue.reportId === report.reportId ? report : issue
          )
        );
      }
    });

    return () => {
      socket.off("assigned");
      socket.off("reportStatusChanged");
    };
  }, [nagarId]);

  useEffect(() => {
    if (issues.length === 0) return;

    const fetchTranslations = async () => {
      const titles = issues.map((issue) => issue.title);
      const descriptions = issues.map((issue) => issue.description);
      const langCode = `${i18n.language}-IN`;

      try {
        const [titleRes, descriptionRes] = await Promise.all([
          axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/translate`,
            {
              texts: titles,
              targetLanguage: langCode,
            }
          ),
          axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/translate`,
            {
              texts: descriptions,
              targetLanguage: langCode,
            }
          ),
        ]);

        setTranslatedTitles(titleRes.data.translatedTexts);
        setTranslatedDescriptions(
          descriptionRes.data.translatedTexts
        );
      } catch (err) {
        console.error("Translation failed:", err);
        setTranslatedTitles(titles);
        setTranslatedDescriptions(descriptions);
      }
    };

    fetchTranslations();
  }, [i18n.language, issues]);

  const handleUpvote = (id) => {
    setUpvotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const filteredIssues = issues.filter(
    (issue) =>
      (statusFilter === "all" || issue.status === statusFilter) &&
      (departmentFilter === "all" ||
        issue.department === departmentFilter)
  );

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8 bg-gray-100">
      <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 drop-shadow-sm">
        {t("currentIssues")}
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:flex-1 max-w-full sm:max-w-[220px] px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-gray-300 shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {t(status)}
            </option>
          ))}
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full sm:flex-1 max-w-full sm:max-w-[220px] px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-gray-300 shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          {departments.map((department) => (
            <option key={department} value={department}>
              {t(department)}
            </option>
          ))}
        </select>
      </div>

      {/* Issues */}
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-7">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => {
            const index = issues.findIndex(
              (item) => item._id === issue._id
            );

            return (
              <div
                key={issue._id}
                className="relative w-full bg-gray-50 md:bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-100/30 via-pink-100/20 to-blue-100/30 opacity-0 hover:opacity-100 transition duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row gap-5">
                  {issue.imageUrl && (
                    <div className="w-full lg:w-44 xl:w-48 flex-shrink-0">
                      <img
                        src={issue.imageUrl}
                        alt="Report"
                        className="w-full h-40 sm:h-44 lg:h-36 xl:h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="mb-3 ml-1 text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-indigo-700 line-clamp-1">
                        {translatedTitles[index] || issue.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        <span className="font-semibold text-gray-600">
                          {t("id")}:
                        </span>{" "}
                        {issue.reportId}
                      </p>
                    </div>

                    <div className="mb-4 text-left ml-1">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-2">
                        <span className="font-semibold text-gray-700">
                          {t("description")}:
                        </span>{" "}
                        {translatedDescriptions[index] ||
                          issue.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <span className="text-indigo-500 text-sm">
                          🏢
                        </span>

                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-semibold text-gray-700">
                            {t("department")}:
                          </span>{" "}
                          {t(issue.department)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <span className="text-indigo-500 text-sm">
                          📅
                        </span>

                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-semibold text-gray-700">
                            {t("submittedOn")}:
                          </span>{" "}
                          {new Date(
                            issue.submissionDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-32 xl:w-36 flex lg:flex-col justify-between lg:justify-center items-center gap-3 lg:border-l lg:border-gray-200 lg:pl-5">
                    <span
                      className={`text-center w-[40%] h-[32px] md:w-[90%] px-3 sm:px-4 md:py-1.5 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm whitespace-nowrap ${
                        issue.status === "inprogress"
                          ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 shadow-yellow-200"
                          : issue.status === "approved"
                          ? "bg-gradient-to-r from-blue-300 to-blue-500 text-blue-900 shadow-blue-200"
                          : "bg-gradient-to-r from-[#FF0018] via-[#D6001F] to-[#A8001A] text-white"
                      }`}
                    >
                      {t(issue.status)}
                    </span>

                    <button
                      onClick={() => handleUpvote(issue._id)}
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#01D2F1] via-[#0B9FE7] to-[#1567D7] text-white rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 whitespace-nowrap"
                    >
                      👍 {t("upvote")}
                      <span className="ml-1 font-bold">
                        {upvotes[issue._id] || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center text-sm sm:text-lg">
            {t("noReports")}
          </p>
        )}
      </div>
    </div>
  );
}