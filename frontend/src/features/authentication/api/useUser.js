import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getCurrentUser = async () => {
  const res = await axios.get("/api/v1/users/me");
  return res.data;
};

const useUser = () => {
  const { data, status, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return { data, status, error };
};

export default useUser;
