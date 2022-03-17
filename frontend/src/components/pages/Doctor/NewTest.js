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
import axios from "axios";
import UserDetails from "./testcomponents/UserDetails";
import ReadSentence from "./testcomponents/ReadSentence.js";
import ReadPassage from "./testcomponents/ReadPassage";

export const theme = createTheme();

export default function NewTest() {
  const [values, setValues] = React.useState({
    case_name: "",
    case_number: "",
    age: "",
    gender: "",
    contact_number: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    martial_status: "",
    occupation: "",
    duration: "",
    nature: "",
    history: "",
    audio1: "",
    audio2: "",
    audio3: "",
  });

  const [step, setStep] = React.useState(1);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else console.log("You are at the end of the form", values);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (input) => (e) => {
    console.log("handle", e.target.value);
    setValues({ ...values, [input]: e.target.value });
  };

  console.log("values", values);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        {/* button */}
        {/* <Box
          sx={{
            marginTop: 8,
            display: "flex",
          }}
        >
          <Button color="primary" variant="contained" onClick={nextStep}>
            Continue
          </Button>
        </Box> */}
        {/* form */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
          }}
        >
          {/* <UserDetails
            nextStep={nextStep}
            handleChange={handleChange}
            values={values}
          /> */}
          {step === 1 && (
            <UserDetails
              nextStep={nextStep}
              prevStep={prevStep}
              handleChange={handleChange}
              values={values}
            />
          )}
          {step === 2 && (
            <ReadSentence
              nextStep={nextStep}
              prevStep={prevStep}
              handleChange={handleChange}
              values={values}
            />
          )}
          {step === 3 && (
            <ReadPassage
              nextStep={nextStep}
              prevStep={prevStep}
              handleChange={handleChange}
              values={values}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
