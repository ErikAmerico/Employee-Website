import { Button, Fade, Grid, Modal, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./logReg.css";

import { useMutation } from "@apollo/client";
import { CREATE_COMPANY, CREATE_USER, ADD_USER_TO_COMPANY } from "../../utils/mutations";

const Register = ({ toggleForm }) => {
    const [inputs, setInputs] = useState({
        name: "",
        type: "",
        logo: "",
    });
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
    const [createCompany, { error }] = useMutation(CREATE_COMPANY);
    const [createUser, { error2 }] = useMutation(CREATE_USER);
    const [addUserToCompany] = useMutation(ADD_USER_TO_COMPANY);
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

           const userResponse =  await createUser({
                variables: { ...modalData, company:  companyId },
           })
             
          const userId = userResponse.data.createUser.user._id;
          
          addUserToCompany({
                variables: { companyId, userId },
          })
            .then((res) => {
              console.log("usr added to company", res);
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

                setInputs({
                    name: "",
                    type: "",
                    logo: "",
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
                    <TextField
                        name="logo"
                        value={inputs.logo}
                        onChange={handleChange}
                        type={"text"}
                        placeholder="Company Logo"
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
