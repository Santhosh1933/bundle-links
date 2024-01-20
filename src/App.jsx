import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./components/Home/Home";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { GlobalContext } from "./components/GlobalContext.js";
import { PageNotFound } from "./components/PageNotFound.jsx";
import { OutputPage } from "./components/Output/OutputPage.jsx";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";

export default function App() {

  return (
    <div>
      <GlobalContext.Provider >
        <BrowserRouter>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<OutputPage />} path="/*" />
            <Route element={<Dashboard />} path="/Dashboard" />
            <Route element={<PageNotFound />} path="/PageNotFound" />
            <Route element={<Login />} path="/Login" />
            <Route element={<Register />} path="/Register" />

          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  );
}
