import { Button, Grid, TextField } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import "./logReg.css";

const Login = ({ toggleForm }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const formContainerRef = useRef(null);

    useEffect(() => {
        const formContainerHeight = formContainerRef.current.clientHeight;
        const toggleButton = document.querySelector(".toggleButton");
            if (toggleButton) {
        toggleButton.style.height = `${formContainerHeight}px`;
        }
    }, []);

    useEffect(() => {
        document.querySelector(".form-container").classList.toggle("flipLog");
    }, []);

    useEffect(() => {
        const toggleButton = document.querySelector(".toggleButton")
        if (toggleButton) {
            toggleButton.classList.toggle("slideLog");
            toggleButton.addEventListener("animationend", () => {
                toggleButton.style.zIndex = 0;
            });
        }
    }, []);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(inputs);

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
            <Grid item xs={12} sm={4} className="form-container" ref={formContainerRef}>
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
                <Button onClick={toggleForm} variant="contained" className="toggleButton">Register</Button>
            </div>
        </Grid>
    );
};

export default Login;
