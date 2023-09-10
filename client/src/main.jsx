import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";

import Home from "./pages/home.jsx";
import Chat from "./pages/chat.jsx";
import Announcements from "./pages/announcements.jsx";
import Users from "./pages/users.jsx";
import LoginRegister from "./pages/loginRegister.jsx";

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
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
