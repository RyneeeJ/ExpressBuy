import { Outlet } from "react-router";
import Header from "./Header";

const AppLayout = () => {
  return (
    <div>
      <Header />

      <Outlet />
    </div>
  );
};

export default AppLayout;
