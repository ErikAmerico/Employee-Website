import AttachFileIcon from "@mui/icons-material/AttachFile";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import VideocamIcon from "@mui/icons-material/Videocam";
import Avatar from "@mui/material/Avatar";
import jwtDecode from "jwt-decode";
import React from "react";
import AuthService from "../../utils/auth";
import "./share.css";

import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_POST } from "../../utils/mutations";

const user = AuthService.getProfile();

const Share = () => {
    if (
        (AuthService.loggedIn() && user.data.role == "Admin") ||
        (AuthService.loggedIn() && user.data.role == "Owner")
    ) {
        //set useStates
        const [postText, setPostText] = useState("");

        //set useMutation
        const [createPost] = useMutation(CREATE_POST);

        //get company id from local storage, to delete all posts when company is disbanded
        const companyId = localStorage.getItem("company_id");

        //handle post submit
        const handlePostSubmit = async (event) => {
            event.preventDefault();

            try {
                const { data } = await createPost({
                    variables: {
                        //Pass post text and user information to be used on posts
                        postText,
                        companyId,
                    },
                });
                setPostText("");
            } catch (err) {
                console.error(err);
            }
        };

        const handleChange = (event) => {
            const { name, value } = event.target;
            setPostText(value);
        };
        return (
            <div className="share">
                <div className="shareWrapper">
                    <div className="shareTop">
                        <Avatar src="" />
                        <input
                            placeholder="Make and announcement."
                            className="shareInput"
                            name="postText"
                            onChange={handleChange}
                        ></input>
                    </div>
                    <hr className="shareHr" />
                    <div className="shareBottom">
                        <div className="shareOptions">
                            <div className="shareOption">
                                <VideocamIcon
                                    htmlColor="blue"
                                    className="shareIcon"
                                />
                                <span className="shareOptionText">
                                    Live Video
                                </span>
                            </div>
                            <div className="shareOption">
                                <PhotoLibraryIcon
                                    htmlColor="green"
                                    className="shareIcon"
                                />
                                <span className="shareOptionText">
                                    Photo/Video
                                </span>
                            </div>
                            <div className="shareOption">
                                <AttachFileIcon
                                    htmlColor="purple"
                                    className="shareIcon"
                                />
                                <span className="shareOptionText">
                                    Upload a File
                                </span>
                            </div>
                        </div>
                        <button
                            className="shareButton"
                            onClick={handlePostSubmit}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default Share;
