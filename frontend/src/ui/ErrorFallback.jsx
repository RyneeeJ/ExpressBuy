import { useNavigate } from "react-router";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <div className="text-center text-lg lg:text-2xl">
        <p>Something went wrong ☹️</p>
        <p>{error.message}</p>
      </div>
      <button
        className="btn btn-neutral lg:btn-lg xl:btn-xl"
        onClick={() => {
          navigate(-1, { replace: true });
          resetErrorBoundary();
        }}
      >
        Go back &rarr;
      </button>
    </div>
  );
};

export default ErrorFallback;
