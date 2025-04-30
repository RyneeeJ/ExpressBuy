import { toast } from "react-hot-toast";

const showToast = (type, message, duration = 3000) => {
  const typeMap = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
  };

  toast(
    <div className={`alert ${typeMap[type]} text-sm`}>
      <span>{message}</span>
    </div>,
    {
      duration,
      position: "top-right",
    },
  );
};

export default showToast;
