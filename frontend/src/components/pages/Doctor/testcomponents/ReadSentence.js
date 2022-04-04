import React, { Component, useEffect } from "react";
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
import { Divider } from "@mui/material";
import axios from "axios";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

export default function ReadSentence({
  nextStep,
  prevStep,
  addQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  questions,
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

  const getNewQuestion = () => {
    let idsString = "";
    questions.map((question) => {
      idsString += question.id + ",";
    });
    idsString = idsString.slice(0, -1);
    console.log("idsString", idsString);
    let token = localStorage.getItem("access_token");
    axios
      .get("http://localhost:5000/question", {
        params: {
          qids: idsString,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        let newQuestion = JSON.parse(res.data.question)[0];
        const question = {
          text: newQuestion.question,
          src: "",
          id: newQuestion._id.$oid,
        };
        addQuestion(question);
      });
  };

  const onSubmit = (data) => {
    nextStep();
  };

  useEffect(() => {
    if (questions.length === 0) {
      getNewQuestion();
    }
  }, [questions]);

  return (
    <Container component="main">
      {/* <Typography variant="h3" component="h1" gutterBottom>
        Read Sentences
      </Typography> */}
      <form>
        <Grid container spacing={3}>
          {questions.map((question, index) => (
            <NewQuestion
              key={index}
              question={question}
              index={index}
              deleteQuestion={deleteQuestion}
              updateQuestion={updateQuestion}
            />
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={getNewQuestion}
            >
              Add Question
            </Button>
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

export function NewQuestion({
  question,
  index,
  deleteQuestion,
  updateQuestion,
}) {
  const [blob, setBlob] = React.useState(question.src || null);
  const refAudio = React.useRef(null);
  const recorderRef = React.useRef(null);

  const handleRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      recorderRef.current = new RecordRTC(mediaStream, {
        type: "audio",
        mimeType: "audio/wav",
      });
    } catch (err) {
      console.log(err);
    }
    console.log("curr", recorderRef.current);

    recorderRef.current.startRecording();
  };
  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());
      refAudio.current.src = URL.createObjectURL(recorderRef.current.getBlob());
      updateQuestion({ ...question, src: recorderRef.current.getBlob() });
    });
  };

  const handlePause = () => {
    recorderRef.current.pauseRecording();
  };
  const handleResume = () => {
    recorderRef.current.resumeRecording();
  };

  const handleSave = () => {
    invokeSaveAsDialog(blob);
  };

  const handleClear = () => {
    setBlob(null);
    refAudio.current.src = null;
  };

  return (
    <Grid item xs={12}>
      <Box>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          {index + 1}. {question.text}
        </Typography>

        <Grid item xs={12}>
          <Button onClick={handleRecording}>Record</Button>
          <Button onClick={handleStop}>Stop</Button>
          <Button onClick={handlePause}> Pause </Button>
          <Button onClick={handleResume}> Resume </Button>
          <Button onClick={handleSave} disabled={!blob}>
            Download
          </Button>
          <Button color="error" disabled={!blob} onClick={handleClear}>
            Delete Audio
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteQuestion(question);
            }}
          >
            Delete Question
          </Button>
          {question.src && !refAudio?.current?.src ? (
            <div>
              <audio
                src={URL.createObjectURL(question.src)}
                ref={refAudio}
                controls
              />
            </div>
          ) : (
            <div>
              <audio ref={refAudio} controls />
            </div>
          )}
        </Grid>
      </Box>
      <Divider variant="middle" />
    </Grid>
  );
}
