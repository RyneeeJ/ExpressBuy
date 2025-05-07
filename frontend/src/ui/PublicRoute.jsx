import { Navigate } from "react-router";

import LoadingSpinner from "./LoadingSpinner";
import useOptionalUser from "../features/authentication/api/useOptionalUser";

const PublicRoute = ({ children }) => {
  const { data, status } = useOptionalUser();
  console.log(data?.data?.user);
  if (status === "pending") return <LoadingSpinner />;

  if (status === "success" && data?.data?.user) return <Navigate to="/" />;

  return children;
};

export default PublicRoute;
