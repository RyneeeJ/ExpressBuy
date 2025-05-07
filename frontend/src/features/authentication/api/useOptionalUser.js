import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getOptionalUser = async () => {
  const res = await axios.get("/api/v1/auth/me-soft");
  return res.data;
};
const useOptionalUser = () => {
  const { data, status, error } = useQuery({
    queryFn: getOptionalUser,
    queryKey: ["optional-user"],
  });
  return { data, status, error };
};

export default useOptionalUser;
