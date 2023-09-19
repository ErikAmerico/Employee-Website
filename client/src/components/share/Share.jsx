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
import { QUERY_POSTS } from "../../utils/queries";

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
                        // Pass post text and user information to be used on posts
                        postText,
                        companyId,
                    },
                    update: (cache, { data: { createPost } }) => {
                        // Read the current list of posts from the cache
                        const { posts } = cache.readQuery({
                            query: QUERY_POSTS,
                        });

                        // Add the newly created post to the list
                        cache.writeQuery({
                            query: QUERY_POSTS,
                            data: {
                                posts: [createPost, ...posts],
                            },
                        });
                    },
                });
                setPostText("");
            } catch (err) {
                console.error(err);
            }
        };

        const handleChange = (event) => {
            setPostText(event.target.value);
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
                            value={postText}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <hr className="shareHr" />
                    <div className="shareBottom">
                        <div className="shareOptions">
                            {/* add these options, once you add media options to account */}
                            {/* <div className="shareOption">
                                <VideocamIcon
                                    htmlColor="blue"
                                    className="shareIcon"
                                />
                                <span className="shareOptionText">
                                    Live Video
                                </span>
                            </div> */}
                            {/* <div className="shareOption">
                                <PhotoLibraryIcon
                                    htmlColor="green"
                                    className="shareIcon"
                                />
                                <span className="shareOptionText">
                                    Photo/Video
                                </span>
                            </div> */}
                            {/* <div className="shareOption">
                                <AttachFileIcon
                                    htmlColor="purple"
                                    className="shareIcon"
                                />
                                <span className="shareOptionText">
                                    Upload a File
                                </span>
                            </div> */}
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
