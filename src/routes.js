import Admin from "./pages/admin";
import User from "./pages/user";

const routes = [
  { path: "/app/:id", component: User },
  { path: "/app/admin/:id", component: Admin },
];

export default routes;
