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

export default function ReadPassage({
  nextStep,
  prevStep,
  addPassages,
  updatePassage,
  deletePassage,
  addPassage,
  passages,
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

  const handleUpdate = (passage) => {
    console.log("updatePassage", passage);
    updatePassage(passage);
  };

  const getNewPassage = () => {
    let idsString = "";
    passages.map((passage) => {
      idsString += passage.id + ",";
    });
    idsString = idsString.slice(0, -1);
    axios
      .get("http://localhost:5000/passage", {
        params: {
          pids: idsString,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        let newPassage = JSON.parse(res.data.passage)[0];
        const passage = {
          text: newPassage.passage,
          src: "",
          id: newPassage._id.$oid,
        };
        addPassage(passage);
        // setPassages([...current_passages, passage]);
      });
  };

  const onSubmit = (data) => {
    nextStep();
  };

  useEffect(() => {
    if (passages.length === 0) {
      getNewPassage();
    }
  }, [passages]);

  return (
    <Container component="main">
      {/* <Typography variant="h3" component="h1" gutterBottom>
        Read Sentences
      </Typography> */}
      <form>
        <Grid container spacing={3}>
          {passages.map((passage, index) => (
            <NewPassage
              key={index}
              passage={passage}
              index={index}
              deletePassage={deletePassage}
              updatePassage={updatePassage}
            />
          ))}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={getNewPassage}>
              Add Passage
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
              Submit Test
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export function NewPassage({ passage, index, deletePassage, updatePassage }) {
  const [blob, setBlob] = React.useState(passage.src || null);
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
      updatePassage({ ...passage, src: recorderRef.current.getBlob() });
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
          {index + 1}. {passage.text}
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
              deletePassage(passage);
            }}
          >
            Delete Passage
          </Button>
          {passage.src && !refAudio?.current?.src ? (
            <div>
              <audio
                src={URL.createObjectURL(passage.src)}
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
