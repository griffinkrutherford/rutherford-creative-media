// /chat-widget.js — tiny helper for the site chat form
(function () {
  async function askRCM(message) {
    const res = await fetch("/api/rcm-chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || data?.error || "Chat error");
    return data.reply;
  }

  const form = document.getElementById("rcm-chat-form");
  const input = document.getElementById("rcm-chat-input");
  const out = document.getElementById("rcm-chat-output");

  if (form && input && out) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = input.value.trim();
      if (!msg) return;
      out.textContent = "…thinking";
      try {
        out.textContent = await askRCM(msg);
      } catch (err) {
        out.textContent = "Sorry—chat is unavailable.";
        console.error(err);
      }
      input.value = "";
    });
  }
})();
