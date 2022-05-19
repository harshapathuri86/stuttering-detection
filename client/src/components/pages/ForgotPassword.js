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

  const [linksent, setLinksent] = React.useState(false);

  const onSubmit = (data) => {
    //    send data as form data
    console.log(data);

    axios
      .post("/api/forgotpassword", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setLinksent(true);
      })
      .catch((err) => {
        console.log("Error", err);
        notify(err.response.data.message, "error");
      });
  };

  useEffect(() => {}, []);

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
          {!linksent ? (
            <div>
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
                Forgot Password
              </Typography> */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email"
                  {...register("email", {
                    required: true,
                    validate: {
                      email: (value) =>
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                          value
                        ) || "Invalid email address",
                    },
                  })}
                  helperText={formState.errors.email?.message}
                  error={formState.errors.email ? true : false}
                  autoComplete="email"
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
                    : "Send Password Reset Link"}
                </Button>
              </form>
            </div>
          ) : (
            <p>Password reset link has been sent to your email.</p>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
