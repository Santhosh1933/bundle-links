import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "rgb(243 244 246)", // Set your desired background color
      },
    },
  },
});




ReactDOM.createRoot(document.getElementById("root")).render(
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
);
