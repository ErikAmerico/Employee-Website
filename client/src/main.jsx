import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";

import Announcements from "./pages/announcements.jsx";
import Chat from "./pages/chat/chat.jsx";
import Home from "./pages/home.jsx";
import LoginRegister from "./pages/loginRegister.jsx";
import Users from "./pages/users/users.jsx";
import Profile from "./pages/profile/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1 className="display-2">Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/announcements",
        element: <Announcements />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/loginRegister",
        element: <LoginRegister />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
