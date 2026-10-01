// frontend/src/components/PDFManager.jsx

import { useEffect, useState } from "react";
import PDFUpload from "./PDFUpload";
import PdfList from "./PdfList";
import PDFViewer from "./PDFViewer";
import axios from "axios";
import { API_BASE_URL } from '../apiConfig';
const PDFManager = () => {
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const fetchPdfList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pdf/list`);
      setPdfList(response.data.pdfs);
    } catch (error) {
      console.error("Failed to fetch PDF list:", error);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/pdf/delete/${filename}`);
      if (selectedPdf === filename) setSelectedPdf(null);
      fetchPdfList();
    } catch (error) {
      console.error("Failed to delete PDF:", error);
    }
  };

  useEffect(() => {
    fetchPdfList();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Left panel */}
      <div className="w-1/3 border-r border-gray-300 p-4 bg-white shadow-md overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">📄 My PDF Library</h1>
        <PDFUpload fetchPdfList={fetchPdfList} />
        <PdfList
          pdfs={pdfList}
          onSelect={(filename) => setSelectedPdf(filename)}
          onDelete={handleDelete}
          selected={selectedPdf}
        />
      </div>

      {/* Right panel */}
      <div className="w-2/3 p-4 bg-gray-50">
        {selectedPdf ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedPdf}</h2>
              <button
                onClick={() => setSelectedPdf(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Close Viewer
              </button>
            </div>
            <div className="flex-1">
              <PDFViewer fileName={selectedPdf} />
            </div>
          </div>
        ) : (
          <div className="text-gray-600 text-center mt-24 text-lg">
            Select a PDF to preview it here →
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFManager;
