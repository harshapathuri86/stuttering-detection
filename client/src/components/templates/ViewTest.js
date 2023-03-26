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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

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
        console.log(res.data.test);
        setTest(JSON.parse(res.data.test));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const printDocument = () => {
    const input = document.getElementById('divToPrint');
    const opt = {
      margin: 1,
      filename: 'test_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      // html2canvas: { scale: 2.5 },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    // New Promise-based usage:
    html2pdf()
      .set(opt)
      .from(input)
      .save();

    // Old monolithic-style usage:
    // html2pdf(input, opt);
  };

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
          <div id="divToPrint">
            <Typography variant="h5">
              <span style={{ fontWeight: 'bold' }}>Demographic Details</span>
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Case Number</span>
              </Typography>
              <Typography variant="body1">
                {test.case_number}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Case Name</span>
              </Typography>
              <Typography variant="body1">
                {test.case_name}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Age</span>
              </Typography>
              <Typography variant="body1">
                {test.age}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Contact Number</span>
              </Typography>
              <Typography variant="body1">
                {test.contact_number}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Email</span>
              </Typography>
              <Typography variant="body1">
                {test.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Martial Status</span>
              </Typography>
              <Typography variant="body1">
                {test.martial_status}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Occupation</span>
              </Typography>
              <Typography variant="body1">
                {test.occupation}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Education</span>
              </Typography>
              <Typography variant="body1">
                {test.education}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Address</span>
              </Typography>
              <Typography variant="body1">
                {test.address}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Duration</span>
              </Typography>
              <Typography variant="body1">
                {test.duration}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>model_type</span>
              </Typography>
              <Typography variant="body1">
                {test.model_type}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Nature</span>
              </Typography>
              <Typography variant="body1">
                {test.nature}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Percentage of disfluencies in Spontaneous speech</span>
              </Typography>
              <Typography variant="body1">
                _
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Percentage of disfluencies in Reading</span>
              </Typography>
              <Typography variant="body1">
                _
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Overall percentage of disfluencies</span>
              </Typography>
              <Typography variant="body1">
                _
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Total number of syllables uttered</span>
              </Typography>
              <Typography variant="body1">
                {test.total_score}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Doctor Email</span>
              </Typography>
              <Typography variant="body1">
                {test.doctor}
              </Typography>
            </Box>

            <Box>
              <br />
              <Divider />
              <br />
              <DisplayQuestions questions={test.questions} />
              <DisplayPassages passages={test.passages} />
            </Box>
          </div>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="8vh"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={printDocument}
              >
                <Grid container direction="row" spacing={1} alignItems={'center'} justify={'center'} style={{ width: "100%" }}>
                  <Grid item>
                    Download Report
                  </Grid>
                </Grid>
              </Button>
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
        <span style={{ fontWeight: 'bold' }}>Questions</span>{" "}
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
      <br />
      <audio controls>
        <source src={question.source} type="audio/webm" controls />
      </audio>

      <Typography variant="body1">
        <span style={{ fontWeight: 'bold' }}>Total number of syllables</span>&nbsp;&nbsp;&nbsp;{question.score}
      </Typography>
      <Typography variant="body1">
        <span style={{ fontWeight: 'bold' }}>Clean syllables</span>&nbsp;&nbsp;&nbsp;_
      </Typography>
      <Typography variant="body1">
        <span style={{ fontWeight: 'bold' }}>Stuttered syllables</span>&nbsp;&nbsp;&nbsp;_
      </Typography>
      <br />

      <Divider />
      <br />
    </div>
  );
};

const DisplayPassages = ({ passages }) => {
  return (
    <div>
      <Typography component="h1" variant="h5">
        {" "}
        <span style={{ fontWeight: 'bold' }}>Passages</span>{" "}
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

      <Typography variant="body1">
        <span style={{ fontWeight: 'bold' }}>Total number of syllables</span>&nbsp;&nbsp;&nbsp;{passage.score}
      </Typography>
      <Typography variant="body1">
        <span style={{ fontWeight: 'bold' }}>Clean syllables</span>&nbsp;&nbsp;&nbsp;_
      </Typography>
      <Typography variant="body1">
        <span style={{ fontWeight: 'bold' }}>Stuttered syllables</span>&nbsp;&nbsp;&nbsp;_
      </Typography>
      <br />

      <Divider />
      <br />
    </div>
  );
};
