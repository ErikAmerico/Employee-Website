import AttachFileIcon from "@mui/icons-material/AttachFile";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import VideocamIcon from "@mui/icons-material/Videocam";
import Avatar from "@mui/material/Avatar";
import React from "react";
import "./share.css";

const Share = () => {
    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <Avatar src="" />
                    <input
                        placeholder="Make and announcement."
                        className="shareInput"
                    />
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
                    <button className="shareButton">Share</button>
                </div>
            </div>
        </div>
    );
};

export default Share;
