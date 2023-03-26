import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "@mui/material";
import { AppBlockingOutlined, Language, Logout } from "@mui/icons-material";
export default function NavBar() {
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setAuth(false);
    localStorage.clear();
    window.location.href = "/";
  };

  const handleProfile = () => {
    setAnchorEl(null);
    window.location.href = "/profile";
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.usertype === 0) {
      window.location.href = "/superadmin";
    } else if (user.usertype === 1) {
      window.location.href = "/admin";
    } else if (user.usertype === 2) {
      window.location.href = "/doctor";
    } else if (user.usertype === 2) {
      window.location.href = "/patient";
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    //   if user in local storage
    if (localStorage.getItem("user")) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  // return (
  //   <div>
  //     {auth && (
  //       <Box sx={{ flexGrow: 1 }}>
  //         <AppBar position="static">
  //           <Toolbar>
  //             <IconButton
  //               size="large"
  //               edge="start"
  //               color="inherit"
  //               aria-label="menu"
  //               sx={{ mr: 2 }}
  //             >
  //               <Language />
  //             </IconButton>

  //             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
  //               <Button
  //                 variant="text"
  //                 color="inherit"
  //                 onClick={toDashboard}
  //                 sx={{ mr: 2 }}
  //               >
  //                 Dashboard
  //               </Button>
  //               <Button
  //                 variant="text"
  //                 color="inherit"
  //                 href="/profile"
  //                 sx={{ mr: 2 }}
  //               >
  //                 Profile
  //               </Button>
  //             </Typography>
  //             <Button
  //               variant="text"
  //               color="inherit"
  //               onClick={handleLogout}
  //               sx={{ mr: 2 }}
  //             >
  //               Logout
  //             </Button>
  //             {/* <div>
  //               <IconButton
  //                 size="large"
  //                 aria-label="account of current user"
  //                 aria-controls="menu-appbar"
  //                 aria-haspopup="true"
  //                 onClick={handleMenu}
  //                 color="inherit"
  //               >
  //                 <SettingsIcon />
  //               </IconButton>
  //               <Menu
  //                 id="menu-appbar"
  //                 anchorEl={anchorEl}
  //                 anchorOrigin={{
  //                   vertical: "top",
  //                   horizontal: "right",
  //                 }}
  //                 keepMounted
  //                 transformOrigin={{
  //                   vertical: "top",
  //                   horizontal: "right",
  //                 }}
  //                 open={Boolean(anchorEl)}
  //                 onClose={handleClose}
  //               >
  //                 <MenuItem onClick={handleProfile}>Profile</MenuItem>
  //                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
  //               </Menu>
  //             </div> */}
  //           </Toolbar>
  //         </AppBar>
  //       </Box>
  //     )}
  //   </div>
  // );
  return (
    <div>
      {auth && (
        <AppBar position="static" style={{ backgroundColor: '#289' }}>
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <Language />
              </IconButton>
  
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={toDashboard}
                  style={{ marginRight: '20px' }}
                >
                  Dashboard
                </Button>
                <Button variant="text" color="inherit" href="/profile">
                  Profile
                </Button>
              </Typography>
            </div>
  
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
  variant="contained"
  // color="pink"
  onClick={handleLogout}
  style={{
    marginLeft: '20px',
    borderRadius: '20px',
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: 'bold',
    letterSpacing: '1px',
  }}
>
  Logout
</Button>
              {/* <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <SettingsIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </div> */}
            </div>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
  // return (
  //   <div>
  //     {auth && (
  //       <Box sx={{ flexGrow: 1 }}>
  //         <AppBar position="static" sx={{ backgroundColor: "#00695C" }}>
  //           <Toolbar>
  //             <IconButton
  //               size="large"
  //               edge="start"
  //               color="inherit"
  //               aria-label="menu"
  //               sx={{ mr: 2 }}
  //             >
  //               <Language sx={{ fontSize: "2rem" }} />
  //             </IconButton>

  //             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
  //               <Button
  //                 variant="text"
  //                 color="inherit"
  //                 onClick={toDashboard}
  //                 sx={{
  //                   mr: 2,
  //                   fontWeight: auth ? "bold" : "normal",
  //                   color: "#FFFFFF",
  //                 }}
  //               >
  //                 Dashboard
  //               </Button>
  //               <Button
  //                 variant="text"
  //                 color="inherit"
  //                 href="/profile"
  //                 sx={{ mr: 2, color: "#FFFFFF" }}
  //               >
  //                 Profile
  //               </Button>
  //             </Typography>
  //             <Button
  //               variant="contained"
  //               color="secondary"
  //               onClick={handleLogout}
  //               sx={{ mr: 2 }}
  //             >
  //               Logout
  //             </Button>
  //           </Toolbar>
  //         </AppBar>
  //       </Box>
  //     )}
  //   </div>
  // );
}
