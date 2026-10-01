// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { API_BASE_URL } from '../apiConfig';
// const DebateModal = ({ isOpen, onClose, onEvidenceClick }) => {
//   const [debate, setDebate] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const generateDebate = async () => {
//       // Only fetch if the modal is opened and there's no debate yet
//       if (isOpen && !debate && !isLoading) {
//         setIsLoading(true);
//         try {
//           const response = await fetch(`${API_BASE_URL}/api/debate`, {
//             method: "POST",
//           });
//           if (!response.ok) throw new Error("Failed to generate debate.");
          
//           const data = await response.json();
//           const parsedDebate = JSON.parse(data.debate);
          
//           if (parsedDebate.error) throw new Error(parsedDebate.error);

//           setDebate(parsedDebate);
//           toast.success("Debate generated successfully!");
//         } catch (error) {
//           toast.error(error.message || "An error occurred generating the debate.");
//           onClose(); // Close modal on error
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     generateDebate();
//   }, [isOpen, debate, isLoading, onClose]);

//   // Reset state when the modal is closed
//   useEffect(() => {
//     if (!isOpen) {
//       setDebate(null);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-4xl border border-slate-700 flex flex-col h-[80vh]">
//         <div className="flex justify-between items-center mb-4 flex-shrink-0">
//           <h2 className="text-xl font-semibold text-white">AI-Generated Debate</h2>
//           <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
//         </div>

//         {isLoading ? (
//           <div className="flex-grow flex items-center justify-center">
//             <p className="text-slate-400">Finding a topic and building arguments...</p>
//           </div>
//         ) : debate && (
//           <div className="flex-grow overflow-y-auto pr-2">
//             <h3 className="text-center text-lg font-bold text-blue-400 mb-6">{debate.topic}</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Argument FOR */}
//               <div className="bg-slate-900/50 p-4 rounded-lg">
//                 <h4 className="font-semibold text-green-400 mb-3 text-center">The Argument FOR</h4>
//                 <div className="space-y-4">
//                   {debate.argument_for.map((arg, index) => (
//                     <div key={index}>
//                       <p className="text-slate-300">{arg.point}</p>
//                       <p 
//                         onClick={() => onEvidenceClick({ text: arg.evidence, source: 'Multiple sources' })}
//                         className="text-xs text-slate-500 mt-1 pl-2 border-l-2 border-green-500 italic cursor-pointer hover:text-slate-300"
//                       >
//                         "{arg.evidence}"
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Argument AGAINST */}
//               <div className="bg-slate-900/50 p-4 rounded-lg">
//                 <h4 className="font-semibold text-red-400 mb-3 text-center">The Argument AGAINST</h4>
//                 <div className="space-y-4">
//                   {debate.argument_against.map((arg, index) => (
//                     <div key={index}>
//                       <p className="text-slate-300">{arg.point}</p>
//                       <p 
//                         onClick={() => onEvidenceClick({ text: arg.evidence, source: 'Multiple sources' })}
//                         className="text-xs text-slate-500 mt-1 pl-2 border-l-2 border-red-500 italic cursor-pointer hover:text-slate-300"
//                       >
//                         "{arg.evidence}"
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DebateModal;






import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

const DebateModal = ({ isOpen, onClose }) => { // The 'onEvidenceClick' prop is removed
  const [debate, setDebate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateDebate = async () => {
      if (isOpen && !debate && !isLoading) {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/debate`, {
            method: "POST",
          });
          if (!response.ok) throw new Error("Failed to generate debate.");
          
          const data = await response.json();
          const parsedDebate = JSON.parse(data.debate);
          
          if (parsedDebate.error) throw new Error(parsedDebate.error);

          setDebate(parsedDebate);
          toast.success("Debate generated successfully!");
        } catch (error) {
          toast.error(error.message || "An error occurred generating the debate.");
          onClose();
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateDebate();
  }, [isOpen, debate, isLoading, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setDebate(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-4xl border border-slate-700 flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">AI-Generated Debate</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>

        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-slate-400">Finding a topic and building arguments...</p>
          </div>
        ) : debate && (
          <div className="flex-grow overflow-y-auto pr-2">
            <h3 className="text-center text-lg font-bold text-blue-400 mb-6">{debate.topic}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Argument FOR */}
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-3 text-center">The Argument FOR</h4>
                <div className="space-y-4">
                  {debate.argument_for.map((arg, index) => (
                    <div key={index}>
                      <p className="text-slate-300">{arg.point}</p>
                      {/* This is no longer clickable */}
                      <p className="text-xs text-slate-500 mt-1 pl-2 border-l-2 border-green-500 italic">
                        "{arg.evidence}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Argument AGAINST */}
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-3 text-center">The Argument AGAINST</h4>
                <div className="space-y-4">
                  {debate.argument_against.map((arg, index) => (
                    <div key={index}>
                      <p className="text-slate-300">{arg.point}</p>
                      {/* This is no longer clickable */}
                      <p className="text-xs text-slate-500 mt-1 pl-2 border-l-2 border-red-500 italic">
                        "{arg.evidence}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateModal;