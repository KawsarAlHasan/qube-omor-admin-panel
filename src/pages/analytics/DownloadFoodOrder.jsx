import React from "react";

const DownloadFoodOrder = () => {
  const [dateRange, setDateRange] = React.useState({
    startDate: "2025-10-15",
    endDate: "2025-11-15",
  });


  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `/api/analytics/download-pdf?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("PDF download failed");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("PDF download failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) =>
            setDateRange({ ...dateRange, startDate: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) =>
            setDateRange({ ...dateRange, endDate: e.target.value })
          }
          className="border p-2 rounded"
        />
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF Report
        </button>
      </div>

      {/* আপনার existing analytics UI */}
    </div>
  );
};

export default DownloadFoodOrder;
