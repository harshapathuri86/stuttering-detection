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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ViewTest() {
  const { id } = useParams();
  const [test, setTest] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    axios
      .get(`/api/test/${id}`, {
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
    const input = document.getElementById("divToPrint");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF("p", "mm");
      var position = 0;

      doc.addImage(imgData, "PNG", 1, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 1, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save("test_report.pdf");
    });
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
              <span style={{ fontWeight: "bold" }}>Demographic Details</span>
            </Typography>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Case Number</span>
              </Typography>
              <Typography variant="body1">{test.case_number}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Case Name</span>
              </Typography>
              <Typography variant="body1">{test.case_name}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Age</span>
              </Typography>
              <Typography variant="body1">{test.age}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Contact Number</span>
              </Typography>
              <Typography variant="body1">{test.contact_number}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Email</span>
              </Typography>
              <Typography variant="body1">{test.email}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Martial Status</span>
              </Typography>
              <Typography variant="body1">{test.martial_status}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Occupation</span>
              </Typography>
              <Typography variant="body1">{test.occupation}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Education</span>
              </Typography>
              <Typography variant="body1">{test.education}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Address</span>
              </Typography>
              <Typography variant="body1">{test.address}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Duration</span>
              </Typography>
              <Typography variant="body1">{test.duration}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Nature</span>
              </Typography>
              <Typography variant="body1">{test.nature}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Total Score</span>
              </Typography>
              <Typography variant="body1">{test.total_score}</Typography>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Doctor Email</span>
              </Typography>
              <Typography variant="body1">{test.doctor}</Typography>
            </Box>

            <Box>
              <br />
              <Divider />
              <br />
              <DisplayQuestions questions={test.questions} />
              <DisplayPassages passages={test.passages} />
            </Box>
          </div>
          <Grid item xs={8}>
            <Button variant="contained" color="primary" onClick={printDocument}>
              Download Report
            </Button>
          </Grid>
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
        <span style={{ fontWeight: "bold" }}>Questions</span>{" "}
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
  const score = question.score[0].map((_, colIndex) =>
    question.score.map((row) => row[colIndex])
  );
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
        <p style={{ fontWeight: "bold" }}>Score</p>
      </Typography>
      <Typography variant="body2">
        <span style={{ fontWeight: "bold" }}>Syllable count:</span>
        &nbsp;&nbsp;&nbsp;
        {score[0].length}{" "}
        <table>
          <tr>
            <td style={{ fontWeight: "bold" }}>Syllable index:</td>
            {score[0].map((item, index) => {
              return <td key={index}>{index + 1}&nbsp;&nbsp;&nbsp;</td>;
            })}
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Ones:</td>
            {score[0].map((item, index) => {
              return <td key={index}>{item}</td>;
            })}
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Zeros:</td>
            {score[1].map((item, index) => {
              return <td key={index}>{item}</td>;
            })}
          </tr>
        </table>
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
        <span style={{ fontWeight: "bold" }}>Passages</span>{" "}
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
  // transpose the passage.score array
  const score = passage.score[0].map((_, colIndex) =>
    passage.score.map((row) => row[colIndex])
  );

  console.log(score);

  return (
    <div>
      <Typography component="h1" variant="h5">
        {passage.text}
      </Typography>
      <audio controls>
        <source src={passage.source} type="audio/webm" controls />
      </audio>

      <Typography variant="body1">
        <p style={{ fontWeight: "bold" }}>Score</p>
      </Typography>
      <Typography variant="body2">
        <span style={{ fontWeight: "bold" }}>Syllable count:</span>
        &nbsp;&nbsp;&nbsp;
        {score[0].length}{" "}
        <table>
          <tr>
            <td style={{ fontWeight: "bold" }}>Syllable index:</td>
            {score[0].map((item, index) => {
              return <td key={index}>{index + 1}&nbsp;&nbsp;&nbsp;</td>;
            })}
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Ones:</td>
            {score[0].map((item, index) => {
              return <td key={index}>{item}</td>;
            })}
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Zeros:</td>
            {score[1].map((item, index) => {
              return <td key={index}>{item}</td>;
            })}
          </tr>
        </table>
      </Typography>

      <Divider />
      <br />
    </div>
  );
};
