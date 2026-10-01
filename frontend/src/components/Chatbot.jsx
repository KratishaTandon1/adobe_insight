// import React, { useState } from 'react';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([
//     { text: "Hello! Ask me anything about your documents.", sender: 'bot' }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { text: input, sender: 'user' };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:8000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: input }), // For now, it will search all docs
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok.");
//       }

//       const data = await response.json();
//       const botMessage = { text: data.answer, sender: 'bot' };
//       setMessages(prev => [...prev, botMessage]);

//     } catch (error) {
//       console.error("Chat error:", error);
//       const errorMessage = { text: "Sorry, I ran into an error. Please try again.", sender: 'bot' };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md mt-6 h-[500px] flex flex-col">
//       <h2 className="text-lg font-semibold mb-4 border-b pb-2">Chat with your Docs</h2>
      
//       {/* Message Display Area */}
//       <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
//               {msg.text}
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="p-3 rounded-lg bg-gray-200 text-gray-500">
//               Thinking...
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="flex border-t pt-4">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//           placeholder="Ask a question..."
//           className="flex-grow border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleSend}
//           disabled={isLoading}
//           className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;



//--------------------------------------------------------------------

import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything about your documents.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      if (!response.ok) throw new Error("Network response was not ok.");
      const data = await response.json();
      const botMessage = { text: data.answer, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: "Sorry, I ran into an error.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window - height and bottom position are adjusted */}
      <div className={`fixed bottom-24 right-6 sm:right-8 w-80 sm:w-96 h-[calc(100vh-8rem)] max-h-[500px] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col transition-all duration-300 z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="flex justify-between items-center p-3 border-b border-slate-700 flex-shrink-0">
          <h2 className="font-semibold flex items-center"><Bot className="mr-2 text-blue-400" /> Chat with Docs</h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-grow p-3 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="p-3 rounded-lg bg-slate-700 text-slate-400 text-sm">Thinking...</div>}
        </div>
        <div className="p-3 border-t border-slate-700 flex items-center flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-grow bg-slate-700 border border-slate-600 rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 disabled:bg-blue-400">
            <Send size={20} />
          </button>
        </div>
      </div>
      
      {/* Floating Button */}
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 sm:right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 z-50">
        <Bot />
      </button>
    </>
  );
};

export default Chatbot;