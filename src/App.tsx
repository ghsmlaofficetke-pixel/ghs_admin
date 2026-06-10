import React from 'react';
import AllRoutes from "./routes/Routes";
import "nouislider/distribute/nouislider.css";
import "./assets/scss/app.scss";
import "./assets/scss/icons.scss";
import InstallPWAButton from "./components/InstallPWAButton";
import PWAUpdateBanner from "./components/PWAUpdateBanner";

const App = () => {

  return (
    <>
      <React.Fragment>
        <AllRoutes />
      </React.Fragment>
      <InstallPWAButton />
      <PWAUpdateBanner />
    </>
  );
}

export default App;
