import { toast } from "react-toastify";

const options = {
  position: "bottom-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notify = (message, type) => {
  toast[type](message, options);
};
