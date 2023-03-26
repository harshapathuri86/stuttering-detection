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
import { Card,CardContent } from "@mui/material";
// import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';



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
        <Box sx={{ marginTop: 2, backgroundColor: "#f5f5f5", padding: 2 }}>
          {children}
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
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
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
        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h1" variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
            Welcome to your dashboard, {user.username}!
          </Typography>
          <Typography component="h2" variant="h5" sx={{ marginBottom: 4, color: theme.palette.secondary.main }}>
            You are logged in as SUPERADMIN.
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
                sx={{ backgroundColor: theme.palette.background.paper }}
              >
                <Tab label="Doctors" {...a11yProps(0)} sx={{ fontWeight: 'bold' }} />
                <Tab label="Patients" {...a11yProps(1)} sx={{ fontWeight: 'bold' }} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <DoctorsList />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PatientsList />
            </TabPanel>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );

}

export function DoctorsList() {
  const [doctors, setdoctors] = React.useState([]);

  useEffect(() => {
    // console.log("token", localStorage.getItem("access_token"));
    axios
      .get("http://localhost:5000/doctors", {
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
      {doctors.map((test) => (
        <UserCard key={test.id} test={test} />
      ))}
    </Container>
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
      .get("http://localhost:5000/patients", {
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
          <UserCard key={test.id} test={test}  />
          <div id="butt"></div>
        </div>
      ))}
    </Container>
    // </div>
  );
  // return (
  //   <Container component="main" maxWidth="sm">
  //     {patients.map((test) => (
  //       <div style={{ marginBottom: "20px" }}>
  //         <Card sx={{ minWidth: 275 }}>
  //           <CardContent>
  //             <Typography variant="h5" component="h2">
  //               {test.name}
  //             </Typography>
  //             <Typography sx={{ mb: 1.5 }} color="text.secondary">
  //               {test.gender}
  //             </Typography>
  //             <Typography variant="body2">
  //               {test.email} <br />
  //               {test.phone}
  //             </Typography>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     ))}
  //   </Container>
  // );
}

const UserCard = ({ test }) => {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const handleClick = () => {
    window.location.href = `/user/${test.id}`;
  };
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
    axios("http://localhost:5000/doctors/edit", {
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
    axios("http://localhost:5000/doctors/edit2", {
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
  function deleteUser(id) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
    axios(`http://localhost:5000/doctors/${id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((res) => {
        console.log("success");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return ( 
    <Card sx={{marginTop:2,display:"flex",flexDirection:"row",alignItems:"center",padding:"1rem",boxShadow:"0px 4px 10px rgba(0, 0, 0, 0.5)",borderRadius:"10px"}}>
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={6}>
      <Typography variant="h5" component="h2">
        {test.username}
        <IconButton size="small" onClick={handleOpen2} sx={{ bgcolor: "#e0e0e0", ml: "0.5rem" }}><EditIcon sx={{ color: "grey" }} /></IconButton>
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" component="p">
        {test.email}
        <IconButton size="small" onClick={handleOpen2} sx={{ bgcolor: "#e0e0e0", ml: "0.5rem" }}><EditIcon sx={{ color: "" }} /></IconButton>
      </Typography>
    </Grid>
  </Grid>
  <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
    <Box sx={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
      <Card sx={{p:2}}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:2}}>Edit username</Typography>
        <TextField id="standard-basic" label="Username" variant="outlined" fullWidth value={textInput} onChange={handleTextInputChange} sx={{mb:2}}/>
        <Box sx={{display:"flex",justifyContent:"flex-end"}}>
          <Button variant="contained" onClick={handleClose} sx={{mr:1}}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={() => {edit_name(test.username);handleClose();}}>Save</Button>
        </Box>
      </Card>
    </Box>
  </Modal>
  <Modal open={open2} onClose={handleClose2} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
    <Box sx={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
      <Card sx={{p:2}}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:2}}>Edit email</Typography>
        <TextField id="standard-basic" label="Email" variant="outlined" fullWidth value={textInput2} onChange={handleTextInputChange2} sx={{mb:2}}/>
        <Box sx={{display:"flex",justifyContent:"flex-end"}}>
          <Button variant="contained" onClick={handleClose2} sx={{mr:1}}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={() => {edit_email(test.email);handleClose2();}}>Save</Button>
        </Box>
      </Card>
    </Box>
  </Modal>
</Card>
  );  
};
