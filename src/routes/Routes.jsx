import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home";
import SignUp from "../pages/SignUp/SignUp";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import EmployeeList from "../pages/Dashboard/EmployeeList/EmployeeList";
import Details from "../pages/Dashboard/Details/Details";
import Progress from "../pages/Dashboard/Progress/Progress";
import WorkSheet from "../pages/Dashboard/WorkSheet/WorkSheet";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import AllEmployeeList from "../pages/Dashboard/AllEmployeeList/AllEmployeeList";
import axiosPublic from "../utils/AxiosPublic";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: ([
            {
                path: "/",
                element: <Home />
            },
            {
                path: "signup",
                element: <SignUp />
            },
            {
                path: "login",
                element: <Login />
            }
        ])
    },
    {
        path: "dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        children: ([
            {
                path: "employee-list",
                element: <EmployeeList />
            },
            {
                path: "employee/:id",
                element: <Details />,
                loader: ({params}) => axiosPublic.get(`/users/${params.id}`)
            },
            {
                path: "progress",
                element: <Progress />
            },
            {
                path: "work-sheet",
                element: <WorkSheet />
            },
            {
                path: "payment-history",
                element: <PaymentHistory />
            },
            {
                path: "all-employee-list",
                element: <AllEmployeeList />
            },
        ])
    }
])

export default router;