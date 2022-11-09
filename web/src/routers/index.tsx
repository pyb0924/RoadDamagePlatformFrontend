import {createBrowserRouter} from 'react-router-dom';
import Login from './login';
import MainPage from './main';
import DashBoard from './main/dashboard';
import MapPage from './main/map';
import UserPage from './main/user';

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
