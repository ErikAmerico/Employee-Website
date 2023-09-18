import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import AuthService from "../../utils/auth";
import { formatDate } from "../../utils/date";
import Comment from "../comment/comment";
import "./post.css";

import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_SINGLE_POST } from "../../utils/queries";

import { useMutation } from "@apollo/client";
import {
    CREATE_COMMENT,
    REMOVE_COMMENT,
    REMOVE_POST,
} from "../../utils/mutations";

import { useState } from "react";
import { UPDATE_COMMENT, UPDATE_POST } from "../../utils/mutations";

const Post = ({ comments }) => {
    console.log(comments);
    if (AuthService.loggedIn()) {
        const [editingPostId, setEditingPostId] = useState(null);
        const [showModal, setShowModal] = useState(false);
        const [newCommentText, setNewCommentText] = useState("");
        const [postId, setPostId] = useState();
        const [updatePost, { errors }] = useMutation(UPDATE_POST);
        const [removePost, { error }] = useMutation(REMOVE_POST);
        const [createComment] = useMutation(CREATE_COMMENT);

        const { data } = useQuery(QUERY_POSTS);
        const posts = data?.posts || [];
        console.log(posts);
        const { data: singlePostData } = useQuery(QUERY_SINGLE_POST, {
            variables: { postId: postId },
        });
        const singlePost = singlePostData?.post || {};

        const openModal = (postId) => {
            setPostId(postId);
            setShowModal(true);
        };
        const closeModal = () => {
            setPostId(null);
            setShowModal(false);
        };

        const handleRemovePost = async (postId) => {
            try {
                const { data } = await removePost({
                    variables: { postId: postId },
                });
            } catch (err) {
                console.error(err);
            }
        };

        const handleUpdatePost = async (postId, newValue) => {
            const updatedValue = newValue;

            await updatePost({
                variables: { postId: postId, postText: updatedValue },
            });
            setEditingPostId(null);
        };

        const handleCreateComment = async () => {
            try {
                const { data } = await createComment({
                    variables: {
                        postId: postId, // Use postId from state
                        commentText: newCommentText, // Use newCommentText from state
                        // commentId: singlePost._id,
                    },
                });
                // Handle the response as needed (e.g., reset form, update UI).
                // You can also update the comments UI here if needed.
            } catch (error) {
                console.error(error);
            }
        };

        const user = AuthService.getProfile();
        const isAdminOrOwner =
            user && (user.role === "Admin" || user.role === "Owner");

        if (!posts.length) {
            return <p>No Announcements</p>;
        } else {
            return posts.map((post) => (
                <div key={post._id} className="post">
                    <Card sx={{ maxWidth: 850 }} className="cardBody">
                        <CardHeader
                            className="cardHeader"
                            avatar={
                                <Avatar
                                    sx={{ bgcolor: "red" }}
                                    aria-label="recipe"
                                >
                                    R
                                </Avatar>
                            }
                            action={
                                isAdminOrOwner && (
                                    <ButtonGroup>
                                        <IconButton
                                            aria-label="settings"
                                            onClick={() =>
                                                handleRemovePost(post._id)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="settings"
                                            onClick={() =>
                                                setEditingPostId(post._id)
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </ButtonGroup>
                                )
                            }
                            title={`${post.user.firstName} ${post.user.lastName}`}
                            subheader={formatDate(post.createdAt)}
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

                        {editingPostId === post._id && (
                            <input
                                type="text"
                                defaultValue={post.postText}
                                onBlur={(e) =>
                                    handleUpdatePost(post._id, e.target.value)
                                }
                            />
                        )}

                        {/* add like button and comment button */}
                        <div className="postButtons">
                            <IconButton aria-label="like">
                                <FavoriteBorderIcon />
                                <div>1</div>
                            </IconButton>
                            <IconButton
                                aria-label="comment"
                                onClick={() => openModal(post._id)}
                            >
                                <ChatBubbleIcon />
                                <div>3</div>
                            </IconButton>
                            {/* Modal to access comments. */}
                            <Modal open={showModal} onClose={closeModal}>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 500,
                                        bgcolor: "background.paper",
                                        boxShadow: 22,
                                        p: 10,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        border: "4px solid #000",
                                    }}
                                >
                                    {/* Post content */}
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        margin={2}
                                    >
                                        {post.user.firstName}{" "}
                                        {post.user.lastName}
                                    </Typography>
                                    {/* if no image, render nothing */}
                                    {post.postImage && (
                                        <CardMedia
                                            component="img"
                                            height="fit-content"
                                            image={post.postImage}
                                        />
                                    )}
                                    <Typography
                                        variant="body2"
                                        gutterBottom
                                        margin={2}
                                    >
                                        {post.postText}
                                    </Typography>
                                    {/* Comments */}
                                    {console.log("these are comments", post.comments)}
                                    {post.comments &&
                                        
                                        post.comments.map((comment) => (
                                            
                                            <Comment
                                                key={comment._id}
                                                comment={comment}
                                                user={user}
                                                postId={post._id}
                                            />
                                        ))}
                                    {/* Comment input field */}
                                    <TextField
                                        placeholder="Add a comment..."
                                        fullWidth={true}
                                        multiline={true}
                                        variant="outlined"
                                        value={newCommentText}
                                        onChange={(e) =>
                                            setNewCommentText(e.target.value)
                                        }
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleCreateComment}
                                        fullWidth={true}
                                    >
                                        Comment
                                    </Button>
                                </Box>
                            </Modal>
                        </div>
                    </Card>
                </div>
            ));
        }
    } else {
        return <h1> Please log in to view this page. </h1>;
    }
};

export default Post;
