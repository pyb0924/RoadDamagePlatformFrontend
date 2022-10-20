import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./routers/login";
import DashBoard from "./routers/dashboard";

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //   </header>

    //   <div className="App-main">
        <DashBoard />
    //   </div>
    // </div>
  );
}

export default App;
