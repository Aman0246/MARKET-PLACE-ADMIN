import { useToastContext } from "./ToastProvider";

const useToast = () => {
  const { showToast } = useToastContext();

  return {
    success: (msg, duration) => showToast("success", msg, duration),
    error: (msg, duration) => showToast("error", msg, duration),
    info: (msg, duration) => showToast("info", msg, duration),
    warning: (msg, duration) => showToast("warning", msg, duration),
  };
};

export default useToast;
