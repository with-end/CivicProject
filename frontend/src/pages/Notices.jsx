import { useState } from "react";


export default function Notices() {
  const [notices] = useState([
    {
      id: "NOTICE-001",
      title: "Water supply interruption",
      description:
        "Water supply will be disrupted in your area on 2025-09-01 from 8 AM to 5 PM.",
      date: "2025-08-30",
      department: "Water",
      type: "Important",
    },
    {
      id: "NOTICE-002",
      title: "Road repair work",
      description:
        "Main Street will be closed for maintenance on 2025-09-03. Please use alternate routes.",
      date: "2025-08-28",
      department: "Roads",
      type: "Update",
    },
    {
      id: "NOTICE-003",
      title: "Garbage collection change",
      description:
        "Garbage collection schedule will be changed on 2025-09-02. Check your local zone timings.",
      date: "2025-08-27",
      department: "Sanitation",
      type: "Info",
    },
  ]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <h2 className="text-xl md:text-4xl font-extrabold mb-3 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500">
        Latest Notices
      </h2>


      {/* Notices List */}
      <div className="flex flex-col gap-5 sm:gap-6 min-h-[80vh] max-h-[80vh] overflow-y-auto px-1">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="relative w-full bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-100/30 via-pink-100/20 to-blue-100/30 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>


            <div className="relative z-10 flex flex-col lg:flex-row gap-5">

              {/* Main Content */}
              <div className="flex-1 min-w-0">

                {/* Title + Type */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-3 mb-1 md:mb-4">

                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700 line-clamp-2">
                      {notice.title}
                    </h3>
                  </div>


                  {/* Type Badge */}
                  <div className="flex-shrink-0 lg:hidden">
                    <span
                      className={`inline-flex px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${
                        notice.type === "Important"
                          ? "bg-gradient-to-r from-red-400 to-red-600 text-white"
                          : notice.type === "Update"
                          ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                          : "bg-gradient-to-r from-green-400 to-green-600 text-white"
                      }`}
                    >
                      {notice.type}
                    </span>
                  </div>

                </div>


                {/* Divider */}
                <div className="border-t border-gray-100 md:mb-4"></div>


                {/* Description */}
                <div className="mb-3 md:mb-5 text-left">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {notice.description}
                  </p>
                </div>


                {/* Notice Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">

                  {/* Department */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                    <span className="text-sm">🏢</span>

                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">
                        Department:
                      </span>{" "}
                      {notice.department}
                    </p>
                  </div>


                  {/* Date */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                    <span className="text-sm">📅</span>

                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">
                        Date:
                      </span>{" "}
                      {notice.date}
                    </p>
                  </div>

                </div>
              </div>


              {/* Right Section */}
              <div className="hidden lg:flex lg:w-32 xl:w-36 flex-shrink-0 items-center justify-center border-l border-gray-200 pl-5">
                <span
                  className={`px-4 py-2 w-[80%] rounded-full text-xs sm:text-sm font-semibold shadow-sm whitespace-nowrap ${
                    notice.type === "Important"
                      ? "bg-gradient-to-r from-[#FF0018] via-[#D6001F] to-[#A8001A] text-white"
                      : notice.type === "Update"
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                      : "bg-gradient-to-r from-[#9CFF00] via-[#52E600] to-[#1FCB00] hover:bg-green-600 text-white"
                  }`}
                >
                  {notice.type}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}