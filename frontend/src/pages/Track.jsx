import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function TrackIssue() {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState("");
  const [translatedDescription, setTranslatedDescription] = useState("");

  const { t, i18n } = useTranslation();

  const stages = [
    t("submitted"),
    t("approved"),
    t("inProgress"),
    t("completed"),
  ];

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    setLoading(true);

    try {
      const nagarId = localStorage.getItem("nagarId");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/reports/rep/${searchId}?nagarId=${nagarId}`
      );

      setResult(res.data || { notFound: true });

      if (res.data && !res.data.notFound) {
        setTranslatedTitle(res.data.title);
        setTranslatedDescription(res.data.description);
      }
    } catch (err) {
      console.error(err);
      setResult({ notFound: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result || result.notFound) return;

    const fetchTranslations = async () => {
      const langCode = `${i18n.language}-IN`;

      try {
        const resTitle = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/translate`,
          {
            texts: [result.title],
            targetLanguage: langCode,
          }
        );

        setTranslatedTitle(resTitle.data.translatedTexts[0]);

        const resDescription = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/translate`,
          {
            texts: [result.description],
            targetLanguage: langCode,
          }
        );

        setTranslatedDescription(
          resDescription.data.translatedTexts[0]
        );
      } catch (err) {
        console.error("Translation failed:", err);
        setTranslatedTitle(result.title);
        setTranslatedDescription(result.description);
      }
    };

    fetchTranslations();
  }, [i18n.language, result]);

  const getDate = (stage) => {
    if (!result) return "--";

    switch (stage) {
      case t("submitted"):
        return result.submissionDate
          ? new Date(result.submissionDate).toLocaleDateString()
          : "--";

      case t("approved"):
        return result.approvalDate
          ? new Date(result.approvalDate).toLocaleDateString()
          : "--";

      case t("inProgress"):
        return result.inprogressDate
          ? new Date(result.inprogressDate).toLocaleDateString()
          : "--";

      case t("completed"):
        return result.completionDate
          ? new Date(result.completionDate).toLocaleDateString()
          : "--";

      default:
        return "--";
    }
  };

  const isActive = (stage) => {
    const date = getDate(stage);
    return date && date !== "--";
  };

  return (
    <div className="min-h-[83vh] bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-xl md:text-3xl font-extrabold mb-3 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 text-center">
        {t("trackYourIssue")}
      </h2>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-8 w-full md:w-[65%]">
        <input
          type="text"
          placeholder={t("enterIssueId")}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm md:text-base w-full"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-lg font-semibold shadow-md hover:from-pink-500 hover:to-yellow-500 transition text-sm md:text-base whitespace-nowrap"
        >
          {loading ? t("loading") : t("track")}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="w-full md:max-w-[65%] bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-300 hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 flex flex-col">
          {result.notFound ? (
            <p className="text-red-500 text-base sm:text-lg font-semibold text-center py-4">
              {t("noIssueFound")} "{searchId}"
            </p>
          ) : (
            <>
              {/* Issue Details */}
              <div className="md:mb-10 grid grid-cols-2 sm:grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-x-2 gap-y-2 md:gap-x-4 md:gap-y-3 items-start text-left">
                <span className="font-bold text-indigo-700 sm:text-xl md:text-2xl">
                  Title:
                </span>

                <span className="sm:text-xl md:text-2xl font-bold text-indigo-700 break-words">
                  {translatedTitle || result.title}
                </span>

                <span className="font-semibold text-gray-700">
                  {t("id")}:
                </span>

                <span className="text-gray-700 break-all">
                  {result.reportId}
                </span>

                <span className="font-semibold text-gray-700">
                  {t("department")}:
                </span>

                <span className="text-gray-700 break-words">
                  {t(result.department) || t("na")}
                </span>

                <span className="font-semibold text-gray-700">
                  {t("submittedBy")}:
                </span>

                <span className="text-gray-700 break-all">
                  {result.reporterEmail}
                </span>

                <span className="font-semibold text-gray-700">
                  {t("description")}:
                </span>

                <span className="text-gray-700 break-words leading-relaxed">
                  {translatedDescription || result.description}
                </span>
              </div>

              {/* Progress Tracker */}
              <div className="relative flex justify-between items-start w-full px-1 sm:px-2 mt-2">
                <div className="absolute top-4 sm:top-5 left-2 right-2 sm:left-3 sm:right-3 h-1 bg-gray-300 z-0 rounded-full" />

                <div
                  className="absolute top-4 sm:top-5 left-2 sm:left-3 h-1 bg-indigo-500 z-0 rounded-full"
                  style={{
                    width: `${
                      ((stages.filter(isActive).length - 1) /
                        (stages.length - 1)) *
                      100
                    }%`,
                    transition: "width 0.5s",
                  }}
                />

                {stages.map((stage, index) => (
                  <div
                    key={stage}
                    className="relative flex flex-col items-center z-10 flex-1 min-w-0"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${
                        isActive(stage)
                          ? "bg-gradient-to-r from-indigo-500 to-pink-500 shadow-lg"
                          : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <span className="mt-2 text-[10px] sm:text-xs md:text-sm font-medium text-center leading-tight break-words max-w-[70px] sm:max-w-none">
                      {stage}
                    </span>

                    <span className="mt-1 text-[9px] sm:text-[10px] md:text-xs text-gray-600 text-center whitespace-nowrap">
                      {getDate(stage)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}