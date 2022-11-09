import React from 'react';

import {createBrowserRouter} from 'react-router-dom';
import Login from '../pages/login';
import MainPage from '../pages/main';
import DashBoard from '../pages/main/dashboard';
import MapPage from '../pages/main/map';
import UserPage from '../pages/main/user';

// TODO fix bug: change menu select with url change
// TODO change router file's path
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/main',
    // TODO change main element
    element: <MainPage />,
    children: [
      {
        // TODO set dashboard as index page
        path: 'dashboard',
        index: true,
        element: <DashBoard />,
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
    ],
  },
]);
