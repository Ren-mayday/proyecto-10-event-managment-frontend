//Definición de rutas (config)
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import CreateEvent from "../pages/CreateEvent/CreateEvent";
import EventDetail from "../pages/EventDetail/EventDetail";
import EditEvent from "../pages/EditEvent/EditEvent";
import MyProfile from "../pages/MyProfile/MyProfile";
import EditProfile from "../pages/EditProfile/EditProfile";

export const routes = [
  {
    path: "/",
    text: "Home",
    page: Home,
  },
  {
    path: "/login",
    text: "Login",
    page: Login,
  },
  {
    path: "/register",
    text: "Register",
    page: Register,
  },
  {
    path: "/create-event",
    text: "Create Event",
    page: CreateEvent,
  },
  {
    path: "/event",
    text: "EventDetail",
    page: EventDetail,
  },
  {
    path: "/edit-event",
    text: "Edit Event",
    page: EditEvent,
  },
  {
    path: "/my-profile",
    text: "My Profile",
    page: MyProfile,
  },
  {
    path: "/edit-profile",
    text: "Edit Profile",
    page: EditProfile,
  },
];
