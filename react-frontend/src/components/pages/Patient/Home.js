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
import { Card } from "@mui/material";

export const theme = createTheme();

export function Home() {
  const [user, setUser] = React.useState([]);

  useEffect(() => {
    if (!localStorage.getItem("user")) window.location.href = "/";
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user", user);
    if (user.usertype !== 3) window.location.href = "/";
    setUser(user);
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
            Welcome to your dashboard, {user.username} !
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
          }}
        >
          <Typography component="h1" variant="h5">
            You are logged in as patient.
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TestList />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export function TestList() {
  const [tests, setTests] = React.useState([]);
  useEffect(() => {
    // console.log("token", localStorage.getItem("access_token"));
    axios
      .get("/api/tests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        // console.log("tests", res.data);
        // console.log("tests", tests);
        setTests(res.data.tests);
        console.log(tests, "here");
        // convert string to array of objects
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      {/* <div> */}
      {tests.map((test) => (
        // console.log(test.id)
        <TestCard key={test.id} test={test} />
      ))}
    </Container>
    // </div>
  );
}

const TestCard = ({ test }) => {
  return (
    <Card
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "row",
      }}
      onClick={() => (window.location.href = `/test/${test.id}`)}
    >
      {/* <Grid> */}
      <Grid item xs={8}>
        <Typography variant="h5" component="h2">
          {test.case_number}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" component="p">
          {test.case_name}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" component="p">
          {test.date}
        </Typography>
      </Grid>
    </Card>
    // </Grid>
  );
};
