import axios from "axios";

const logout = async () => {
  await axios.post("/api/v1/auth/logout");
};

export default logout;
