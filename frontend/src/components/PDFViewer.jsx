



// import React, { useEffect, useState, useRef } from 'react';
// import { Zap, X, Mic, Play, Pause } from 'lucide-react';
// import toast from 'react-hot-toast';

// const PDFViewer = ({ file, onClose }) => {
//   const viewerRef = useRef(null);
//   const [insightResult, setInsightResult] = useState(null);
//   const [isInsightLoading, setIsInsightLoading] = useState(false);
  
//   // State for the "Read Aloud" feature
//   const [isTtsLoading, setIsTtsLoading] = useState(false);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioPlayerRef = useRef(null);
//   const copiedTextRef = useRef(""); // Use a ref for the copied text

//   useEffect(() => {
//     if (file?.url && viewerRef.current && !viewerRef.current.hasChildNodes()) {
//       const adobeDCView = new window.AdobeDC.View({
//         clientId: "6b69525ba155485c869f6fc1a870d5cd",
//         divId: viewerRef.current.id,
//       });
//       adobeDCView.previewFile({
//         content: { location: { url: file.url } },
//         metaData: { fileName: file.filename },
//       });
//     }
//   }, [file]);

//   const handleGetInsightClick = async () => {
//     try {
//       const copiedText = await navigator.clipboard.readText();
//       if (!copiedText || copiedText.length < 20) {
//         toast.error("Please select and copy text from the PDF first.");
//         return;
//       }
//       setIsInsightLoading(true);
//       setInsightResult(null);
      
//       const response = await fetch(`http://localhost:8080/api/selection-insight`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ selected_text: copiedText }),
//       });
//       if (!response.ok) throw new Error("Failed to get insight.");
//       const data = await response.json();
//       setInsightResult(data.insight);
//     } catch (err) {
//       toast.error("Could not generate insight for the selection.");
//     } finally {
//       setIsInsightLoading(false);
//     }
//   };

//   const handleReadAloudClick = async () => {
//     try {
//       const copiedText = await navigator.clipboard.readText();
//       copiedTextRef.current = copiedText; // Save to ref
//       if (!copiedTextRef.current || copiedTextRef.current.length < 10) {
//         toast.error("Please select and copy a piece of text first.");
//         return;
//       }
//       setIsTtsLoading(true);
//       toast.loading("Generating audio...");

//       const apiBaseUrl = 'http://localhost:8080';
      
//       // --- THIS IS THE CRUCIAL FIX ---
//       // Call the new, dedicated /api/tts endpoint
//       const response = await fetch(`${apiBaseUrl}/api/tts`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text_to_read: copiedTextRef.current }),
//       });
//       if (!response.ok) throw new Error("Failed to generate audio.");
//       const data = await response.json();

//       setAudioUrl(`${apiBaseUrl}${data.audio_url}`);
//       toast.dismiss();
//       toast.success("Audio ready to play.");

//     } catch(err) {
//       toast.dismiss();
//       toast.error("Could not generate audio.");
//     } finally {
//       setIsTtsLoading(false);
//     }
//   };

//   const togglePlayPause = () => {
//     if (isPlaying) {
//       audioPlayerRef.current.pause();
//     } else {
//       audioPlayerRef.current.play();
//     }
//   };

//   if (!file) return null;
  
//   const modalOverlayStyle = { position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
//   const modalContentStyle = { backgroundColor: 'white', width: '90%', height: '85%', borderRadius: '8px', position: 'relative' };
//   const closeButtonStyle = { position: 'absolute', top: '12px', right: '12px', zIndex: 60, background: '#1e2b3b', color: '#cbd5e1', borderRadius: '9999px', padding: '0px 8px', cursor: 'pointer', border: '1px solid #334155', fontSize: '1.125rem', fontWeight: 'bold' };

//   return (
//     <div style={modalOverlayStyle}>
//       <div style={modalContentStyle}>
//         <div className="absolute top-2 left-4 z-10 flex items-center gap-2 bg-slate-800/50 p-2 rounded-full backdrop-blur-sm">
//           <button 
//             onClick={handleGetInsightClick}
//             disabled={isInsightLoading}
//             className="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-slate-500"
//             title="Get Insight for Copied Text"
//           >
//             {isInsightLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap size={20} />}
//           </button>
          
//           <button 
//             onClick={handleReadAloudClick}
//             disabled={isTtsLoading}
//             className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-500"
//             title="Read Copied Text Aloud"
//           >
//             {isTtsLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Mic size={20} />}
//           </button>

//           {audioUrl && !isTtsLoading && (
//              <button 
//               onClick={togglePlayPause}
//               className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700"
//             >
//               {isPlaying ? <Pause size={20} /> : <Play size={20} />}
//             </button>
//           )}
//         </div>
        
//         {insightResult && (
//           <div className="absolute top-20 left-4 z-10 bg-slate-800 p-4 rounded-lg shadow-lg w-80">
//             <h4 className="font-semibold text-blue-400 mb-2">Insight</h4>
//             <p className="text-sm text-slate-300">{insightResult}</p>
//             <button onClick={() => setInsightResult(null)} className="text-xs text-slate-500 mt-3 w-full text-right">Close</button>
//           </div>
//         )}

