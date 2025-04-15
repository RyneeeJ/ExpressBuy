import { NavLink, useNavigate, useSearchParams } from "react-router";

const SidebarNavLinks = ({ links, isProfilePage }) => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category")?.replace("&", "%26");

  const navigate = useNavigate();
  const handleCategoryClick = (path) => navigate(`/products?category=${path}`);
  console.log(links);
  return (
    <ul className="menu bg-base-200 text-base-content min-h-full w-full p-0">
      {links.map((link) => (
        <li key={link.category || link.path}>
          {isProfilePage ? (
            <NavLink end={link.end} to={link.path}>
              {link.label}
            </NavLink>
          ) : (
            <button
              onClick={() => handleCategoryClick(link.category)}
              className={link.category === activeCategory ? "active" : ""}
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
