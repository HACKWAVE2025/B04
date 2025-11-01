import React, { useState } from "react";
import { Phone } from "lucide-react";
import { notifySuccess } from "../Utils/Toasts";

const CallButton = () => {
    const [loading, setLoading] = useState(false);
    const handleCall = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://kimora-recent-eternally.ngrok-free.dev/call/%2B916302211766", {
                method: "GET",
            });

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            notifySuccess("Call request sent successfully!");
            //   alert("📞 Call request sent successfully!");
        } catch (error) {
            console.error("Error calling API:", error);
            // notifySuccess("Call request sent successfully!");
            //   alert("❌ Failed to make call. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-24 z-50 ">
            <button
                onClick={handleCall}
                disabled={loading}
                className={`p-3 lg:p-4 rounded-full cursor-pointer transition-all duration-300 shadow-lg 
          bg-gradient-to-r from-[#6bc83f] to-[#2d511c]
          hover:from-[#2d511c] hover:to-[#6bc83f]
          ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
                <Phone
                    color="white"
                    size={28}
                    className={`transition-transform duration-300 ${loading ? "animate-pulse" : "hover:scale-110"
                        }`}
                />
            </button>
        </div>
    );
};

export default CallButton;
