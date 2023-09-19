import { useMutation } from "@apollo/client";
import { Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Auth from "../../utils/auth";
import { LOGIN } from "../../utils/mutations";
import "./logReg.css";


const Login = ({ toggleForm }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const [loginUser, { error }] = useMutation(LOGIN);
    const formContainerRef = useRef(null);


       const handleResize = () => {
           const screenWidth = window.innerWidth;
           const formContainerHeight = formContainerRef.current.clientHeight;
           const formContainerWidth = formContainerRef.current.clientWidth;
           const toggleButton = document.querySelector(".toggleButton");
           const registrationButton = document.querySelector("#registration-button")

           if (screenWidth < 600) {
               registrationButton.classList.add("slideDown");
            if (toggleButton) {
               toggleButton.style.width = `${formContainerWidth}px`;
                toggleButton.style.height = null;
                toggleButton.addEventListener("animationend", () => {
                toggleButton.style.zIndex = 0;
            });
            }
               document.querySelector(".form-container").classList.toggle("flip");
        } else {
            if (toggleButton) {
                toggleButton.style.height = `${formContainerHeight}px`;
                toggleButton.style.width = null;
            }


            document.querySelector(".form-container").classList.toggle("flip");


    useEffect(() => {
        const toggleButton = document.querySelector(".toggleButton");


    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(inputs);

        if (!inputs.password || !inputs.email) {
            setErrorMessage("Both fields are required.");
            return;
        }

        try {
            const { data } = await loginUser({
                variables: {
                    email: inputs.email,
                    password: inputs.password,
                },
            });

            if (data && data.login && data.login.token) {
                Auth.login(data.login.token);

                console.log("Successful login!");
            } else {
                setErrorMessage(
                    "Login failed. Please check your email and password."
                );
            }
        } catch (error) {
            console.error("Error logging in:", error.message);
        }

        setErrorMessage("");
        setInputs({
            email: "",
            password: "",
        });
    };

    return (
        <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "100vh" }}
        >

            <Grid item
                xs={10}
                sm={8}
                md={4}
                className="form-container"
                ref={formContainerRef} id="login-form">

                <h1>Login Form</h1>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="email"
                        value={inputs.email}
                        onChange={handleChange}
                        type={"email"}
                        placeholder="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                    <TextField
                        name="password"
                        value={inputs.password}
                        onChange={handleChange}
                        type={"password"}
                        placeholder="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />

                    <Grid container justifyContent="center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="submit-button"
                        >
                            Submit
                        </Button>
                    </Grid>
                </form>
            </Grid>
            <div className="toggle-button-container">
                <Button
                    onClick={toggleForm}
                    variant="contained"
                    className="toggleButton"
                    id="registration-button"
                >
                    Register
                </Button>
            </div>
        </Grid>
    );
};

export default Login;
