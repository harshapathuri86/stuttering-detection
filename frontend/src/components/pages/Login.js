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

import aiishPic from "../images/AIISH_LoGO.jpeg";
import iiitPic from "../images/IIITLoGO.jpeg";

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

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    //    send data as form data
    console.log(data);

    axios
      .post("http://localhost:5000/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Login Success", res);
        notify(res.data.message, "success");
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        localStorage.setItem("user", res.data.user);
        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          console.log(user);

          if (user.usertype === 0 || user.usertype === 1) {
            // super_admin
            console.log("admin");
            window.location.href = "/admin";
          } else if (user.usertype === 2) {
            // doctor
            console.log("doctor");
            window.location.href = "/doctor";
          } else if (user.usertype === 3) {
            // patient
            console.log("patient");
            window.location.href = "/patient";
          } else {
            console.log("others");
            notify("Invalid user type", "error");
          }
        }, 2000);
      })
      .catch((err) => {
        console.log("Login Error", err);
        notify(err.response.data.message, "error");
      });
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.usertype === 0 || user.usertype === 1) {
        window.location.href = "/admin";
      } else if (user.usertype === 2) {
        window.location.href = "/doctor";
      } else if (user.usertype === 3) {
        window.location.href = "/patient";
      } else {
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              marginTop: 4,
              height: "20vh",
              backgroundColor: "primary",
            }}
          >
            <img src={aiishPic} alt="AIISH" height="100vh" width="auto" />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
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
          Sign in
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
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ||
                      "Invalid email address",
                  },
                })}
                helperText={formState.errors.email?.message}
                error={formState.errors.email ? true : false}
                autoComplete="email"
              />

              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                // show hidden icon
                {...register("password", {
                  required: true,
                })}
                helperText={formState.errors.password?.message}
                error={formState.errors.password ? true : false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  {...register("remember")}
                />
              }
              label="Remember me"
            /> */}

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
                  : "Sign In"}
              </Button>
            </form>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotpassword" variant="body2">
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
        </Grid>
        <Grid item xs={3}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              marginTop: 4,
              height: "20vh",
              backgroundColor: "primary",
            }}
          >
            <img src={iiitPic} alt="IIIT" height="100vh" width="auto" />
          </Box>
        </Grid>
      </Grid>
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
          {/*  */}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
