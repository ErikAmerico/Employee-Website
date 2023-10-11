import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

export default function Home() {
    return (
        <div
            style={{
                backgroundColor: "#e0e0e0",
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Item>
                            <Typography
                                variant="h1"
                                component="div"
                                gutterBottom
                                marginTop={4}
                                sx={{
                                    fontSize: "6rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                    "@media (max-width: 600px)": {
                                        fontSize: "3rem",
                                    },
                                }}
                            >
                                CompOnnect
                            </Typography>
                            <img
                                src="/images/componnect-nobg.png"
                                alt="Employee Website Logo"
                                style={{
                                    width: "40%",
                                    marginBottom: "3rem",
                                }}
                            />
                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                Take your company to the next level with
                                Employee Website. All of your announcements,
                                events, and other important information in one
                                place.
                            </Typography>
                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                Your employees can comment on the announcements
                                to share their thoughts and ideas.
                            </Typography>
                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                Employees can join in in a group chat to discuss
                                the announcements and events or just to chat.
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item
                            style={{
                                backgroundColor: "#005FAF",
                                boxShadow: "0 0 10px 3px #005FAF",
                            }}
                        >
                            <Typography
                                variant="h2"
                                component="div"
                                gutterBottom
                            >
                                Features
                            </Typography>
                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                <ul
                                    style={{
                                        listStyleType: "none",
                                        fontSize: "2rem",
                                    }}
                                >
                                    <li
                                        style={{
                                            backgroundColor: "#4C657B",
                                            width: "fit-content",
                                            margin: "auto",
                                            border: "1px solid #005FAF",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        Post announcements, events and more.
                                    </li>
                                    <li
                                        style={{
                                            backgroundColor: "#4C657B",
                                            width: "fit-content",
                                            margin: "auto",
                                            border: "1px solid #005FAF",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        Hear from your employees
                                    </li>
                                    <li
                                        style={{
                                            backgroundColor: "#4C657B",
                                            width: "fit-content",
                                            margin: "auto",
                                            border: "1px solid #005FAF",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        Chat with everyone in the company
                                    </li>
                                    <li
                                        style={{
                                            backgroundColor: "#4C657B",
                                            width: "fit-content",
                                            margin: "auto",
                                            border: "1px solid #005FAF",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        Keep track of your employee information
                                    </li>
                                    <li
                                        style={{
                                            backgroundColor: "#4C657B",
                                            width: "fit-content",
                                            margin: "auto",
                                            border: "1px solid #005FAF",
                                            color: "white",
                                        }}
                                    >
                                        Manage who is in your company
                                    </li>
                                </ul>
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item
                            style={{
                                backgroundColor: "#6B849D",
                                boxShadow: "0 0 10px 3px #6B849D",
                                marginBottom: "1rem",
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="div"
                                gutterBottom
                            >
                                How to use
                            </Typography>
                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                <p>
                                    We strive on accessability for our clients.
                                </p>
                                <p>
                                    When registering, you will be registering
                                    yourself and the company
                                </p>
                                <p>
                                    Once you are registered, you can log in, you
                                    will have access to add members to your
                                    company.
                                </p>
                                <p>
                                    We recommend setting a temporary password
                                    for your user, that they will later change!
                                </p>
                                <p>You have full control of your company!</p>
                                {/* add link to register */}
                                <Link to="/loginRegister">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        style={{
                                            marginTop: "2rem",
                                            marginBottom: "2rem",
                                        }}
                                    >
                                        Create your account today!
                                    </Button>
                                </Link>
                            </Typography>
                        </Item>
                        <Item
                            style={{
                                backgroundColor: "#005FAF",
                                boxShadow: "0 0 10px 3px #005FAF",
                                marginBottom: "1rem",
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="div"
                                gutterBottom
                            >
                                About Us
                            </Typography>
                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                <p>
                                    We are a group of developers who are
                                    passionate about creating a better
                                    experience for employees and employers.
                                </p>
                                <p>
                                    We believe that communication is key to
                                    success, and we want to help you achieve
                                    that.
                                </p>
                                <p>
                                    We are always looking for ways to improve
                                    our website, so if you have any suggestions
                                    or comments, please let us know!
                                </p>
                                <p>
                                    We hope you enjoy using our website as much
                                    as we enjoyed creating it!
                                </p>
                            </Typography>
                        </Item>

                        <Item
                            style={{
                                backgroundColor: "#6B849D",
                                boxShadow: "0 0 10px 3px #6B849D",
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="div"
                                gutterBottom
                            >
                                What you can expect for the future
                            </Typography>

                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                <p>
                                    It is our goal to make this application as
                                    accessible as possible for everyone.
                                    <br /> We are continuously working on
                                    improving our application and adding new
                                    features.
                                </p>
                                <p>Here are some things you can expect:</p>
                                <ul
                                    style={{
                                        listStyleType: "none",
                                        fontSize: "1rem",
                                    }}
                                >
                                    <li
                                        style={{
                                            width: "fit-content",
                                            margin: "auto",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        &#x2022; Private messaging and group
                                        select messaging
                                    </li>
                                    <li
                                        style={{
                                            width: "fit-content",
                                            margin: "auto",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        &#x2022; More roles for employees such
                                        as manager, human resources and more
                                    </li>
                                    <li
                                        style={{
                                            width: "fit-content",
                                            margin: "auto",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        &#x2022; A system to organize employee
                                        files and important documents
                                    </li>
                                    <li
                                        style={{
                                            width: "fit-content",
                                            margin: "auto",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        &#x2022; A documents page that can hold
                                        employee handbooks, company policies,
                                        forms and more
                                    </li>
                                    <li
                                        style={{
                                            width: "fit-content",
                                            margin: "auto",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        &#x2022; A schedule page to keep track
                                        of employee schedules, time clocks and
                                        associated needs
                                    </li>
                                    <li
                                        style={{
                                            width: "fit-content",
                                            margin: "auto",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        &#x2022; Mobile app for easy access
                                    </li>
                                    <li
                                        style={{
                                            width: "fit-content",
                                            margin: "auto",
                                            color: "white",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        &#x2022; And much more!
                                    </li>
                                </ul>
                            </Typography>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
