import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

const SidebarNavLinks = ({ links, isProfilePage }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  let activeCategory =
    searchParams.get("category")?.replace("&", "%26") || "all";

  if (location.pathname === "/") activeCategory = undefined;

  const navigate = useNavigate();
  const handleCategoryClick = (path) => {
    navigate(`/products?category=${path}`);
  };

  return (
    <ul className="menu bg-base-200 text-base-content text-md min-h-full w-full p-0">
      {links.map((link) => (
        <li key={link.category || link.path}>
          {isProfilePage ? (
            <NavLink className="py-2" end={link.end} to={link.path}>
              {link.label}
            </NavLink>
          ) : (
            <button
              onClick={() => handleCategoryClick(link.category)}
              className={`py-2 ${link.category === activeCategory ? "active" : ""}`}
            >
              {link.label}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SidebarNavLinks;
