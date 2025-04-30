const ToastNotification = ({ message, status }) => {
  return (
    <div className="toast toast-top toast-center fixed z-10">
      <div className="alert alert-info">
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ToastNotification;
