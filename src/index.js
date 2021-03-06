import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap-utilities.min.css";
import "./css/bootstrap-chunks.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import App from "./web";
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
