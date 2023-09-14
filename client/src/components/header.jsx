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
    Modal,
    TextField,
    Fade,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {CREATE_USER, ADD_USER_TO_COMPANY } from "../utils/mutations";
import AuthService from "../utils/auth";

//import MenuIcon from '@mui/icons-material/Menu';
import { useQuery } from "@apollo/client";
import { GET_USERS_BY_COMPANY } from "../utils/queries";

const Header = () => {
    // State for the profile menu
    const [anchorEl, setAnchorEl] = useState();
    const [userName, setUserName] = useState();
    const [userRole, setUserRole] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [createUser, { error }] = useMutation(CREATE_USER);
    const [addUserToCompany] = useMutation(ADD_USER_TO_COMPANY);

    const { refetch } = useQuery(GET_USERS_BY_COMPANY, {
        variables: { companyId: localStorage.getItem('company_id') },
        skip: true, // Set skip to true to prevent automatic fetching
    });

    const triggerRefetch = () => {
        refetch();
    };

    const [modalData, setModalData] = useState({
        firstName: "",
        lastName: "",
        role: "",
        title: "",
        email: "",
        phone: "",
        password: "",
        profileImage: "",
    });

    useEffect(() => {
        if (AuthService.loggedIn()) {
            const profile = AuthService.getProfile();
            console.log(profile)
            const firstName = profile.data.firstName;
            const lastName = profile.data.lastName;
            const role = profile.data.role;
            setUserRole(role);
            setUserName(`${firstName} ${lastName}`);
        }
    }, []);

    const handleModalInputChange = (e) => {
        setModalData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl();
    };

    const handleLogout = () => {
        AuthService.logout();
        handleMenuClose();
    };

    const handleAddUserClick = () => {
        setShowModal(true);
        handleMenuClose();
    };

    const companyId = localStorage.getItem("company_id");
    console.log("companyId", companyId);

    const handleModalSubmit = async () => {
        try {

            const userResponse = await createUser({
                variables: { ...modalData, company: companyId },
            })
             
            const userId = userResponse.data.createUser.user._id;
            console.log("USERINFOHeader", userResponse.data.createUser)

            addUserToCompany({
                variables: { companyId, userId },
            })
                .then((res) => {
                    console.log("usr added to company", res);
                    console.log('modalData', modalData);
                    triggerRefetch();
                })
                .then(() => {
                    setModalData({
                        firstName: "",
                        lastName: "",
                        role: "",
                        title: "",
                        email: "",
                        phone: "",
                        password: "",
                        profileImage: "",
                    });

                    setShowModal(false);
                });
        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }
    };


    const modalContent = (
        <div className="modal-container">
            <div className="modal-content">
                <h2>Your Information</h2>
                <TextField
                    name="firstName"
                    value={modalData.firstName}
                    onChange={handleModalInputChange}
                    type="text"
                    label="firstName"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="lastName"
                    value={modalData.lastName}
                    onChange={handleModalInputChange}
                    type="text"
                    label="lastName"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="role"
                    value={modalData.role}
                    onChange={handleModalInputChange}
                    type="text"
                    label="role"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="title"
                    value={modalData.title}
                    onChange={handleModalInputChange}
                    type="text"
                    label="title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="email"
                    value={modalData.email}
                    onChange={handleModalInputChange}
                    type="email"
                    label="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="phone"
                    value={modalData.phone}
                    onChange={handleModalInputChange}
                    type="tel"
                    label="phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="password"
                    value={modalData.password}
                    onChange={handleModalInputChange}
                    type="password"
                    label="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="profileImage"
                    value={modalData.profileImage}
                    onChange={handleModalInputChange}
                    type="text"
                    label="Profile Imag"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <div className="button-container">
                    <Button
                        onClick={handleModalSubmit}
                        variant="contained"
                        color="primary"
                        className="submit-button"
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        className="close-button"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <>
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
                    {userRole.includes("Admin") && [
                        <MenuItem key="addUzer" onClick={handleAddUserClick}>Add User</MenuItem>
                    ]}
                    <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
        {showModal && (
            <Modal
                key="uzerModal"
                open={showModal}
                onClose={() => setShowModal(false)}
                closeAfterTransition
            >
                <Fade in={showModal}>
                    {modalContent}
                </Fade>
            </Modal>
            )}
            </>
    );
};

export default Header;
