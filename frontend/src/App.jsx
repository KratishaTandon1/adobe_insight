

// //----------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import { Toaster } from 'react-hot-toast';
// import PDFUpload from "./components/PDFUpload";
// import PdfList from "./components/PdfList";
// import RecommendationPanel from "./components/RecommendationPanel";
// import SnippetViewer from "./components/SnippetViewer";
// import PDFViewer from "./components/PDFViewer";
// import InsightsPanel from "./components/InsightsPanel";
// import Chatbot from "./components/Chatbot";
// import { FileText } from 'lucide-react';
// import SummarizeButton from "./components/SummarizeButton";
// import SummarizeModal from "./components/SummarizeModal";
// import DebateButton from "./components/DebateButton";
// import DebateModal from "./components/DebateModal";
// export default function App() {
//   const [pdfs, setPdfs] = useState([]);
//   const [selectedSnippet, setSelectedSnippet] = useState(null);
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [showViewer, setShowViewer] = useState(false);
//    const [isSummarizeModalOpen, setIsSummarizeModalOpen] = useState(false);
// const [isDebateModalOpen, setIsDebateModalOpen] = useState(false);
//   const fetchPdfList = () => {
//     fetch("http://localhost:8080/api/pdf/list")
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) setPdfs(data);
//         else setPdfs([]);
//       })
//       .catch((err) => {
//         // console.error("Error loading PDFs:", err);
//         setPdfs([]);
//       });
//   };

//   useEffect(() => {
//     fetchPdfList();
//   }, []);

//   const handleUpload = () => fetchPdfList();
//   const handleDelete = (filename) => {
    
//     fetch(`http://localhost:8080/api/pdf/delete/${filename}`, { method: "DELETE" })
//       .then(() => fetchPdfList())
//       .catch((err) => console.error("Delete failed:", err));
//   };
//   const handleView = (file) => {
//     setSelectedPdf(file);
//     setShowViewer(true);
//   };
//   const handleSnippetClick = (recommendation) => setSelectedSnippet(recommendation);

//   return (
//     <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
//       {/* The Toaster component is added here to enable notifications */}
//       <Toaster 
//         position="top-center"
//         toastOptions={{
//           style: {
//             background: '#334155', // slate-700
//             color: '#e2e8f0', // slate-300
//             border: '1px solid #475569', // slate-600
//           },
//         }}
//       />

//       <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 p-4 flex-shrink-0 sticky top-0 z-40">
//         <h1 className="text-xl font-bold text-blue-400">PDF Insight</h1>
//       </nav>

//       <main className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
//         <div className="flex-grow flex flex-col lg:flex-row gap-6">
//           <div className="lg:flex-[2] flex flex-col">
//             <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col flex-grow h-0">
//               <h2 className="text-lg font-semibold mb-3 flex items-center flex-shrink-0">
//                 <FileText className="mr-2 text-blue-400" /> Documents
//               </h2>
//               <PDFUpload onUpload={handleUpload} />
//               <PdfList pdfs={pdfs} onDelete={handleDelete} onView={handleView} />
//             </div>
//           </div>
//           <div className="lg:flex-[3] flex flex-col">
//             <RecommendationPanel
//               onSnippetClick={handleSnippetClick}
//             />
//           </div>
//           <div className="lg:flex-[2] flex flex-col">
//             <InsightsPanel />
//           </div>
//         </div>
//       </main>
//   {/* Floating Buttons */}
//       <DebateButton onClick={() => setIsDebateModalOpen(true)} />
//       <SummarizeButton onClick={() => setIsSummarizeModalOpen(true)} />
//       <Chatbot />

//       {/* Modals */}
//       <DebateModal
//         isOpen={isDebateModalOpen}
//         onClose={() => setIsDebateModalOpen(false)}
//         onEvidenceClick={handleSnippetClick}
//       />
//       <SummarizeModal 
//         isOpen={isSummarizeModalOpen}
//         onClose={() => setIsSummarizeModalOpen(false)}
//         pdfs={pdfs}
//       />
//       {selectedSnippet && <SnippetViewer snippet={selectedSnippet} onClose={() => setSelectedSnippet(null)} />}
//       {showViewer && <PDFViewer file={selectedPdf} onClose={() => setShowViewer(false)} />}
//     </div>
//   );
// }











import React, { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from "./apiConfig";
import PDFUpload from "./components/PDFUpload";
import PdfList from "./components/PdfList";
import RecommendationPanel from "./components/RecommendationPanel";
import SnippetViewer from "./components/SnippetViewer";
import PDFViewer from "./components/PDFViewer";
import InsightsPanel from "./components/InsightsPanel";
import Chatbot from "./components/Chatbot";
import SummarizeButton from "./components/SummarizeButton";
import SummarizeModal from "./components/SummarizeModal";
import DebateButton from "./components/DebateButton";
import DebateModal from "./components/DebateModal";
import { FileText } from 'lucide-react';

export default function App() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [isSummarizeModalOpen, setIsSummarizeModalOpen] = useState(false);
  const [isDebateModalOpen, setIsDebateModalOpen] = useState(false);

  const fetchPdfList = () => {
    fetch(`${API_BASE_URL}/api/pdf/list`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPdfs(data);
        else setPdfs([]);
      })
      .catch((err) => {
        console.error("Error loading PDFs:", err);
        setPdfs([]);
      });
  };

  useEffect(() => {
    fetchPdfList();
  }, []);

  const handleUpload = () => fetchPdfList();
  const handleDelete = (filename) => {
    fetch(`${API_BASE_URL}/api/pdf/delete/${filename}`, { method: "DELETE" })
      .then(() => fetchPdfList())
      .catch((err) => console.error("Delete failed:", err));
  };
  const handleView = (file) => {
    setSelectedPdf(file);
    setShowViewer(true);
  };
  const handleSnippetClick = (recommendation) => {
    setSelectedSnippet(recommendation);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#334155',
            color: '#e2e8f0',
            border: '1px solid #475569',
          },
        }}
      />
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 p-4 flex-shrink-0 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-blue-400">PDF Insight</h1>
      </nav>
      <main className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
        <div className="flex-grow flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-[2] flex flex-col">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col flex-grow h-0">
              <h2 className="text-lg font-semibold mb-3 flex items-center flex-shrink-0">
                <FileText className="mr-2 text-blue-400" /> Documents
              </h2>
              <PDFUpload onUpload={handleUpload} />
              <PdfList pdfs={pdfs} onDelete={handleDelete} onView={handleView} />
            </div>
          </div>
          <div className="lg:flex-[3] flex flex-col">
            <RecommendationPanel onSnippetClick={handleSnippetClick} />
          </div>
          <div className="lg:flex-[2] flex flex-col">
            <InsightsPanel />
          </div>
        </div>
      </main>
      <DebateButton onClick={() => setIsDebateModalOpen(true)} />
      <SummarizeButton onClick={() => setIsSummarizeModalOpen(true)} />
      <Chatbot />
      <DebateModal isOpen={isDebateModalOpen} onClose={() => setIsDebateModalOpen(false)} onEvidenceClick={handleSnippetClick} />
      <SummarizeModal isOpen={isSummarizeModalOpen} onClose={() => setIsSummarizeModalOpen(false)} pdfs={pdfs} />
      {selectedSnippet && <SnippetViewer snippet={selectedSnippet} onClose={() => setSelectedSnippet(null)} />}
      {showViewer && <PDFViewer file={selectedPdf} onClose={() => setShowViewer(false)} />}
    </div>
  );
}
