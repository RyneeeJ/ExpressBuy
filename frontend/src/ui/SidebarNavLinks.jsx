import { Link, useNavigate } from "react-router";

const SidebarNavLinks = ({ links, isHomePage }) => {
  const navigate = useNavigate();
  const handleCategoryClick = (path) => navigate(`/products?category=${path}`);
  return (
    <>
      {links.map((link) => (
        <li key={link.category || link.path}>
          {isHomePage ? (
            <button onClick={() => handleCategoryClick(link.category)}>
              {link.label}
            </button>
          ) : (
            <Link></Link>
          )}
        </li>
      ))}
    </>
  );
};

export default SidebarNavLinks;
