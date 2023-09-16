import React, { useContext } from "react";
import Post from "../components/post/Post";
import Share from "../components/share/Share";

export default function Announcements({ user }) {
    // make sure someone is logged in to view this page
    // check if user is logged in and is admin or owner to view the share component
    return (
        <>
            <div className="announcements">
                <div className="announcementsWrapper">
                    <h1> Announcements </h1>
                    <Share />
                    <Post />
                </div>
            </div>

        </>
    );
}
