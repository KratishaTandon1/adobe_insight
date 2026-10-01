


// import { useState } from "react";
// import axios from "axios";

// const PDFUpload = ({ fetchPdfList }) => {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleUpload = async () => {
//     const formData = new FormData();
//     for (let i = 0; i < selectedFiles.length; i++) {
//       formData.append("files", selectedFiles[i]);
//     }

//     try {
//       setUploading(true);
//       setMessage(""); // Clear previous messages
//       await axios.post(`http://localhost:8080/api/pdf/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("Upload successful!");
//       // This is now in App.jsx, but if you pass onUpload, it would be called here.
//       // fetchPdfList?.(); 
//     } catch (error) {
//       console.error("Upload failed:", error);
      
//       // --- NEW ERROR HANDLING LOGIC ---
//       if (error.response && error.response.status === 409) {
//         // If we get a 409 Conflict error, show a specific message
//         setMessage(`Upload failed: ${error.response.data.detail}`);
//       } else {
//         // For all other errors, show a generic message
//         setMessage("Upload failed. Please check the server connection.");
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

  

//   return (
//     <div className="my-4">
//       <input
//         type="file"
//         accept="application/pdf"
//         multiple
//         onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
//         // Clear the message when new files are selected
//         onClick={() => setMessage("")}
//       />
//       <button
//         onClick={handleUpload}
//         disabled={uploading || selectedFiles.length === 0}
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//       >
//         {uploading ? "Uploading..." : "Upload PDF(s)"}
//       </button>
//       {message && <p className="mt-2">{message}</p>}
//     </div>
//   );
// };

// export default PDFUpload;









import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const PDFUpload = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      setUploading(true);
      setMessage("");
      await axios.post(`${API_BASE_URL}/api/pdf/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Upload successful!");
      if (onUpload) onUpload();
    } catch (error) {
      console.error("Upload failed:", error);
      if (error.response && error.response.status === 409) {
        setMessage(`Upload failed: ${error.response.data.detail}`);
      } else {
        setMessage("Upload failed. Please check the server connection.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-4">
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
        onClick={() => setMessage("")}
      />
      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        {uploading ? "Uploading..." : "Upload PDF(s)"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default PDFUpload;
