

// import React from "react";

// const PdfList = ({ pdfs = [], onView, onDelete, refreshList }) => {
//   // safe fallback: ensure pdfs is an array
//   const list = Array.isArray(pdfs) ? pdfs : [];

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-2">Uploaded PDFs</h2>

//       {list.length === 0 ? (
//         <p className="text-gray-500">No PDFs uploaded yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {/* THE CHANGE IS HERE: We now map over 'file' objects */}
//           {pdfs.map((file) => (
//             <li key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded shadow-sm">
//               <div className="font-medium truncate max-w-xs">
//                 {/* We display file.filename instead of just the item itself */}
//                 {file.filename}
//               </div>

//               <div className="flex items-center gap-2">
//                 {/* The onView and onDelete functions still work with file.filename */}
//                 <button
//                   onClick={() => onView(file)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
//                 >
//                   View
//                 </button>

//                 <button
//                   onClick={() => {
//                     if (!window.confirm(`Are you sure you want to delete ${file.filename}?`)) return;
//                     onDelete(file.filename);
//                   }}
//                   className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default PdfList;

//--------------------------------------------------------------
import React, { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const PdfList = ({ pdfs = [], onView, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      onDelete(fileToDelete.filename);
    }
    setIsModalOpen(false);
    setFileToDelete(null);
  };

  return (
    <>
      <div className="mt-4 flex-grow overflow-y-auto pr-2 h-0">
        {pdfs.length === 0 ? (
          <p className="text-slate-500 text-sm">No PDFs have been uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {pdfs.map((file) => (
              <div key={file.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                <p className="text-slate-300 text-sm break-all">{file.filename}</p>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onView(file)}
                    className="text-slate-400 hover:text-blue-400 group relative"
                  >
                    <Eye size={18} />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      View
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteClick(file)}
                    className="text-slate-400 hover:text-red-400 group relative"
                  >
                    <Trash2 size={18} />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete File"
        message={`Are you sure you want to permanently delete "${fileToDelete?.filename}"?`}
      />
    </>
  );
};

export default PdfList;