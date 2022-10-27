import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./routers/login/index";
import DashBoard from "./routers/dashboard/index";
import UserList from "./components/userList";
import Map from "./routers/dashboard/map";

import "./App.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/main",
    element: <DashBoard />,
    children: [
      {
        path: "dashboard",
        element: <UserList />,
      },
      {
        path: "map",
        element: <Map />,
      },
      {
        path: "userlist",
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
