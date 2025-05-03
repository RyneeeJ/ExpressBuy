import Header from "./Header";
import { useState } from "react";
import MainWindow from "./MainWindow";

const AppLayout = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
      <Header onToggleSidebar={toggleDrawer} />

      <MainWindow isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer} />
    </div>
  );
};

export default AppLayout;
