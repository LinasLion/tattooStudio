import React from "react";
import { Routes, Route } from "react-router-dom"; // Ensure you import Routes and Route
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Studio } from "./pages/Studio";
import { Login } from "./pages/Login";
import "./assets/mainCss/main.css";

function App() {
  return (
    <div className="wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/gallery" element={<Home />} />
        <Route path="/minds" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
