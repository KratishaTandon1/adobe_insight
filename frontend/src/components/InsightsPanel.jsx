
// //-------------------------------------------------------------------------------


// import React, { useState } from "react";
// import PodcastPlayer from './PodcastPlayer';
// import { Zap } from 'lucide-react';

// const InsightsPanel = ({ onNewInsights }) => {
//   const [insights, setInsights] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchInsights = () => {
//     setIsLoading(true);
//     setError(null);
//     setInsights(null);
//     onNewInsights(null);

//     fetch("http://localhost:8000/api/insights", { method: "POST" })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch insights.");
//         return res.json();
//       })
//       .then((data) => {
//         const parsedInsights = JSON.parse(data.insights);
//         setInsights(parsedInsights);
//         onNewInsights(parsedInsights);
//       })
//       .catch((err) => setError("Could not load or parse insights."))
//       .finally(() => setIsLoading(false));
//   };

//   return (
//     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex flex-col">
//       <div className="flex-shrink-0 flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold flex items-center"><Zap className="mr-2 text-blue-400" /> Insights Bulb</h2>
//         <button
//           onClick={fetchInsights}
//           disabled={isLoading}
//           className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
//         >
//           {isLoading ? "Generating..." : "Get Insights"}
//         </button>
//       </div>
      
//       {error && <p className="text-red-500 text-sm">{error}</p>}
      
//       <div className="flex-grow overflow-y-auto pr-2 h-0">
//         {insights && (
//           <div className="space-y-4 animate-fade-in">
//             <div>
//               <h3 className="text-md font-semibold text-blue-300 mb-1">Key Insights</h3>
//               <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md text-sm">{insights.key_insights}</p>
//             </div>
//             <div>
//               <h3 className="text-md font-semibold text-blue-300 mb-1">Did You Know?</h3>
//               <ul className="list-disc list-inside bg-slate-900/50 p-3 rounded-md space-y-1 text-sm">
//                 {insights.did_you_know.map((fact, index) => (
//                   <li key={index} className="text-slate-300">{fact}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-md font-semibold text-blue-300 mb-1">Clarifications</h3>
//               <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md text-sm">{insights.clarifications}</p>
//             </div>
//             <div className="border-t border-slate-700 mt-4 pt-4">
//               <PodcastPlayer insights={insights} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InsightsPanel;


//---------------------------------------------------------------------


import React, { useState } from "react";
import PodcastPlayer from './PodcastPlayer';
import { Zap } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
const InsightsPanel = () => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = () => {
    setIsLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/insights`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch insights.");
        return res.json();
      })
      .then((data) => {
        setInsights(JSON.parse(data.insights));
      })
      .catch((err) => setError("Could not load or parse insights."))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex flex-col">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 text-blue-400" /> Insights Bulb
          </h2>
          <PodcastPlayer
            contextType="insights"
            contextText={insights ? `Key Insights: ${insights.key_insights}. Did you know?: ${insights.did_you_know.join(' ')}` : ""}
            disabled={!insights}
          />
        </div>
        <button
          onClick={fetchInsights}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
        >
          {isLoading ? "Generating..." : "Get Insights"}
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2 h-0">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {insights && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-md font-semibold text-blue-300 mb-1">Key Insights</h3>
              <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md text-sm">{insights.key_insights}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-blue-300 mb-1">Did You Know?</h3>
              <ul className="list-disc list-inside bg-slate-900/50 p-3 rounded-md space-y-1 text-sm">
                {insights.did_you_know.map((fact, index) => (
                  <li key={index} className="text-slate-300">{fact}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold text-blue-300 mb-1">Clarifications</h3>
              <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md text-sm">{insights.clarifications}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;