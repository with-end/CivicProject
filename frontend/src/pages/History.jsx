import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";


export default function History() {
  const [issues, setIssues] = useState([]);
  const [translatedTitles, setTranslatedTitles] = useState([]);
  const [translatedDescriptions, setTranslatedDescriptions] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const { t, i18n } = useTranslation();
  const nagarId = localStorage.getItem("nagarId");


  useEffect(() => {
    const fetchCompletedIssues = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reports/com/completed?nagarId=${nagarId}`
        );

        const mapped = res.data.map((r) => ({
          id: r.reportId,
          title: r.title,
          status: r.status,
          department: r.department || t("na"),
          submittedDate: r.submissionDate
            ? new Date(r.submissionDate).toLocaleDateString()
            : "--",
          completedDate: r.completionDate
            ? new Date(r.completionDate).toLocaleDateString()
            : "--",
          description: r.description,
          imageUrl: r.imageUrl || null,
        }));

        setIssues(mapped);
        setTranslatedTitles(mapped.map((i) => i.title));
        setTranslatedDescriptions(mapped.map((i) => i.description));
      } catch (err) {
        console.error("Error fetching completed reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedIssues();
  }, [t]);


  useEffect(() => {
    if (issues.length === 0) return;

    const translateTexts = async () => {
      const langCode = `${i18n.language}-IN`;

      try {
        const resTitles = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/translate`,
          {
            texts: issues.map((i) => i.title),
            targetLanguage: langCode,
          }
        );

        setTranslatedTitles(resTitles.data.translatedTexts);

        const resDescriptions = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/translate`,
          {
            texts: issues.map((i) => i.description),
            targetLanguage: langCode,
          }
        );

        setTranslatedDescriptions(
          resDescriptions.data.translatedTexts
        );
      } catch (err) {
        console.error("Translation failed:", err);

        setTranslatedTitles(issues.map((i) => i.title));
        setTranslatedDescriptions(
          issues.map((i) => i.description)
        );
      }
    };

    translateTexts();
  }, [i18n.language, issues]);


  const departments = [
    ...new Set(issues.map((issue) => issue.department)),
  ];


  const filteredIssues = issues.filter(
    (issue) =>
      issue.status === "completed" &&
      issue.id.toLowerCase().includes(searchId.toLowerCase()) &&
      (selectedDepartment === "" ||
        issue.department === selectedDepartment)
  );


  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND);

    socket.on("reportStatusChanged", ({ report }) => {
      if (
        report &&
        report.nagarId === nagarId &&
        report.status === "completed"
      ) {
        const mappedReport = {
          id: report.reportId || "",
          title: report.title,
          status: report.status,
          department: report.department || t("na"),
          submittedDate: report.submissionDate
            ? new Date(report.submissionDate).toLocaleDateString()
            : "--",
          completedDate: report.completionDate
            ? new Date(report.completionDate).toLocaleDateString()
            : "--",
          description: report.description,
          imageUrl: report.imageUrl || null,
        };

        setIssues((prev) => [...prev, mappedReport]);
        setTranslatedTitles((prev) => [
          ...prev,
          mappedReport.title,
        ]);
        setTranslatedDescriptions((prev) => [
          ...prev,
          mappedReport.description,
        ]);
      }
    });

    return () => {
      socket.off("reportStatusChanged");
    };
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h2 className="text-xl md:text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 text-center">
        {t("solvedIssuesHistory")}
      </h2>


      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-6 w-full max-w-2xl mx-auto">
        <input
          type="text"
          placeholder={t("searchById")}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 py-2 w-full md:w-[50%] px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm md:text-base"
        />

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="py-2 w-full md:w-[50%] px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm md:text-base"
        >
          <option value="">
            {t("allDepartments")}
          </option>

          {departments.map((dept, idx) => (
            <option key={idx} value={dept}>
              {t(dept)}
            </option>
          ))}
        </select>
      </div>


      {loading && (
        <p className="text-gray-600 text-center text-lg">
          {t("loading")}
        </p>
      )}


      {!loading && filteredIssues.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">
          {t("noCompletedIssues")}
        </p>
      ) : (
        <div className="flex flex-col gap-5 sm:gap-6 max-h-[75vh] overflow-y-auto px-1">
          {filteredIssues.map((issue, idx) => (
            <div
              key={idx}
              className="relative w-full bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-100/30 via-pink-100/20 to-blue-100/30 opacity-0 hover:opacity-100 transition duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row gap-5">

                {/* Image */}
                {issue.imageUrl && (
                  <div className="w-full lg:w-44 xl:w-48 flex-shrink-0">
                    <a
                      href={issue.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-full h-40 sm:h-44 lg:h-36 xl:h-40 object-cover rounded-xl border border-gray-200 shadow-sm hover:opacity-90 transition"
                      />
                    </a>
                  </div>
                )}


                {/* Main Content */}
                <div className="flex-1 min-w-0">

                  <div className="mb-4 text-left">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700 line-clamp-1">
                      {translatedTitles[idx] || issue.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      <span className="font-semibold text-gray-600">
                        {t("id")}:
                      </span>{" "}
                      {issue.id}
                    </p>
                  </div>


                  <div className="mb-4 text-left">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-2">
                      <span className="font-semibold text-gray-700">
                        {t("description")}:
                      </span>{" "}
                      {translatedDescriptions[idx] ||
                        issue.description}
                    </p>
                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 sm:mt-7">

                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <span className="text-sm">🏢</span>

                      <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-semibold text-gray-700">
                          {t("department")}:
                        </span>{" "}
                        {t(issue.department)}
                      </p>
                    </div>


                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <span className="text-sm">📅</span>

                      <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-semibold text-gray-700">
                          {t("submittedOn")}:
                        </span>{" "}
                        {issue.submittedDate}
                      </p>
                    </div>


                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <span className="text-sm">✓</span>

                      <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-semibold text-gray-700">
                          {t("completed")}:
                        </span>{" "}
                        {issue.completedDate}
                      </p>
                    </div>

                  </div>
                </div>


                {/* Status */}
                <div className="lg:w-32 xl:w-36 flex lg:flex-col justify-between lg:justify-center items-center gap-3 lg:border-l lg:border-gray-200 lg:pl-5">
                  <span className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#9CFF00] via-[#52E600] to-[#1FCB00] hover:bg-green-600 text-white shadow-sm whitespace-nowrap">
                    {t(issue.status)}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}