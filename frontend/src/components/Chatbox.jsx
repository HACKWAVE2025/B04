import { useState, useEffect, useRef } from "react";
import { MessageCircleMore, X, Send, Mic, MicOff, Plus } from "lucide-react";
import { DigikarshakanAPIs } from "../utils/DigiKarshakanAPIs";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // New: Hold File object
  const [imagePreview, setImagePreview] = useState(null); // New: For display
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResponseComplete, setIsResponseComplete] = useState(true);
  const [botTypingMessage, setBotTypingMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setQuestion("");
    setSelectedImage(null);
    setImagePreview(null);
    setMessages([]);
    setLoading(false);
    setIsResponseComplete(true);
  };

  const displayTypingAnimation = (text) => {
    const words = text.split(" ");
    let currentMessage = "";
    words.forEach((word, index) => {
      setTimeout(() => {
        currentMessage += `${word} `;
        setBotTypingMessage(currentMessage.trim());
        if (index === words.length - 1) {
          setIsResponseComplete(true);
          setMessages((prev) => [...prev, { type: "bot", text: currentMessage.trim() }]);
          setBotTypingMessage("");
        }
      }, index * 200);
    });
  };

  // Updated: Handles text +/- image
  const sendQuestion = async () => {
    if (!question.trim() && !selectedImage) return;
    if (!isResponseComplete) return;

    const userText = question.trim() || "Analyze this image."; // Default if no text
    const userMessage = { 
      type: "user", 
      text: userText,
      preview: imagePreview 
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setIsResponseComplete(false);

    try {
      let answer;
      if (selectedImage) {
        // Send to chatbot with image
        answer = await DigikarshakanAPIs.chatBotWithImage(userText, selectedImage);
      } else {
        // Fallback to text-only
        answer = await DigikarshakanAPIs.chatBot(userText);
      }
      displayTypingAnimation((answer && answer.trim()) || "Sorry, I didn't understand that.");
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { type: "bot", text: "An error occurred. Please try again later." }]);
      setIsResponseComplete(true);
    } finally {
      setLoading(false);
      // Clear image after send
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendQuestion();
    }
  };

  // ----- Voice Recognition -----
  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setQuestion((prev) => (prev ? prev + " " + transcript : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  };

  // ----- Image Selection (for chatbot integration) -----
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      setMessages((prev) => [...prev, { type: "bot", text: "Please upload an image file only." }]);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessages((prev) => [...prev, { type: "bot", text: "Image too large. Please upload under 5MB." }]);
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Optional: Auto-send if no text, or just prepare
    // sendQuestion(); // Uncomment for auto-send on upload
    e.target.value = null; // Reset input
  };

  // Cleanup preview on unmount/change
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (isResponseComplete && inputRef.current) inputRef.current.focus();
  }, [isResponseComplete]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, botTypingMessage]);

  return (
    <div>
      <div
        className={`fixed bottom-5 right-5 p-2 lg:p-3 bg-gradient-to-r from-[#6bc83f] to-[#2d511c] rounded-full cursor-pointer hover:from-[#2d511c] hover:to-[#6bc83f] transition-colors duration-300 z-50 ${
          isOpen ? "hidden" : "block"
        }`}
        onClick={toggleChatbot}
      >
        <MessageCircleMore color="white" size={32} />
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={toggleChatbot}>
          <div
            className="bg-neutral-200 dark:bg-neutral-900 opacity-90 rounded-lg shadow-lg w-full sm:w-[80vw] md:w-[60vw] lg:w-[60vh] lg:h-[100vh] max-h-[89vh] m-4 lg:fixed lg:bottom-0 lg:right-0 lg:transform-none flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-neutral-700 p-4">
              <h1 className="text-md font-semibold hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-[#6bc83f] to-[#2d511c]">
                Digi-Karshakan's Chatbot
              </h1>
              <X size={24} className="cursor-pointer" onClick={toggleChatbot} />
            </div>

            <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
              <div className="mb-2 text-sm text-left">
                Hello User! I'm here to assist you with your queries. Feel free to ask me anything related to{" "}
                <span className="text-custom-green">Agriculture.</span> (Upload images for analysis!)
              </div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 text-sm ${message.type === "user" ? "text-right text-custom-green" : "text-left"}`}
                >
                  {message.text}
                  {message.preview && (
                    <img src={message.preview} alt="Uploaded" className="max-w-xs mt-2 rounded" />
                  )}
                </div>
              ))}
              {botTypingMessage && (
                <div className="text-left text-sm mb-4 animate-pulse">{botTypingMessage}</div>
              )}
              {loading && !botTypingMessage && (
                <div className="text-left text-sm text-custom-green mb-4 animate-pulse">Processing...</div>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-neutral-700 flex flex-col gap-2">
              {/* Selected Image Preview & Clear */}
              {imagePreview && (
                <div className="flex items-center gap-2">
                  <img src={imagePreview} alt="Preview" className="h-16 rounded" />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-red-500 text-sm"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 relative">
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 rounded-full bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400"
                  title="Upload image to chatbot"
                >
                  <Plus size={20} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {/* Mic */}
                <div className="relative">
                  {isListening && (
                    <span className="absolute inset-0 rounded-full bg-green-500 opacity-50 animate-ping" style={{ zIndex: -1 }} />
                  )}
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-full transition-colors ${
                      isListening ? "bg-green-500 text-white" : "bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400"
                    }`}
                    title="Voice input"
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                </div>

                {/* Text Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    className="w-full p-2 pr-10 rounded bg-neutral-300 dark:bg-neutral-800 placeholder:text-neutral-500 focus:outline-none"
                    placeholder="Ask about agriculture or describe your image..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!isResponseComplete}
                    ref={inputRef}
                  />
                  <Send
                    size={20}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-neutral-500 cursor-pointer hover:text-neutral-700"
                    onClick={sendQuestion}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;