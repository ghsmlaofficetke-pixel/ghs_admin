import React from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { registerSW } from 'virtual:pwa-register'

import App from './App.js'
import { store } from "./redux/store.js";

// ✅ Register Service Worker with Update Notification
// intervalMS: every 60 minutes check for new version (user ಗೆ update ಗೊತ್ತಾಗುತ್ತದೆ)
const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: { updateSW }
    }));
  },
  onOfflineReady() {
    // App offline ಆಗುತ್ತದೆ ಎಂದು ಗೊತ್ತಾಗಿದೆ
  },
  immediate: true,
});

// ✅ Periodic update check — every 30 minutes
// Page reload ಇಲ್ಲದೆಯೂ user ಗೆ new version ಗೊತ್ತಾಗುತ್ತದೆ
setInterval(() => {
  updateSW();
}, 30 * 60 * 1000);

const container = document.getElementById('konrix');

if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  )
}
