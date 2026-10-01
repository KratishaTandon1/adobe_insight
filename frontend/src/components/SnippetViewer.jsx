



// import React, { useEffect, useState, useRef } from 'react';
// import TextToSpeechPlayer from './TextToSpeechPlayer'; // Import the new player

// const SnippetViewer = ({ snippet, onClose }) => {
//   const viewerRef = useRef(null);
//   const adobeDCView = useRef(null);

//   useEffect(() => {
//     if (!adobeDCView.current) {
//       adobeDCView.current = new window.AdobeDC.View({
//         clientId: "6b69525ba155485c869f6fc1a870d5cd",
//         divId: viewerRef.current.id,
//       });
//     }

//     const viewAndHighlight = async () => {
//       if (snippet?.source_url) {
//         try {
//           const previewFilePromise = await adobeDCView.current.previewFile({
//             content: { location: { url: snippet.source_url } },
//             metaData: { fileName: snippet.source },
//           });
//           const apis = await previewFilePromise.getAPIs();
//           if (snippet.page) await apis.gotoLocation(snippet.page);
//           if (snippet.text) await apis.search(snippet.text, { highlight: { color: "#FFD700" } });
//         } catch (error) {
//           console.error("Adobe Viewer Error:", error);
//         }
//       }
//     };
//     viewAndHighlight();
//   }, [snippet]);

//   if (!snippet) return null;

//   const modalOverlayStyle = { position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
//   const modalContentStyle = { backgroundColor: 'white', width: '90%', height: '85%', borderRadius: '8px', position: 'relative' };
//   const closeButtonStyle = { position: 'absolute', top: '12px', right: '12px', zIndex: 60, background: '#1e2b3b', color: '#cbd5e1', borderRadius: '9999px', padding: '0px 8px', cursor: 'pointer', border: '1px solid #334155', fontSize: '1.125rem', fontWeight: 'bold' };

//   return (
//     <div style={modalOverlayStyle}>
//       <div style={modalContentStyle}>
//         {/* Add the TTS Player to the top-left corner */}
//         <div className="absolute top-2 left-4 z-10 bg-slate-800/50 p-2 rounded-full backdrop-blur-sm">
//           <TextToSpeechPlayer
//             contextType="recommendation_snippet"
//             textToRead={snippet.text}
//           />
//         </div>
//         <button onClick={onClose} style={closeButtonStyle}>✕</button>
//         <div id="snippet-pdf-viewer" ref={viewerRef} style={{ width: '100%', height: '100%' }} />
//       </div>
//     </div>
//   );
// };

// export default SnippetViewer;





import React, { useEffect, useRef } from 'react';
import { ADOBE_API_KEY } from '../adobeApiConfig'; // Import the new config

const SnippetViewer = ({ snippet, onClose }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (snippet?.source_url && viewerRef.current && !viewerRef.current.hasChildNodes()) {
      const viewAndHighlight = async () => {
        try {
          const adobeDCView = new window.AdobeDC.View({
            clientId: ADOBE_API_KEY, // Use the dynamic API key
            divId: viewerRef.current.id,
          });

          const previewFilePromise = adobeDCView.previewFile({
            content: { location: { url: snippet.source_url } },
            metaData: { fileName: snippet.source },
          });

          const adobeViewer = await previewFilePromise;
          const apis = await adobeViewer.getAPIs();

          if (snippet.page) {
            await apis.gotoLocation(snippet.page);
          }

          if (snippet.text) {
            await apis.search(snippet.text, { highlight: { color: "#FFD700" } });
          }

        } catch (error) {
          console.error("Adobe Viewer Error in SnippetViewer:", error);
        }
      };

      viewAndHighlight();
    }
  }, [snippet]);

  if (!snippet) return null;

  const modalOverlayStyle = { position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
  const modalContentStyle = { backgroundColor: 'white', width: '90%', height: '85%', borderRadius: '8px', position: 'relative' };
  const closeButtonStyle = { position: 'absolute', top: '12px', right: '12px', zIndex: 60, background: '#1e2b3b', color: '#cbd5e1', borderRadius: '9999px', padding: '0px 8px', cursor: 'pointer', border: '1px solid #334155', fontSize: '1.125rem', fontWeight: 'bold' };
  
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        {/* The microphone button has been removed */}
        <button onClick={onClose} style={closeButtonStyle}>✕</button>
        <div id="snippet-pdf-viewer" ref={viewerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default SnippetViewer;