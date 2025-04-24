import { useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="btn btn-soft btn-accent btn-wide text-xl"
    >
      Go back
    </button>
  );
};

export default BackButton;
