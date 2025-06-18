import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

export const notify = (
  type: "success" | "error" = "success",
  message: string
) => {
  toast[type](message);
};

export const NotificationContainer = ToastContainer;
