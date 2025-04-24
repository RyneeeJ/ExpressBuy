import BackButton from "./BackButton";

const ErrorDisplay = ({ errMsg }) => {
  return (
    <div className="flex flex-col items-center space-y-6 text-lg">
      <p>{errMsg}</p>
      <BackButton />
    </div>
  );
};

export default ErrorDisplay;
