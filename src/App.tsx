import React from 'react';
import AllRoutes from "./routes/Routes";
import "nouislider/distribute/nouislider.css";
import "./assets/scss/app.scss";
import "./assets/scss/icons.scss";
import InstallPWAButton from "./components/InstallPWAButton";
import PWAUpdateBanner from "./components/PWAUpdateBanner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  return (
    <>
      <React.Fragment>
        <AllRoutes />
      </React.Fragment>
      <InstallPWAButton />
      <PWAUpdateBanner />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
