import React from "react";
import {Routes, Route} from "react-router-dom";
import {Header} from "./components/Header";
import {Gallery} from "./pages/Gallery";
import {Studio} from "./pages/Studio";
import {Login} from "./pages/Login";
import "./assets/mainCss/main.css";
import {Posts} from "./pages/Posts.jsx";
import {Home} from "./pages/Home.jsx";
import {AuthProvider} from "./contexts/authContext.jsx";

function App() {
    return (
        <div className="wrapper">
            <AuthProvider>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/studio" element={<Studio/>}/>
                    <Route path="/gallery" element={<Gallery/>}/>
                    <Route path="/posts" element={<Posts/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </AuthProvider>
        </div>
    );
}

export default App;
