// ⭐ SET YOUR BACKEND URL HERE
// Example: "https://abcd.ngrok-free.dev/api/analyze"
const API_URL = "https://unthawing-profanely-ula.ngrok-free.dev/api/analyze";

// DOM elements
const messages = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const typingMsg = document.getElementById("typing");

// Modes
let currentMode = "general";

// Mode buttons
const generalBtn = document.getElementById("generalBtn");
const riskBtn = document.getElementById("riskBtn");

// Switch modes
generalBtn.onclick = () => {
    currentMode = "general";
    generalBtn.classList.add("active");
    riskBtn.classList.remove("active");
    input.placeholder = "Type your finance question here...";
};

riskBtn.onclick = () => {
    currentMode = "risk";
    riskBtn.classList.add("active");
    generalBtn.classList.remove("active");
    input.placeholder = "Paste company/SEC text here for risk analysis...";
};

// Add a chat bubble
function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.textContent = text;
    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;
}

// SEND MESSAGE
async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    // User bubble
    addMessage("user", userText);

    input.value = "";

    // Show typing indicator
    typingMsg.textContent = "Thinking...";
    typingMsg.style.display = "block";

    // Build payload
    const payload = {
        question: currentMode === "general" ? userText : "",
        company_text: currentMode === "risk" ? userText : ""
    };

    try {
        const resp = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();

        // Hide typing
        typingMsg.textContent = "";
        typingMsg.style.display = "none";

        // Assistant response
        addMessage("assistant", data.answer);

    } catch (err) {
        typingMsg.textContent = "";
        typingMsg.style.display = "none";

        addMessage("assistant", "❌ Request failed. Please try again.");
        console.log("Error:", err);
    }
}

sendBtn.onclick = sendMessage;
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// DOWNLOAD CHAT AS TEXT FILE

function downloadChat() {
    let text = "";
    const allMessages = messages.querySelectorAll(".msg");

    allMessages.forEach(msg => {
        const role = msg.classList.contains("user") ? "USER" : "ASSISTANT";
        text += `${role}: ${msg.textContent}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "InvestLM_Chat.txt";
    a.click();

    URL.revokeObjectURL(url);
}

// Hook button to function
document.getElementById("downloadBtn").onclick = downloadChat;

