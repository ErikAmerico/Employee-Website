import AttachFileIcon from "@mui/icons-material/AttachFile";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import VideocamIcon from "@mui/icons-material/Videocam";
import Avatar from "@mui/material/Avatar";
import React from "react";
import "./share.css";

import { useMutation } from "@apollo/client";
import { useState } from "react";
// import Auth from "../../utils/auth";
import { CREATE_POST } from "../../utils/mutations";

const Share = () => {
    //set useStates
    const [postText, setPostText] = useState("");

    //set useMutation
    const [createPost] = useMutation(CREATE_POST);

    //handle post submit
    const handlePostSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data } = await createPost({
                variables: {
                    postText,
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
                            <span className="shareOptionText">Live Video</span>
                        </div>
                        <div className="shareOption">
                            <PhotoLibraryIcon
                                htmlColor="green"
                                className="shareIcon"
                            />
                            <span className="shareOptionText">Photo/Video</span>
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
                    <button className="shareButton" onClick={handlePostSubmit}>
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Share;
