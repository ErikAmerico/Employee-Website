import React, { useState } from "react";
import { TextField, Grid, Button } from "@mui/material";
import "./logReg.css";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

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
            <Grid item xs={12} sm={6} className="form-container">
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
                            Login
                        </Button>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default Login;
