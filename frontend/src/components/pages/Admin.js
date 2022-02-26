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

export const theme = createTheme();

export default function AdminPage() {
  useEffect(() => {
    if (!localStorage.getItem("token")) window.location.href = "/login";
    if (localStorage.getItem("role") !== "ADMIN") {
      localStorage.clear();
      window.location.href = "/";
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
          }}
        >
          <Typography component="h1" variant="h5">
            Welcome to your dashboard, {localStorage.getItem("username")} !
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
          }}
        >
          <Typography component="h1" variant="h5">
            You are logged in as an admin
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
