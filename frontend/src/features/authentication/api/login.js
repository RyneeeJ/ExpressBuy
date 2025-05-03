import axios from "axios";

const login = async ({ email, password }) => {
  const res = await axios.post("/api/v1/auth/login", { email, password });
  return res.data;
};

export default login;
