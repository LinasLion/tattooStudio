import React from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Studio } from "./pages/Studio";
import { Login } from "./pages/Login";
import "./assets/mainCss/main.css";
import {Posts} from "./pages/Posts.jsx";

function App() {
  return (
    <div className="wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/gallery" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
