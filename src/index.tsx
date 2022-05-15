import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter /* HashRouter uncomment when nedd gh-pages deploy && commented BrowserRouter */ } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./components/App/App";
import { store } from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    {/* <HashRouter> uncomment when nedd gh-pages deploy && commented next line */}
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    {/* </HashRouter> uncomment when nedd gh-pages deploy && commented next line */}
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
