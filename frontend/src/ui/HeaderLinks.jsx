import { Link } from "react-router";

const HeaderLinks = () => {
  return (
    <div className="space-x-3">
      <Link className="btn btn-ghost" to="/">
        Home
      </Link>
      <button className="btn btn-soft">Login</button>
      <button className="btn btn-ghost">Sign up</button>
    </div>
  );
};

export default HeaderLinks;
