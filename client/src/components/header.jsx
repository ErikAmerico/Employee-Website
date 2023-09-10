import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthService from "../utils/auth";

//import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
    // State for the profile menu
    const [anchorEl, setAnchorEl] = useState();
    const [userName, setUserName] = useState();

    useEffect(() => {
        if (AuthService.loggedIn()) {
            const profile = AuthService.getProfile();
            setUserName(profile.name);
        }
    }, []);

    // Open profile menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close profile menu
    const handleMenuClose = () => {
        setAnchorEl();
    };

    return (
        <AppBar
            position="sticky"
            sx={{ borderRadius: 2, backgroundColor: "#8da9c4" }}
        >
            <Toolbar>
                {/* Company Logo */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/">
                        <img
                            src="/images/genLogo.png"
                            alt="Company Logo"
                            style={{
                                height: "60px",
                                marginRight: "",
                                marginTop: 6,
                            }}
                        />
                    </Link>
                </Typography>

                {/* Navigation Links */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button
                        component={Link}
                        color="info"
                        variant="outlined"
                        to="/announcements"
                        sx={{
                            marginRight: 2,
                            backgroundColor: "#134074",
                            color: "white",
                        }}
                    >
                        Announcements
                    </Button>
                    <Button
                        component={Link}
                        color="info"
                        variant="outlined"
                        to="/users"
                        sx={{
                            marginRight: 2,
                            backgroundColor: "#134074",
                            color: "white",
                        }}
                    >
                        Users
                    </Button>
                    <Button
                        component={Link}
                        color="info"
                        variant="outlined"
                        to="/chat"
                        sx={{ backgroundColor: "#134074", color: "white" }}
                    >
                        Chat
                    </Button>
                </Typography>

                {/* Logged in user name */}
                {/* {userName} */}

                {/* Display user's name or login/create-company button */}
                {userName ? (
                    <Typography variant="h6" component="div">
                        {userName}
                    </Typography>
                ) : (
                    <Button
                        component={Link}
                        to="/loginRegister"
                        color="inherit"
                    >
                        Login/Register
                    </Button>
                )}

                {/* Profile Picture and Dropdown */}
                {/* <IconButton
          edge="end"
          color="inherit"
          onClick={handleMenuOpen}
        >
          <Avatar alt="User" src="" />
        </IconButton> */}

                {AuthService.loggedIn() && (
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleMenuOpen}
                    >
                        <Avatar alt="User" src="" />
                    </IconButton>
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
