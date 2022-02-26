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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

import { notify } from "../templates/Toast";

const theme = createTheme();

export default function Login() {
  const {
    register,
    control,
    handleSubmit,
    formState,
    clearErrors,
    getValues,
    setError,
  } = useForm();

  const onSubmit = (data) => {
    //    send data as form data
    console.log(data);

    axios
      .post("http://localhost:5000/users/login", data)
      .then((res) => {
        console.log("Login Success", res);
        notify(res.data.message, "success");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", res.data.user);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("role", res.data.user.role);

        setTimeout(() => {
          const role = res.data.user.role;
          console.log("role", role);
          if (role === "DOCTOR") {
            window.location.href = "/doctor";
          }
          if (role === "PATIENT") {
            window.location.href = "/patient";
          }
          if (role === "ADMIN") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/login";
          }
        }, 2000);
      })
      .catch((err) => {
        console.log("Login Error", err);
        notify(err.response.data.message, "error");
      });
  };

  useEffect(() => {
    // if token is present, redirect to home page
    if (localStorage.getItem("token")) {
      const role = localStorage.getItem("role");
      if (!role) window.location.href = "/login";
      if (role === "DOCTOR") {
        window.location.href = "/doctor";
      }
      if (role === "PATIENT") {
        window.location.href = "/patient";
      }
      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/login";
      }
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
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              {...register("username", {
                required: true,
              })}
              helperText={formState.errors.username?.message}
              error={formState.errors.username ? true : false}
              autoComplete="username"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              id="password"
              {...register("password", {
                required: true,
              })}
              helperText={formState.errors.password?.message}
              error={formState.errors.password ? true : false}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  {...register("remember")}
                />
              }
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={
                formState.isSubmitting || formState.isValidating ? true : false
              }
            >
              {formState.isSubmitting || formState.isValidating
                ? "Loading..."
                : "Sign In"}
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot_password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
