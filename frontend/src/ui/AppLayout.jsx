import { useLocation } from "react-router";
import Header from "./Header";
import { useState } from "react";
import SidebarNav from "./SidebarNav";

const AppLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  const isSidebarVisible =
    path === "/" || path === "/products" || path.startsWith("/profile");
  const isProfilePage = path.startsWith("/profile");

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
      <Header onToggleSidebar={toggleDrawer} />
      <SidebarNav
        isProfilePage={isProfilePage}
        isSidebarVisible={isSidebarVisible}
        isDrawerOpen={isDrawerOpen}
        closeDrawer={closeDrawer}
      />
    </div>
  );
};

export default AppLayout;
