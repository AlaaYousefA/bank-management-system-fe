import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Authentication from "./main/authentication/components/Authentication";
import SignUp from "./main/registration/components/SignUp";
import Dashboard from "./main/dashboard/components/Dashboard";
import CardPage from "./main/card/components/CardPage";
import TransactionPage from "./main/transaction/components/TransactionPage";
import authenticationService from "./main/authentication/services/AuthenticationService";
import ResetPassword from "./main/reset/component/ResetPassword";
import Account from "./main/account/components/Account";

const authGuard = async () => {
  if (!(await authenticationService.isLoggedIn())) {
    return redirect("/login");
  }
  return null;
};

const loginGuard = async () => {
  if (await authenticationService.isLoggedIn()) {
    return redirect("/");
  }
  return null;
};

const route = createBrowserRouter([
  {
    path: "/login",
    element: <Authentication />,
    loader: loginGuard,
  },
  {
    path: "/signup",
    element: <SignUp />,
    loader: loginGuard,
  },
  {
    path: "/ResetPassword",
    element: <ResetPassword />,
    loader: loginGuard,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: authGuard,
  },
  {
    path: "/",
    element: <Dashboard />,
    loader: authGuard,
  },
  {
    path: "/account",
    element: <Account />,
    loader: authGuard,
  },
  {
    path: "/cards",
    element: <CardPage />,
    loader: authGuard,
  },
  {
    path: "/transactions",
    element: <TransactionPage />,
    loader: authGuard,
  },
]);

function App() {
  return <RouterProvider router={route} />;
}

export default App;
