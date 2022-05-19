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
import { Navigate } from "react-router-dom";
import { FormGroup, FormLabel } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { notify } from "../templates/Toast";
import { Input, IconButton, InputAdornment } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
const theme = createTheme();

export default function Register() {
  const { register, control, handleSubmit, formState, clearErrors, getValues } =
    useForm({});

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [userType, setUserType] = React.useState("");
  const onSubmit = (data) => {
    console.log(data);

    axios
      .post("/api/register", data)
      .then((res) => {
        console.log(res);
        // redirect to login page
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

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
            Sign up
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
                validate: {
                  length: (value) =>
                    value.length > 3 || "Must be at least 3 characters",
                },
              })}
              helperText={formState.errors.username?.message}
              error={formState.errors.username ? true : false}
              autoComplete="username"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              {...register("email", {
                required: true,
                validate: {
                  email: (value) =>
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ||
                    "Invalid email address",
                  length: (value) =>
                    value.length > 3 || "Must be at least 3 characters",
                },
              })}
              helperText={formState.errors.email?.message}
              error={formState.errors.email ? true : false}
              autoComplete="email"
            />
            <Select
              variant="outlined"
              fullWidth
              id="role"
              label="Role"
              defaultValue={""}
              value={userType}
              {...register("usertype", {
                required: true,
                validate: {
                  notEmpty: (value) => value !== "" || "Please select a role",
                },
              })}
              onChange={(e) => setUserType(e.target.value)}
              error={formState.errors.role ? true : false}
            >
              <MenuItem value=""> </MenuItem>
              <MenuItem value={0}>Super Admin</MenuItem>
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>Doctor</MenuItem>
              <MenuItem value={3}>Patient</MenuItem>
            </Select>
            {formState.errors.usertype ? (
              <p
                style={{
                  // red
                  color: "red",
                }}
              >
                {formState.errors.usertype.message}
              </p>
            ) : null}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
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
              label="Confirm Password"
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
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
                formState.isSubmitting || formState.isValidating ? true : false
              }
            >
              Sign Up
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot_password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/login" variant="body2">
                Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
