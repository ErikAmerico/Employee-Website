import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Modal,
    TextField,
    Fade,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER, ADD_USER_TO_COMPANY, REMOVE_COMPANY, CREATE_MSG_CNT } from "../utils/mutations";
import { GET_PREV_CHAT_MESSAGES, HAS_NEW_MESSAGES } from "../utils/queries";
import AuthService from "../utils/auth";

import Avatar from '@mui/material/Avatar';
import { styled } from "@mui/material/styles";
import { useQuery } from "@apollo/client";
import { GET_USERS_BY_COMPANY } from "../utils/queries";
import { useGlobalContext } from "../utils/globalContext";

const classes = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  fontSize: "16px",
}));

const Header = () => {
    // State for the profile menu
    const [anchorEl, setAnchorEl] = useState();
    const [userName, setUserName] = useState();
    const [userRole, setUserRole] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [showDeleteCompanyModal, setShowDeleteCompanyModal] = useState(false);
    const [createUser, { error }] = useMutation(CREATE_USER);
    const [addUserToCompany] = useMutation(ADD_USER_TO_COMPANY);
    const [removeCompany] = useMutation(REMOVE_COMPANY);
    const [createMsgCnt] = useMutation(CREATE_MSG_CNT); 
    const { hasUnreadMessages, setHasUnreadMessages } = useGlobalContext();
    const [msgCntAtLogOut, setMsgCntAtLogOut] = useState();
    const [userId, setUserId] = useState('');
    const companyId = localStorage.getItem("company_id");
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [unreadMessages, setUnreadMessages] = useState(false);
    //const [addUserErrorMessage, setAddUserErrorMessage] = useState("");

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        if (hasUnreadMessages && screenWidth <= 790) {
            setUnreadMessages(true);
        } else {
            setUnreadMessages(false);
        }
  }, [hasUnreadMessages, screenWidth]);

    useEffect(() => {
        if (location.pathname === "/chat" && hasUnreadMessages) {
            setHasUnreadMessages(false);
        }
    }, [location, hasUnreadMessages, setHasUnreadMessages]);

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
    });

    useEffect(() => {
        if (AuthService.loggedIn()) {
            const profile = AuthService.getProfile();
            const firstName = profile.data.firstName;
            const lastName = profile.data.lastName;
            const role = profile.data.role;
            setUserId(profile.data._id);
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

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl();
    };

    const { data: newMessages } = useQuery(HAS_NEW_MESSAGES, {
        variables: { companyId: companyId, userId: userId },
    });

    useEffect(() => {
    if (newMessages?.hasNewMessages) {
        setHasUnreadMessages(true);
    }
    }, [newMessages, setHasUnreadMessages]);

    
    const handleLogout = async () => {
      await createMsgCnt({
      variables: { companyId: companyId, userId: userId, count: msgCntAtLogOut },
    });

    AuthService.logout();
    handleMenuClose();
    localStorage.removeItem("company_id");
  };
  
    const { data: Msgs4MsgCount, loading: currLoading } = useQuery(GET_PREV_CHAT_MESSAGES, {
        variables: { companyId },
    });
    
  useEffect(() => {
    if (Msgs4MsgCount && Msgs4MsgCount.getChatMessages) {
        const chatMessagesArray = Object.values(Msgs4MsgCount.getChatMessages);
        const messageCount = chatMessagesArray.length;
        setMsgCntAtLogOut(messageCount);
    }
  }, [Msgs4MsgCount, msgCntAtLogOut, handleLogout]);

    const handleAddUserClick = () => {
        setShowModal(true);
        handleMenuClose();
    };


    const handleModalSubmit = async () => {
        try {
            // if (!modalData.firstName || !modalData.lastName || !modalData.role || !modalData.title || !modalData.email || !modalData.phone || !modalData.password) {
            //     setAddUserErrorMessage("All fields are required.");
            //     return;
            // }

            const userResponse = await createUser({
                variables: { ...modalData, companyId: companyId, profileImage: initials, role: selectedRole },
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
                    });
                    //setAddUserErrorMessage("");
                    setShowModal(false);
                    navigate("/users");
            });
        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }
    };

    const initials = userName ? `${userName.split(" ")[0][0]}${userName.split(" ")[1][0]}` : "";

    const modalContent = (
        <div className="modal-container">
            <div className="modal-content">
                <h2>Employee Information</h2>
                {/* {addUserErrorMessage && <div className="error-message">{addUserErrorMessage}</div>} */}
                <TextField
                    name="firstName"
                    value={modalData.firstName}
                    onChange={handleModalInputChange}
                    type="text"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="lastName"
                    value={modalData.lastName}
                    onChange={handleModalInputChange}
                    type="text"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="role">Role</InputLabel>
                    <Select
                        id="role"
                        label="Role"
                        value={selectedRole}
                        onChange={handleRoleChange}
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Employee">Employee</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    name="title"
                    value={modalData.title}
                    onChange={handleModalInputChange}
                    type="text"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="email"
                    value={modalData.email}
                    onChange={handleModalInputChange}
                    type="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="phone"
                    value={modalData.phone}
                    onChange={handleModalInputChange}
                    onKeyDown={(e) => {
                        if (!/^\d+$/.test(e.key) && !['Tab', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                        e.preventDefault();
                        }
                    }}
                    type="tel"
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="password"
                    value={modalData.password}
                    onChange={handleModalInputChange}
                    type="password"
                    label="Password"
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

    const handleDeleteCompanyClick = () => {
        setShowDeleteCompanyModal(true);
        handleMenuClose();
    };

    const handleConfirmDeleteCompany = () => {
        removeCompany({
            variables: { companyId },
        })
        .then(() => {
            setShowDeleteCompanyModal(false);
            AuthService.logout();
            localStorage.removeItem("company_id");
        });
    };

    const handleCancelDeleteCompany = () => {
        setShowDeleteCompanyModal(false);
    };

    const deleteCompanyModalContent = (
          <div className="modal-container">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>All content associated with this organization will be erased upon confirmation</p>
              <div className="button-container">
                <Button
                  onClick={handleConfirmDeleteCompany}
                  variant="contained"
                  color="primary"
                  className="submit-button"
                >
                  Confirm
                </Button>
                <Button
                  onClick={handleCancelDeleteCompany}
                  variant="contained"
                  color="warning"
                  className="close-button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
    );

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
        };
    }, []);

    const smallScreenMenuItems = [
        <MenuItem
            key="announcements"
            component={Link}
            to="/announcements"
            onClick={handleMenuClose}
        >
            Announcements
        </MenuItem>,
        <MenuItem
            key="users"
            component={Link}
            to="/users"
            onClick={handleMenuClose}
        >
            Users
        </MenuItem>,
        <MenuItem
            key="chat"
            component={Link}
            to="/chat"
            onClick={handleMenuClose}
            sx={{ backgroundColor: hasUnreadMessages ? "#6669ad" : "white" }}
        >
            Chat
        </MenuItem>,
    ];
    
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
                            src="../src/assets/images/componnect-nobg.png"
                            alt="Company Logo"
                            style={{
                                height: "auto",
                                width: "150px",
                                marginRight: "",
                                marginTop: 6,
                            }}
                        />
                    </Link>
                </Typography>

                {/* Navigation Links */}
                {AuthService.loggedIn() && screenWidth > 790 &&  (
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
                            sx={{ backgroundColor: hasUnreadMessages ? "#6669ad" : "#134074", color: "white" }}
                        >
                            Chat
                        </Button>
                    </Typography>
            )}
                    
                {(userName && screenWidth > 415) ? (
                    <Typography variant="h6" component="div">
                        {userName}
                    </Typography>
                    ) : null}
                    
                {!userName && (
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
                            <Avatar className={classes.avatar} sx={{
                                //bgcolor: "white",
                                backgroundColor: unreadMessages ? "#6669ad" : "white",
                                color: unreadMessages ? "white" : "#144074",
                                border: "3px solid gray",
                                fontWeight: unreadMessages ? "normal" : "bold",
                                textShadow: "0px 0px 12px black",
                            }}>
                            {initials}
                        </Avatar>
                    </IconButton>
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                        {screenWidth <= 790 && smallScreenMenuItems}
                        {userRole.some(role => role === "Admin" || role === "Owner") && [
                        <MenuItem key="addUzer" onClick={handleAddUserClick}>Add User</MenuItem>
                    ]}
                    <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        {userRole.includes("Owner") && [
                        <MenuItem 
                          key="delComp"
                          onClick={handleDeleteCompanyClick}
                          style={{ fontSize: "12px", color: "white", backgroundColor: "red", borderRadius: "5px" }}
                          >Disband Company
                          </MenuItem>
                    ]}
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
            {showDeleteCompanyModal && (
            <Modal
                key="delCompModal"
                open={showDeleteCompanyModal}
                onClose={() => setShowDeleteCompanyModal(false)}
                closeAfterTransition
                >
                <Fade in={showDeleteCompanyModal}>
                    {deleteCompanyModalContent}
                </Fade>
            </Modal>
            )}
            </>
    );
};

export default Header;
