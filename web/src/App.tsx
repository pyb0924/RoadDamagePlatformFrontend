import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./routers/login";
import DashBoard from "./routers/dashboard";

import "./App.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
