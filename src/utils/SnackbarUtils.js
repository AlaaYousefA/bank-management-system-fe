import { useSnackbar } from "notistack";

let snackbarRef;
export const SnackbarUtilsConfigurator = () => {
  snackbarRef = useSnackbar();
  return null;
};

export default {
  success(msg) {
    this.toast(msg, "success");
  },
  warning(msg) {
    this.toast(msg, "warning");
  },
  info(msg) {
    this.toast(msg, "info");
  },
  error(msg) {
    this.toast(msg, "error");
  },
  toast(msg, variant = "default") {
    snackbarRef.enqueueSnackbar(msg, { variant });
  },
};
