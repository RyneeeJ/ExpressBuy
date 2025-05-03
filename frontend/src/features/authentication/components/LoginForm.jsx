import { useState } from "react";
import login from "../api/login";
import showToast from "../../../utils/toast";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errMessage, setErrMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      showToast("success", data.message);
      navigate("/");
    } catch (err) {
      setErrMessage(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          className="input mb-2 w-full"
          placeholder="Email"
          required
        />

        <label className="label">Password</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          className="input w-full"
          placeholder="Password"
          required
        />

        {errMessage && <p className="text-error mt-2">{errMessage}</p>}
        <button type="submit" className="btn btn-neutral mt-4">
          Login
        </button>
      </fieldset>
    </form>
  );
};

export default LoginForm;
