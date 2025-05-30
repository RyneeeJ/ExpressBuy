import ProductsSidebarLinks from "./ProductsSidebarLinks";
import ProfileSidebarLinks from "./ProfileSidebarLinks";

const Sidebar = ({ isProfilePage, isDrawerOpen, closeDrawer }) => {
  return (
    <div>
      {/* Desktop sidebar */}
      <aside className="bg-base-200 hidden h-full w-64 p-4 lg:block">
        {isProfilePage ? <ProfileSidebarLinks /> : <ProductsSidebarLinks />}
      </aside>

      {/* Mobile drawer sidebar */}
      <div
        className={`drawer-overlay fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden ${
          isDrawerOpen ? "pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      <aside
        className={`bg-base-200 fixed top-0 right-0 z-50 h-full w-64 transform p-4 shadow transition-transform lg:hidden ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* close sidebar button */}
        <div className="flex justify-end">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={closeDrawer}
            aria-label="Close sidebar"
          >
            CLOSE
          </button>
        </div>
        {/* Sidebar content */}
        {isProfilePage ? <ProfileSidebarLinks /> : <ProductsSidebarLinks />}
      </aside>
    </div>
  );
};

export default Sidebar;
