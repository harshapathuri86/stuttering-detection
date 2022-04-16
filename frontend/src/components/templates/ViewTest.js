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
import { useParams } from "react-router-dom";

export default function ViewTest() {
  const { id } = useParams();
  const [test, setTest] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/test/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setTest(JSON.parse(res.data.test));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <Container component="main" maxWidth="s">
      <CssBaseline />
      {loading ? (
        <div>
          <Typography component="h1" variant="h5">
            Loading...
          </Typography>
        </div>
      ) : (
        <div>
          <Typography component="h1" variant="h5">
            Case number: {test.case_number}
          </Typography>

          <Typography component="h1" variant="h5">
            Case name: {test.case_name}
          </Typography>
          <Box>
            <Divider />
            <DisplayQuestions questions={test.questions} />
            <Divider />
            <DisplayPassages passages={test.passages} />
          </Box>
        </div>
      )}
    </Container>
  );
}

const DisplayQuestions = ({ questions }) => {
  return (
    <div>
      <Typography component="h1" variant="h5">
        {" "}
        Questions{" "}
      </Typography>

      {questions.map((question, index) => {
        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <DisplayQuestion question={question} />
          </div>
        );
      })}
    </div>
  );
};

const DisplayQuestion = ({ question }) => {
  return (
    <div>
      <Typography component="h1" variant="h5">
        {question.text}
      </Typography>
      <audio controls>
        <source src={question.source} type="audio/webm" controls />
      </audio>
      <Divider />
    </div>
  );
};

const DisplayPassages = ({ passages }) => {
  return (
    <div>
      <Typography component="h1" variant="h5">
        {" "}
        Passages{" "}
      </Typography>
      {passages.map((passage, index) => {
        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <DisplayPassage passage={passage} />
          </div>
        );
      })}
    </div>
  );
};

const DisplayPassage = ({ passage }) => {
  return (
    <div>
      <Typography component="h1" variant="h5">
        {passage.text}
      </Typography>
      <audio controls>
        <source src={passage.source} type="audio/webm" controls />
      </audio>
      <Divider />
    </div>
  );
};
