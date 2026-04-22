import React from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { registerSW } from 'virtual:pwa-register'

import App from './App.js'
import { store } from "./redux/store.js";

// ✅ Register Service Worker (PWA)
registerSW({
  immediate: true,
});

const container = document.getElementById('konrix');

if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter basename={import.meta.env.PUBLIC_URL}>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  )
}
