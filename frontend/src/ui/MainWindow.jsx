import { Outlet, useLocation } from "react-router";
import Sidebar from "./Sidebar";

const MainWindow = ({ isDrawerOpen, closeDrawer }) => {
  const location = useLocation();

  const path = location.pathname;
  const isProfilePage = path.startsWith("/profile");
  const isSidebarVisible =
    path === "/" || path.startsWith("/products") || isProfilePage;

  return (
    <div className="flex flex-1 overflow-y-auto">
      {/* Sidebar - visible on desktop, drawer on mobile */}
      {isSidebarVisible && (
        <Sidebar
          isProfilePage={isProfilePage}
          isDrawerOpen={isDrawerOpen}
          closeDrawer={closeDrawer}
        />
      )}
      {/* Page content */}

      <main className="h-full w-full overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainWindow;
