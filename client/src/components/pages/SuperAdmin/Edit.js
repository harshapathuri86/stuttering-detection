import React, { useEffect } from "react";
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

export function Edit() {
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
  //   <ThemeProvider theme={theme}>
  //     <Container component="main" maxWidth="xs">
  //       <CssBaseline />
  //       <Box
  //         sx={{
  //           marginTop: 8,
  //           display: "flex",
  //         }}
  //       >
  //         <Typography component="h1" variant="h5">
  //           Welcome to your dashboard, {user.username} !
  //         </Typography>
  //       </Box>
  //       <Box
  //         sx={{
  //           marginTop: 8,
  //           display: "flex",
  //         }}
  //       >
  //         <Typography component="h1" variant="h5">
  //           You are logged in as SUPERADMIN.
  //         </Typography>
  //       </Box>
  //       <Box sx={{ width: "100%" }}>
  //         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
  //           <Tabs
  //             value={value}
  //             onChange={handleChange}
  //             aria-label="basic tabs example"
  //           >
  //             <Tab label="Doctors" {...a11yProps(0)} />
  //             <Tab label="Patients" {...a11yProps(1)} />
  //           </Tabs>
  //         </Box>
  //         <TabPanel value={value} index={0}>
  //           <DoctorsList />
  //         </TabPanel>
  //         <TabPanel value={value} index={1}>
  //           <PatientsList key={1} user={user} />
  //         </TabPanel>
  //       </Box>
  //       {/* <DoctorsList/> */}
  //     </Container>
  //   </ThemeProvider>
  // );
  <ThemeProvider theme={theme}>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box mt={8} display="flex" justifyContent="center">
          <Typography variant="h5">
            Welcome to your dashboard, {user.username}!
          </Typography>
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <Typography variant="h5">
            You are logged in as SUPERADMIN.
          </Typography>
        </Box>
        <Box width="100%" mt={4}>
          <Box borderBottom={1} borderColor="divider">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              centered
            >
              <Tab label="Doctors" {...a11yProps(0)} />
              <Tab label="Patients" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <DoctorsList />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PatientsList key={1} user={user} />
          </TabPanel>
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
          // "Access-Control-Allow-Origin": "*"
        },
      })
      .then((res) => {
        // console.log("tests", res.data);
        // console.log("tests", tests);
        setdoctors(res.data.doctors);
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
      {doctors.map((test) => (
        // console.log(test.id)
        <UserCard key={test.id} test={test} />
      ))}
    </Container>
    // </div>
  );
}

const PatientsList = ({ user }) => {
  const [patients, setpatients] = React.useState([]);

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
        // console.log(test.id)
        <UserCard key={test.id} user={user} />
      ))}
    </Container>
    // </div>
  );
};

const UserCard = ({ user }) => {
  // return (
  //   <Card
  //     sx={{
  //       marginTop: 8,
  //       display: "flex",
  //       flexDirection: "row",
  //     }}
  //   >
  //     {/* <Grid> */}
  //     <Grid item xs={8}>
  //       <TextField
  //         required
  //         id="outlined-required"
  //         label="UserName"
  //         defaultValue={user.username}
  //       />
  //     </Grid>
  //     <Grid item xs={8}>
  //       <TextField
  //         required
  //         id="outlined-required"
  //         label="Email"
  //         defaultValue={user.email}
  //       />
  //     </Grid>
  //   </Card>
  //   // </Grid>
  // );
  return (
    <Card
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Grid item xs={8}>
        <TextField
          required
          id="outlined-required"
          label="UserName"
          defaultValue={user.username}
          InputProps={{
            style: { color: "#333" },
            onBlur: (event) => {
              event.target.style.color = "#333";
            },
            onFocus: (event) => {
              event.target.style.color = "#00BFFF";
            },
          }}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          required
          id="outlined-required"
          label="Email"
          defaultValue={user.email}
        />
      </Grid>
    </Card>
  );
  
};
