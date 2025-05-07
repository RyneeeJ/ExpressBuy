import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import logout from "../features/authentication/api/logout";
import { useQueryClient } from "@tanstack/react-query";

const SidebarNavLinks = ({ links, isProfilePage }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const params = useParams();

  let activeCategory;

  if (location.pathname === "/") activeCategory = undefined;
  else if (params.category)
    activeCategory = params.category.replace("&", "%26");
  else if (location.pathname === "/products") {
    activeCategory = location.search.includes("category")
      ? searchParams.get("category")?.replace("&", "%26")
      : "all";
  }

  const handleCategoryClick = (path) => {
    navigate(`/products?category=${path}`);
  };

  const handleLogout = async () => {
    await logout();
    queryClient.removeQueries({ queryKey: ["optional-user"] });
    navigate("/login");
  };

  return (
    <ul className="menu bg-base-200 text-base-content text-md min-h-full w-full p-0">
      {links?.map((link) => (
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
      {isProfilePage && (
        <li>
          <button onClick={handleLogout} className="py-2">
            Log out
          </button>
        </li>
      )}
    </ul>
  );
};

export default SidebarNavLinks;
