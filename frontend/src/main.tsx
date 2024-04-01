import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";

import './index.css'

import Questions from "@/modules/Questions.tsx";
import Question from "@/modules/Question.tsx";
import Users from "@/modules/Users.tsx";
import Answers from "@/modules/Answers.tsx";
import Answer from "@/modules/Answer.tsx";
import UserStoreProvider from "@/components/UserStoreProvider.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Questions/>,
    },
    {
        path: "/questions/:id",
        element: <Question/>,
    },
    {
        path: "/questions/:question_id/answers/:answer_id",
        element: <Answer/>,
    },
    {
        path: "/users/:user_id/answers",
        element: <Answers/>,
    },
    {
        path: "/users",
        element: <Users/>,
    },
    {
        path: "*",
        element: <Navigate to={'/'} replace/>
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <UserStoreProvider>
            <RouterProvider router={router}/>
        </UserStoreProvider>
    </React.StrictMode>,
)
