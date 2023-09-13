import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import * as React from "react";
import "./post.css";

import { useQuery } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/queries";

import { useMutation } from "@apollo/client";
import { REMOVE_POST } from "../../utils/mutations";

const Post = () => {
    const { data } = useQuery(QUERY_POSTS);
    const posts = data?.posts || [];

    const [removePost, { error }] = useMutation(REMOVE_POST);

    const handleRemovePost = async (postId) => {
        try {
            const { data } = await removePost({
                variables: { postId: postId },
            });
        } catch (err) {
            console.error(err);
        }
    };

    if (!posts.length) {
        return <p>No Announcements</p>;
    } else {
        return posts.map((post) => (
            <div key={post._id} className="post">
                <Card sx={{ maxWidth: 850 }} className="cardBody">
                    <CardHeader
                        className="cardHeader"
                        avatar={
                            <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                                R
                            </Avatar>
                        }
                        action={
                            <IconButton
                                aria-label="settings"
                                onClick={() => handleRemovePost(post._id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                        title="announcements"
                        subheader="September 14, 2016"
                    />

                    <CardMedia
                        component="img"
                        height="fit-content"
                        image={post.postImage}
                    />

                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {post.postText}
                        </Typography>
                    </CardContent>
                    {/* add like button and comment button */}
                    <div className="postButtons">
                        <IconButton aria-label="like">
                            <FavoriteBorderIcon />
                            <div>1</div>
                        </IconButton>
                        <IconButton aria-label="comment">
                            <ChatBubbleIcon />
                            <div>3</div>
                        </IconButton>
                    </div>
                </Card>
            </div>
        ));
    }
};

export default Post;
