import { createBrowserRouter } from "react-router-dom";
import Login from "./login";
import AppLayOut from "./main";
import DashBoard from "./main/dashboard";
import MapPage from "./main/mapPage";
import UserPage from "./main/userPage";

// TODO change router file's path
export const router = createBrowserRouter([
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
        element: <MapPage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
    ],
  },
]);
