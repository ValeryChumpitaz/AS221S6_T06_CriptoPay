import LoginPage from "../pages/account/LoginPage";
import RegisterPage from "../pages/account/RegisterPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
import PurchasesPage from "../pages/dashboard/PurchasesPage";
import MainPage from "../pages/main/MainPage";
import Inicio from "../pages/dashboard/Inicio";
import PrivateRoute from "../routes/PrivateRoute";
import HomePage from "../pages/Empezar/Homepage";
import OtherPage from "../pages/landingPage/OtherPage";
import CreateRoutePage from "../pages/dashboard/CreateRoutePage";

const routesConfig = [
  { path: "/", element: <HomePage /> },
  { path: "/other", element: <OtherPage /> },
  { path: "/main", element: <MainPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/inicio", element: <PrivateRoute><Inicio /></PrivateRoute> },
  { path: "/profile", element: <PrivateRoute><ProfilePage /></PrivateRoute> },
  { path: "/purchases", element: <PrivateRoute><PurchasesPage /></PrivateRoute> },
  { path: "/create-route", element: <PrivateRoute roles={['contractor']}><CreateRoutePage /></PrivateRoute> }
];

export default routesConfig;
