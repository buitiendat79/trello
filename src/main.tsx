import React from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { Layout } from "./components/Layout";
import { Router } from "./router/Router";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
        <Layout>
          <Router />
        </Layout>
  </React.StrictMode>
);