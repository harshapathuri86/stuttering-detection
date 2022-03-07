import { toast } from "react-toastify";

const options = {
  position: "bottom-center",
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notify = (message, type) => {
  toast[type](message, options);
};
