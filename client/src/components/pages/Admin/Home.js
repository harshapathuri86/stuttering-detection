import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
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
import styled from "styled-components";

export const theme = createTheme();


// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 1,
        '&[hidden]': {
          display: 'none',
        },
      }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
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
    // if (user.usertype !== 0 || user.usertype === 1) window.location.href = "/";
    setUser(user);
    console.log("user", user);
  }, []);

  // return (
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
  //           You are logged in as ADMIN.
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
  //           <PatientsList />
  //         </TabPanel>
  //       </Box>
  //       {/* <DoctorsList/> */}
  //     </Container>
  //   </ThemeProvider>
  // );
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h5" align="center" sx={{ mt: 4 }}>
            {`Welcome to your dashboard, ${user.username}!`}
          </Typography>
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            {"You are logged in as ADMIN."}
          </Typography>
        </Box>
        <Box sx={{ width: "100%", mt: 4 }}>
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

  // return (
  //   <Container component="main" maxWidth="sm">
  //     {/* <div> */}
  //     {doctors.map((test) => (
  //       // console.log(test.id)
  //       <UserCard key={test.id} test={test} />
  //     ))}
  //   </Container>
  //   // </div>
  // );
  return (
    <Container component="main" maxWidth="sm">
      {doctors.map((test) => (
        <Card
          key={test.id}
          sx={{
            maxWidth: "100%",
            width: "100%",
            mb: 2,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
          onClick={() => window.location.href=`/user/${test.id}`}
        >
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
              {test.username}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#777" }}>
              {test.email}
            </Typography>
          </Box>
        </Card>
      ))}
    </Container>
  );
  
}

export function PatientsList() {
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
      {patients.map((test) => (
        <Card
          key={test.id}
          sx={{
            maxWidth: "100%",
            width: "100%",
            mb: 2,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
          onClick={() => window.location.href=`/user/${test.id}`}
        >
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
              {test.username}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#777" }}>
              {test.email}
            </Typography>
          </Box>
        </Card>
      ))}
    </Container>
  );
}

const StyledCard = styled(Card)`
  margin-top: 32px;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const UserText = styled(Typography)`
  display: inline-block;
  font-size: 18px;
  font-weight: 500;
  color: #212121;
  margin-right: 12px;
  width: 60%;
`;

const EmailText = styled(Typography)`
  display: inline-block;
  font-size: 14px;
  color: #757575;
`;

const UserCard = ({ test }) => {
  const handleClick = () => {
    window.location.href = `/user/${test.id}`;
  };

  return (
    <StyledCard onClick={handleClick} className="UserCard">
      <Grid container alignItems="center" style={{flexWrap: 'wrap'}}>
        <Grid item xs={12} sm={8}>
          <UserText variant="h5" component="h2">
            {test.username}
          </UserText>
          <EmailText variant="body2" component="p">
            {test.email}
          </EmailText>
        </Grid>
      </Grid>
    </StyledCard>
  );
};
