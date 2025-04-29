import { Link } from "react-router";

// eslint-disable-next-line no-unused-vars
const BreadcrumbNav = ({ linksArr }) => {
  return (
    <div className="breadcrumbs mb-4 text-sm">
      <ul className="flex-wrap gap-y-1">
        {linksArr.map((link) => (
          <li key={link.label}>
            {link.path ? (
              <Link to={link.path}>{link.label}</Link>
            ) : (
              <span>{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BreadcrumbNav;
