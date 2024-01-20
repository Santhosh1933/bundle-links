import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./components/Home/Home";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { GlobalContext } from "./components/GlobalContext.js";
import { PageNotFound } from "./components/PageNotFound.jsx";
import { OutputPage } from "./components/Output/OutputPage.jsx";

export default function App() {
  const [LoginAuth, setLoginAuth] = useState("login failed");

  useEffect(() => {
    const { login } = JSON.parse(localStorage.getItem("login"));
    if (!login) {
      setLoginAuth(JSON.parse(localStorage.getItem("login")));
    }
  }, [localStorage]);

  return (
    <div>
      <GlobalContext.Provider value={{ LoginAuth }}>
        <BrowserRouter>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<OutputPage />} path="/*" />
            <Route element={<Dashboard />} path="/Dashboard" />
            <Route element={<PageNotFound />} path="/PageNotFound" />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  );
}
