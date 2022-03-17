import React, { Component } from "react";
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
import { LoremIpsum } from "react-lorem-ipsum";

export default function ReadSentence({
  nextStep,
  prevStep,
  handleChange,
  values,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState,
    clearErrors,
    getValues,
    setError,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("submit data", data);
    nextStep();
  };

  return (
    <Container component="main">
      <Typography variant="h4" component="h1" gutterBottom>
        Read Sentence
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              <LoremIpsum p={1} />
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Button variant="contained" color="primary" onClick={prevStep}>
              Previous
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
