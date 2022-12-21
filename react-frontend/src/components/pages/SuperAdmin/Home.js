import React, { useRef, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Context from "@mui/base/TabsUnstyled/TabsContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import { Card } from "@mui/material";
// import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";

export const theme = createTheme();

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function Home() {
  const [user, setUser] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (!localStorage.getItem("user")) window.location.href = "/";
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.usertype !== 0 || user.usertype === 1) window.location.href = "/";
    setUser(user);
    console.log("user", user);
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
            You are logged in as SUPERADMIN.
          </Typography>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Doctors" {...a11yProps(0)} />
              <Tab label="Patients" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <DoctorsList />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PatientsList />
          </TabPanel>
        </Box>
        {/* <DoctorsList/> */}
      </Container>
    </ThemeProvider>
  );
}

export function DoctorsList() {
  const [doctors, setdoctors] = React.useState([]);

  useEffect(() => {
    // console.log("token", localStorage.getItem("access_token"));
    axios
      .get("/api/doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setdoctors(res.data.doctors);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      {/* <div> */}
      {doctors.map((test) => (
        // console.log(test.id)
        <UserCard key={test.id} test={test} />
      ))}
    </Container>
    // </div>
  );
}

export function PatientsList() {
  const [patients, setpatients] = React.useState([]);
  const [edit, setedit] = React.useState([]);
  function handleClick(test) {
    console.log("yo");
    console.log(test);
  }

  useEffect(() => {
    // console.log("token", localStorage.getItem("access_token"));
    axios
      .get("/api/patients", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        // console.log("tests", res.data);
        // console.log("tests", tests);
        setpatients(res.data.patients);
        // window.location.reload();
        // console.log(tests, "here");
        // convert string to array of objects
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      {/* <div> */}
      {patients.map((test) => (
        <div>
          <UserCard key={test.id} test={test} />
          <div id="butt"></div>
        </div>
      ))}
    </Container>
    // </div>
  );
}

const UserCard = ({ test }) => {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpen2 = () => setOpen2(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const [textInput, setTextInput] = useState("");
  const [textInput2, setTextInput2] = useState("");

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };
  const handleTextInputChange2 = (event) => {
    setTextInput2(event.target.value);
  };
  const nusername = useRef("");
  function edit_name(username) {
    console.log("rann");
    const article = JSON.stringify({
      param: username,
      param2: textInput,
    });
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
    axios("/api/doctors/edit", {
      method: "POST",
      data: article,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        window.location.reload();
        handleClose();
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function edit_email(email) {
    console.log("rann");
    const article = JSON.stringify({
      param: email,
      param2: textInput2,
    });
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
    axios("/api/doctors/edit2", {
      method: "POST",
      data: article,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        window.location.reload();
        handleClose2();
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <Card
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* <Grid> */}
      <Grid item xs={6}>
        <Typography variant="h5" component="h2">
          {test.username}
          <Button onClick={handleOpen}>
            <EditIcon />
          </Button>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2" component="p">
          {test.email}
          <Button onClick={handleOpen2}>
            <EditIcon />
          </Button>
        </Typography>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={{ position: "absolute", left: "40%", top: "40%" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <TextField
              id="standard-basic"
              label="Standard"
              variant="standard"
              value={textInput}
              onChange={handleTextInputChange}
            />
            <Button
              onClick={() => {
                edit_name(test.username);
                handleClose();
              }}
            >
              OK
            </Button>
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={{ position: "absolute", left: "40%", top: "40%" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <TextField
              id="standard-basic"
              label="Standard"
              variant="standard"
              value={textInput2}
              onChange={handleTextInputChange2}
            />
            <Button
              onClick={() => {
                edit_email(test.email);
                handleClose2();
              }}
            >
              OK
            </Button>
          </Typography>
        </Box>
      </Modal>
    </Card>
    // </Grid>
  );
};
