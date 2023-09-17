import { Button, Fade, Grid, Modal, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./logReg.css";

import { useMutation } from "@apollo/client";
import { CREATE_COMPANY, CREATE_USER, ADD_USER_TO_COMPANY, LOGIN } from "../../utils/mutations";
import Auth from "../../utils/auth";

const Register = ({ toggleForm }) => {
    const [inputs, setInputs] = useState({
        name: "",
        type: "",
    });
    const [modalData, setModalData] = useState({
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        phone: "",
        password: "",
    });
    const [createCompany, { error }] = useMutation(CREATE_COMPANY);
    const [createUser, { error2 }] = useMutation(CREATE_USER);
    const [addUserToCompany] = useMutation(ADD_USER_TO_COMPANY);
    const [loginUser, { error3 }] = useMutation(LOGIN);
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const formContainerRef = useRef(null);

    useEffect(() => {
        const formContainerHeight = formContainerRef.current.clientHeight;
        const toggleButton = document.querySelector(".toggleButton");
        if (toggleButton) {
            toggleButton.style.height = `${formContainerHeight}px`;
        }
    }, []);

    useEffect(() => {
        document.querySelector(".form-container").classList.toggle("flip");
    }, []);

    useEffect(() => {
        document.querySelector(".toggleButton").classList.toggle("slide");
    }, []);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleModalInputChange = (e) => {
        setModalData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleModalSubmit = async () => {
        try {
            const { data } = await createCompany({ variables: inputs });
            console.log("companyData", data);

          const companyId = data.createCompany._id;
            console.log("companyId", companyId);
            console.log("modalData", modalData)

            const userResponse = await createUser({
                variables: { ...modalData, companyId: companyId, role: 'Owner'},
           })
             
            const userId = userResponse.data.createUser.user._id;
            console.log("USERINFO", userResponse.data.createUser)

          addUserToCompany({
                variables: { companyId, userId },
          })
            .then((res) => {
                console.log("usr added to company", res);
                console.log('modalData', modalData)
            })
              .then(async() => {
                const { data } = await loginUser({
                    variables: {
                        email: modalData.email,
                        password: modalData.password,
                    },
                });
                  
                  console.log('loggin in', data)

                if (data && data.login && data.login.token) {
                    Auth.login(data.login.token);
                    console.log("Successful login!");
                } else {
                    console.log("Login failed.");
                }
                  
              })      
             .then(() => {
                setModalData({
                    firstName: "",
                    lastName: "",
                    title: "",
                    email: "",
                    phone: "",
                    password: "",
                });

                setInputs({
                    name: "",
                    type: "",
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

    return (
        <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "100vh" }}
        >
            <div className="toggle-button-container">
                <Button
                    onClick={toggleForm}
                    variant="contained"
                    className="toggleButton"
                    id="login-button"
                >
                    Login
                </Button>
            </div>
            <Grid
                item
                xs={12}
                sm={4}
                className="form-container"
              ref={formContainerRef}
              id="registration-form"
            >
                <h1>Registration</h1>
                <form onSubmit={handleFormSubmit}>
                    <TextField
                        name="name"
                        value={inputs.name}
                        onChange={handleChange}
                        type={"text"}
                        placeholder="Company Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="type"
                        value={inputs.type}
                        onChange={handleChange}
                        type={"text"}
                        placeholder="Company Type"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Grid container justifyContent="center">
                        <Button
                            onClick={handleFormSubmit}
                            variant="contained"
                            color="primary"
                            className="submit-button"
                        >
                            Continue
                        </Button>
                    </Grid>
                </form>
            </Grid>
            {showModal && (
                <Modal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    closeAfterTransition
                >
                    <Fade in={showModal}>
                        <div className="modal-container">{modalContent}</div>
                    </Fade>
                </Modal>
            )}
        </Grid>
    );
};

export default Register;
