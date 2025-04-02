import HeaderLinks from "./HeaderLinks";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <div className="flex items-center justify-between py-4">
      <div>ExpressBuy</div>
      <SearchBar />
      <HeaderLinks />
    </div>
  );
};

export default Header;
