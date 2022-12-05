import React from 'react';

import {createBrowserRouter} from 'react-router-dom';
import Login from '../pages/login';
import MainPage from '../pages/main';
import DashBoard from '../pages/main/dashboard';
import MapPage from '../pages/main/map';
import EventPage from '../pages/main/event';
import EventDetailPage from '../pages/main/eventDetail';
import UserPage from '../pages/main/user';

// TODO fix bug: change menu select when directly changing url
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/main',
    element: <MainPage />,
    children: [
      {
        path: 'dashboard',
        element: <DashBoard />,
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'event',
        element: <EventPage />,
      },
      {
        path: 'event/:id',
        element: <EventDetailPage />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
    ],
  },
]);
