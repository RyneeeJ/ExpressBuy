import LoginForm from "../features/authentication/components/LoginForm";

const LoginPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <p className="mb-1 text-2xl font-semibold">ExpressBuy Login</p>
        <p className="mb-6 text-sm">Please enter your email and password</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