//         <button onClick={onClose} style={closeButtonStyle}>✕</button>
//         <div id="pdf-viewer-container" ref={viewerRef} style={{ width: '100%', height: '100%' }} />

//         <audio 
//           ref={audioPlayerRef} 
//           src={audioUrl}
//           onPlay={() => setIsPlaying(true)}
//           onPause={() => setIsPlaying(false)}
//           onEnded={() => setIsPlaying(false)}
//           className="hidden" 
//         />
//       </div>
//     </div>
//   );
// };

// export default PDFViewer;





import React, { useEffect, useState, useRef } from 'react';
import { Zap, X, Mic, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';
import { ADOBE_API_KEY } from '../adobeApiConfig';
const PDFViewer = ({ file, onClose }) => {
  const viewerRef = useRef(null);
  const [insightResult, setInsightResult] = useState(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef(null);
  const copiedTextRef = useRef("");

  useEffect(() => {
    if (file?.url && viewerRef.current && !viewerRef.current.hasChildNodes()) {
      const adobeDCView = new window.AdobeDC.View({
        clientId: ADOBE_API_KEY,
        divId: viewerRef.current.id,
      });
      adobeDCView.previewFile({
        content: { location: { url: file.url } },
        metaData: { fileName: file.filename },
      });
    }
  }, [file]);

  const handleGetInsightClick = async () => {
    try {
      const copiedText = await navigator.clipboard.readText();
      if (!copiedText || copiedText.length < 20) {
        toast.error("Please select and copy text from the PDF first.");
        return;
      }
      setIsInsightLoading(true);
      setInsightResult(null);
      
      // --- THIS IS THE FIX ---
      // Use the same dynamic URL logic for consistency
      const isDevelopment = window.location.hostname === 'localhost';
      const apiBaseUrl = isDevelopment 
        ? 'http://localhost:8080' 
        : 'https://avtech03-pdf-insight-backend.hf.space';
      
      const response = await fetch(`${apiBaseUrl}/api/selection-insight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_text: copiedText }),
      });
      if (!response.ok) throw new Error("Failed to get insight.");
      const data = await response.json();
      setInsightResult(data.insight);
    } catch (err) {
      toast.error("Could not generate insight for the selection.");
    } finally {
      setIsInsightLoading(false);
    }
  };

  const handleReadAloudClick = async () => {
    try {
      const copiedText = await navigator.clipboard.readText();
      copiedTextRef.current = copiedText;
      if (!copiedTextRef.current || copiedTextRef.current.length < 10) {
        toast.error("Please select and copy a piece of text first.");
        return;
      }
      setIsTtsLoading(true);
      toast.loading("Generating audio...");

      const isDevelopment = window.location.hostname === 'localhost';
      const apiBaseUrl = isDevelopment 
        ? 'http://localhost:8080' 
        : 'https://avtech03-pdf-insight-backend.hf.space';

      const response = await fetch(`${apiBaseUrl}/api/podcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context_type: 'copied_text', text_content: copiedTextRef.current }),
      });
      if (!response.ok) throw new Error("Failed to generate audio.");
      const data = await response.json();

      const fullAudioUrl = `${apiBaseUrl}${data.audio_url}`;
      setAudioUrl(fullAudioUrl);
      toast.dismiss();
      toast.success("Audio ready to play.");

    } catch(err) {
      toast.dismiss();
      toast.error("Could not generate audio.");
    } finally {
      setIsTtsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
  };

  if (!file) return null;
  
  const modalOverlayStyle = { position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
  const modalContentStyle = { backgroundColor: 'white', width: '90%', height: '85%', borderRadius: '8px', position: 'relative' };
  const closeButtonStyle = { position: 'absolute', top: '12px', right: '12px', zIndex: 60, background: '#1e2b3b', color: '#cbd5e1', borderRadius: '9999px', padding: '0px 8px', cursor: 'pointer', border: '1px solid #334155', fontSize: '1.125rem', fontWeight: 'bold' };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 flex flex-col items-center gap-3 bg-slate-800/50 p-2 rounded-full backdrop-blur-sm">
          <button 
            onClick={handleGetInsightClick}
            disabled={isInsightLoading}
            className="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-slate-500"
            title="Get Insight for Copied Text"
          >
            {isInsightLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap size={20} />}
          </button>
          
          <button 
            onClick={handleReadAloudClick}
            disabled={isTtsLoading}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-500"
            title="Read Copied Text Aloud"
          >
            {isTtsLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Mic size={20} />}
          </button>

          {audioUrl && !isTtsLoading && (
             <button 
              onClick={togglePlayPause}
              className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          )}
        </div>
        
        {insightResult && (
          <div className="absolute top-20 left-4 z-10 bg-slate-800 p-4 rounded-lg shadow-lg w-80">
            <h4 className="font-semibold text-blue-400 mb-2">Insight</h4>
            <p className="text-sm text-slate-300">{insightResult}</p>
            <button onClick={() => setInsightResult(null)} className="text-xs text-slate-500 mt-3 w-full text-right">Close</button>
          </div>
        )}

        <button onClick={onClose} style={closeButtonStyle}>✕</button>
        <div id="pdf-viewer-container" ref={viewerRef} style={{ width: '100%', height: '100%' }} />

        <audio 
          ref={audioPlayerRef} 
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default PDFViewer;
