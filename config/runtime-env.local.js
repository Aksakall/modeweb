if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
  window.__SILA_ENV__ = {
    VITE_API_BASE_URL: "http://localhost:4000",
    VITE_APP_ENV: "development",
    VITE_WHATSAPP_PHONE: "905xxxxxxxxx"
  };
}
