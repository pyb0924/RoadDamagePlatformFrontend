import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./routers/login/index";
import AppLayOut from "./routers/main";
import DashBoard from "./routers/main/dashboard/dashboard";
import Map from "./routers/main/map/map";
import UserList from "./components/userList";

import "./App.css";

// TODO change router file's path
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/main",
    // TODO change main element
    element: <AppLayOut />,
    children: [
      {
        // TODO set dashboard as index page
        path: "dashboard",
        index: true,
        element: <DashBoard />,
      },
      {
        path: "map",
        element: <Map />,
      },
      {
        path: "user",
        element: <UserList />,
      },
    ],
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
