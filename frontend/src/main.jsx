import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import AppBootstrap from "./app/AppBootstrap";
import { store } from "./app/store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppBootstrap>
        <App />
      </AppBootstrap>
    </Provider>
  </React.StrictMode>
);
