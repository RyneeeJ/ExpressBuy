import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Header from "./Header";
import MainWindow from "./MainWindow";
import ErrorFallback from "./ErrorFallback";
import { useLocation } from "react-router";

const AppLayout = () => {
  const location = useLocation();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <ErrorBoundary resetKeys={[location.key]} FallbackComponent={ErrorFallback}>
      <div className="mx-auto flex h-screen max-w-7xl flex-col">
        <Header onToggleSidebar={toggleDrawer} />

        <MainWindow isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer} />
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;
