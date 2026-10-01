import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';
const SummarizeModal = ({ isOpen, onClose, pdfs }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (filename) => {
    setSelectedFiles(prev =>
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  const handleSummarize = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one PDF to summarize.");
      return;
    }

    setIsLoading(true);
    setSummaries([]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filenames: selectedFiles }),
      });

      if (!response.ok) throw new Error("Failed to generate summaries.");

      const data = await response.json();
      setSummaries(data.summaries);
      toast.success("Summaries generated successfully!");
    } catch (error) {
      toast.error("An error occurred while generating summaries.");
      console.error("Summarization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-slate-700 flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">Summarize PDFs</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>

        {summaries.length > 0 ? (
          // Display Summaries View
          <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {summaries.map((item, index) => (
              <div key={index} className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-400 mb-2">{item.filename}</h3>
                <p className="text-slate-300 text-sm whitespace-pre-line">{item.summary}</p>
              </div>
            ))}
          </div>
        ) : (
          // Display File Selection View
          <>
            <div className="flex-grow overflow-y-auto border-y border-slate-700 py-4 my-4">
              <p className="text-slate-400 mb-4">Select one or more documents to generate a summary.</p>
              <div className="space-y-2">
                {pdfs.map(pdf => (
                  <label key={pdf.id} className="flex items-center space-x-3 p-2 bg-slate-700/50 rounded-md cursor-pointer hover:bg-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(pdf.filename)}
                      onChange={() => handleCheckboxChange(pdf.filename)}
                      className="h-4 w-4 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-slate-300">{pdf.filename}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleSummarize}
                disabled={isLoading || selectedFiles.length === 0}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-purple-400/50 transition-colors"
              >
                {isLoading ? "Summarizing..." : `Summarize ${selectedFiles.length} File(s)`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SummarizeModal;