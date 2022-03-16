import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Context from "@mui/base/TabsUnstyled/TabsContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { notify } from "../templates/Toast";
import { Input, IconButton, InputAdornment } from "@mui/material";
const theme = createTheme();

export default function ForgotPassword() {
  const {
    register,
    control,
    handleSubmit,
    formState,
    clearErrors,
    getValues,
    setError,
  } = useForm();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [jwt, setJwt] = React.useState("");
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (data) => {
    //    send data as form data
    console.log(data);
    const password = data.password;
    // get query params
    const query = new URLSearchParams(window.location.search);
    const jwt = query.get("jwt");
    // send jwt as query params
    axios
      .post("http://localhost:5000/resetpassword", null, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          jwt,
          password,
        },
      })
      .then((res) => {
        notify(res.data.message, "success");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch((err) => {
        console.log("Error", err);
        notify(err.response.data.message, "error");
      });
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const jwt = query.get("jwt");
    if (jwt) {
      setJwt(jwt);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          {/* <Typography component="h1" variant="h5">
            Set new password
          </Typography> */}
          {jwt ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="New password"
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password", {
                  required: true,
                  validate: {
                    length: (value) =>
                      value.length > 3 || "Must be at least 3 characters",
                  },
                })}
                helperText={formState.errors.password?.message}
                error={formState.errors.password ? true : false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Confirm new password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: true,
                  validate: {
                    length: (value) =>
                      value.length > 3 || "Must be at least 3 characters",
                    confirmPassword: (value) => {
                      const { password } = getValues();

                      return value === password || "Passwords do not match";
                    },
                  },
                })}
                helperText={formState.errors.confirmPassword?.message}
                error={formState.errors.confirmPassword ? true : false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={
                  formState.isSubmitting || formState.isValidating
                    ? true
                    : false
                }
              >
                {formState.isSubmitting || formState.isValidating
                  ? "Loading..."
                  : "Set new Password"}
              </Button>
            </form>
          ) : (
            <Typography component="h1" variant="h5">
              Not authorized
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
