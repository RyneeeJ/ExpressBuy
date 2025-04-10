import HeaderLinks from "./HeaderLinks";
import SearchBar from "./SearchBar";

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between py-4">
      <div>ExpressBuy</div>
      <SearchBar />
      <HeaderLinks />

      <div className="lg:hidden">
        <button onClick={onToggleSidebar} className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
