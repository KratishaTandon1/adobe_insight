
// //-------------------------------------------------------------------------------------
// import React, { useState } from "react";
// import PodcastPlayer from './PodcastPlayer';
// import { BarChart2, BookOpen } from 'lucide-react';

// const RecommendationPanel = ({ onSnippetClick, onNewRecommendations }) => {
//   const [persona, setPersona] = useState("");
//   const [task, setTask] = useState("");
//   const [recommendations, setRecommendations] = useState([]);
//   const [loadingRecs, setLoadingRecs] = useState(false);

//   const getRecommendations = () => {
//     if (!persona.trim() || !task.trim()) {
//       alert("Please enter both persona and task.");
//       return;
//     }
//     setLoadingRecs(true);
//     setRecommendations([]);
//     onNewRecommendations([]);

//     fetch("http://localhost:8000/api/recommend/related", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ persona, task }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const newRecs = data.recommendations || [];
//         setRecommendations(newRecs);
//         onNewRecommendations(newRecs);
//       })
//       .catch((err) => console.error("Error fetching recommendations:", err))
//       .finally(() => setLoadingRecs(false));
//   };

//   return (
//     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex flex-col">
//       <div className="flex-shrink-0">
//         <h2 className="text-lg font-semibold mb-4 flex items-center"><BarChart2 className="mr-2 text-blue-400" /> Recommendations</h2>
//         <div className="space-y-3 mb-4">
//           <input
//             type="text"
//             placeholder="Persona (e.g., Marketing Manager)"
//             value={persona}
//             onChange={(e) => setPersona(e.target.value)}
//             className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="text"
//             placeholder="Task (e.g., Find campaign insights)"
//             value={task}
//             onChange={(e) => setTask(e.target.value)}
//             className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           onClick={getRecommendations}
//           disabled={loadingRecs}
//           className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
//         >
//           {loadingRecs ? "Searching..." : "Get Recommendations"}
//         </button>
//       </div>
      
//       <div className="mt-6 flex-grow overflow-y-auto pr-2 h-0">
//         {recommendations.length > 0 && (
//           <div className="space-y-3">
//             {recommendations.map((rec, idx) => (
//               <div
//                 key={idx}
//                 className="p-3 border border-slate-700 bg-slate-900/50 rounded-lg transition-all duration-300 animate-fade-in"
//                 style={{ animationDelay: `${idx * 100}ms` }}
//               >
//                 <p className="text-slate-300 text-sm line-clamp-2">
//                   {rec.text || "View snippet"}
//                 </p>
//                 <div className="flex justify-between items-center mt-3">
//                   <p className="text-xs text-slate-500">
//                     Page: {rec.page || "N/A"} | File: {rec.source}
//                   </p>
//                   <button 
//                     onClick={() => onSnippetClick(rec)}
//                     className="flex items-center text-xs text-blue-400 hover:text-blue-300 bg-blue-900/50 hover:bg-blue-900/80 px-2 py-1 rounded transition-colors"
//                   >
//                     <BookOpen size={14} className="mr-1.5" />
//                     View in PDF
//                   </button>
//                 </div>
//               </div>
//             ))}
//             <div className="border-t border-slate-700 mt-4 pt-4">
//               <PodcastPlayer recommendations={recommendations} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecommendationPanel;





//----------------------------------------------------------------
import React, { useState } from "react";
import PodcastPlayer from './PodcastPlayer';
import { BarChart2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';
const RecommendationPanel = ({ onSnippetClick }) => {
  const [persona, setPersona] = useState("");
  const [task, setTask] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const getRecommendations = () => {
    if (!persona.trim() || !task.trim()) {
      toast.error("Please enter both a Persona and a Task.");
      return;
    }
    setLoadingRecs(true);
    fetch(`${API_BASE_URL}/api/recommend/related`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona, task }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations || []);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        toast.error("Failed to get recommendations.");
      })
      .finally(() => {
        setLoadingRecs(false);
      });
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex flex-col">
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <BarChart2 className="mr-2 text-blue-400" /> Recommendations
          </h2>
          <PodcastPlayer
            contextType="recommendations"
            contextText={recommendations.map(r => r.text).join('\n')}
            disabled={recommendations.length === 0}
          />
        </div>
        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="Persona (e.g., Travel Planner)"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Task (e.g., Plan a 5 day trip)"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={getRecommendations}
          disabled={loadingRecs}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {loadingRecs ? "Searching..." : "Get Recommendations"}
        </button>
      </div>
      
      <div className="mt-6 flex-grow overflow-y-auto pr-2 h-0">
        {recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-3 border border-slate-700 bg-slate-900/50 rounded-lg animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <p className="text-slate-300 text-sm line-clamp-2">{rec.text || "View snippet"}</p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-slate-500">Page: {rec.page || "N/A"} | File: {rec.source}</p>
                  <button onClick={() => onSnippetClick(rec)} className="flex items-center text-xs text-blue-400 hover:text-blue-300 bg-blue-900/50 hover:bg-blue-900/80 px-2 py-1 rounded transition-colors">
                    <BookOpen size={14} className="mr-1.5" />
                    View in PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPanel;