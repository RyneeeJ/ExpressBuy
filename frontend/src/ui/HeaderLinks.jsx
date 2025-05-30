import { Link } from "react-router";

import useOptionalUser from "../features/authentication/api/useOptionalUser";

const HeaderLinks = () => {
  // eslint-disable-next-line no-unused-vars
  const { data, error, status } = useOptionalUser();
  if (status === "pending") return null;
  return (
    <div className="space-x-3">
      <Link className="btn btn-ghost" to="/">
        Home
      </Link>

      {data?.data.user ? (
        <>
          <Link className="btn btn-ghost" to="/profile">
            Profile
          </Link>
          <Link className="btn btn-ghost" to="/cart">
            Cart
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="btn btn-soft">
            Login
          </Link>
          <button className="btn btn-ghost">Sign up</button>
        </>
      )}
    </div>
  );
};

export default HeaderLinks;
