import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    className: "bg-neutral-200 dark:bg-neutral-900 text-custom-green text-base font-medium p-3 rounded shadow-md",
    icon: true,
  });
};

const notifyError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    className: "bg-neutral-200 dark:bg-neutral-900 text-custom-red text-base font-medium p-3 rounded shadow-md",
    icon: true,
  });
};

const notifyWarn = (message) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    className: "bg-neutral-200 dark:bg-neutral-900 text-custom-yellow text-base font-medium p-3 rounded shadow-md",
    icon: true,
  });
};

const ToastContainerStyled = () => (
  <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss={false}
    draggable
    pauseOnHover={false}
    className="mt-16"
  />
);

export { notifySuccess, notifyError, notifyWarn, ToastContainerStyled };
