const API_URL = "https://fitmind-backend.vercel.app/api/fitmind";

async function sendMessage() {
    const input = document.getElementById("user-input");
    let text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    // Placeholder "thinking"
    const thinkingId = addMessage("FitMind razmišlja… ⏳", "bot");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: text }),
        });

        const data = await response.json();

        updateMessage(thinkingId, data.reply || "Greška u odgovoru.");
    } 
    catch (err) {
        updateMessage(thinkingId, "Server error: " + err.message);
    }
}

// Add message visually
function addMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");

    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    return msg; // RETURN element so we can edit it later
}

// Update bot placeholder
function updateMessage(msgElement, newText) {
    msgElement.innerText = newText;
}

// SEND ON ENTER
document.getElementById("user-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
});

// SEND ON BUTTON CLICK
document.getElementById("send-btn").onclick = sendMessage;
