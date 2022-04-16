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
import UserDetails from "./testcomponents/UserDetails";
import ReadSentence from "./testcomponents/ReadSentence.js";
import ReadPassage from "./testcomponents/ReadPassage";
import TestCountInput from "./testcomponents/testInput";
import { notify } from "../../templates/Toast";
export const theme = createTheme();

export default function NewTest() {
  const [values, setValues] = React.useState({
    case_name: "",
    case_number: "",
    age: "",
    gender: "",
    contact_number: "",
    email: "",
    // city: "",
    // state: "",
    // pincode: "",
    martial_status: "",
    occupation: "",
    duration: "",
    // nature: "",
    history: "",
    questions: [],
    passages: [],
  });

  const [step, setStep] = React.useState(1);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else {
      console.log("You are at the end of the form");
      submitTest();
    }
  };

  const submitTest = () => {
    // console.log("submitTest", values);
    // TODO:
    // verify demographic data
    // remove unfinished questions/passages
    for (let i = 0; i < values.questions.length; i++) {
      if (values.questions[i].src === "") {
        values.questions.splice(i, 1);
        i--;
      } else {
        try {
          let reader = new FileReader();
          reader.readAsDataURL(values.questions[i].src);
          reader.onloadend = function () {
            values.questions[i].source = reader.result;
          };
        } catch (err) {
          console.log(err);
        }
      }
    }
    if (values.questions.length === 0) {
      notify("Please record at least one question", "error");
      setStep(2);
      return;
    }
    for (let i = 0; i < values.passages.length; i++) {
      if (values.passages[i].src === "") {
        values.passages.splice(i, 1);
        i--;
      } else {
        try {
          let reader = new FileReader();
          reader.readAsDataURL(values.passages[i].src);
          reader.onloadend = function () {
            values.passages[i].source = reader.result;
          };
        } catch (err) {
          console.log(err);
        }
      }
    }
    if (values.passages.length === 0) {
      toast.error("Please record at least one passage");
      setStep(3);
      return;
    }
    console.log("submitTest", values);
    axios
      .post(
        "http://localhost:5000/newtest",
        {
          test: values,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((res) => {
        notify("Test created successfully", "success");
        window.location.href = "/doctor";
      })
      // if conflict, notify user
      // TODO: unable to catch the error in axios
      .catch(function (err) {
        console.log("err", err);
        if (err.response.status === 409) {
          notify("Test with same number already exists", "error");
        } else {
          notify("Error creating test", "error");
        }
      });
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const addQuestions = (questions) => {
    setValues({ ...values, questions: questions });
  };

  const deleteQuestion = (question) => {
    let ques = values.questions.filter((q) => q.id !== question.id);
    setValues({ ...values, questions: ques });
  };

  const addQuestion = (question) => {
    setValues({ ...values, questions: [...values.questions, question] });
  };

  const updateQuestion = (question) => {
    let ques = values.questions.map((q) => {
      if (q.id === question.id) {
        return question;
      } else {
        return q;
      }
    });
    setValues({ ...values, questions: ques });
  };

  const addPassages = (passages) => {
    setValues({ ...values, passages: passages });
  };

  const addPassage = (passage) => {
    setValues({ ...values, passages: [...values.passages, passage] });
  };

  const updatePassage = (passage) => {
    let pass = values.passages.map((q) => {
      if (q.id === passage.id) {
        return passage;
      } else {
        return q;
      }
    });
    setValues({ ...values, passages: pass });
  };

  const deletePassage = (passage) => {
    let pass = values.passages.filter((p) => p.id !== passage.id);
    setValues({ ...values, passages: pass });
  };

  const handleChange = (input) => (e) => {
    console.log("handle", e.target.value);
    setValues({ ...values, [input]: e.target.value });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
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
              addQuestions={addQuestions}
              addQuestion={addQuestion}
              deleteQuestion={deleteQuestion}
              updateQuestion={updateQuestion}
              questions={values.questions}
            />
          )}
          {step === 3 && (
            <ReadPassage
              nextStep={nextStep}
              prevStep={prevStep}
              addPassages={addPassages}
              addPassage={addPassage}
              deletePassage={deletePassage}
              updatePassage={updatePassage}
              passages={values.passages}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
