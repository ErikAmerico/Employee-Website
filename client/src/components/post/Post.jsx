import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import AuthService from "../../utils/auth";
import { formatDate } from "../../utils/date";
import Comment from "../comment/comment";
import "./post.css";

import { useLazyQuery, useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_SINGLE_POST } from "../../utils/queries";

import { useMutation } from "@apollo/client";
import { CREATE_COMMENT, REMOVE_POST } from "../../utils/mutations";

import { useState } from "react";
import { UPDATE_POST } from "../../utils/mutations";

const Post = ({ comments }) => {
    if (AuthService.loggedIn()) {
        const [editingPostId, setEditingPostId] = useState(null);
        const [showModal, setShowModal] = useState(false);
        const [newCommentText, setNewCommentText] = useState("");
        const [postId, setPostId] = useState();
        // const [singlePost, setSinglePost] = useState(null);
        //Update Post and Caching
        const [updatePost, { errors }] = useMutation(UPDATE_POST, {
            update(cache, { data: { updatePost } }) {
                try {
                    const { posts } = cache.readQuery({ query: QUERY_POSTS });
                    const updatedPost = {
                        ...updatePost,
                    };
                    cache.modify({
                        fields: {
                            posts(existingPosts = []) {
                                const updatedPosts = existingPosts.map(
                                    (post) => {
                                        if (post._id === updatePost._id) {
                                            return updatedPost;
                                        }
                                        return post;
                                    }
                                );
                                return updatedPosts;
                            },
                        },
                    });
                } catch (e) {
                    console.error(e);
                }
            },
        });
        //Remove Post and Caching
        const [removePost, { error }] = useMutation(REMOVE_POST, {
            update(cache, { data: { removePost } }) {
                const { posts } = cache.readQuery({ query: QUERY_POSTS });
                const updatedPosts = posts.filter(
                    (post) => post._id !== removePost._id
                );
                cache.writeQuery({
                    query: QUERY_POSTS,
                    data: { posts: updatedPosts },
                });
            },
        });
        //Create Comment and Caching
        const [createComment] = useMutation(CREATE_COMMENT, {
            update: (cache, { data: { createComment } }) => {
                try {
                    const { post } = cache.readQuery({
                        query: QUERY_SINGLE_POST,
                        variables: { postId },
                    });

                    cache.writeQuery({
                        query: QUERY_SINGLE_POST,
                        data: {
                            post: {
                                ...post,
                                comments: [createComment, ...post.comments],
                            },
                        },
                    });
                } catch (e) {
                    console.error(e);
                }
            },
        });

        const { data } = useQuery(QUERY_POSTS);
        const [getSinglePost, { data: singlePost, loading }] =
            useLazyQuery(QUERY_SINGLE_POST);
        const posts = data?.posts || [];
        // const client = useApolloClient();
        const openModal = async (postId) => {
            setPostId(postId);
            try {
                getSinglePost({
                    variables: { postId },
                });
                setShowModal(true);
            } catch (err) {
                console.error("Error fetching single post:", err);
            }
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

        const handleCreateComment = async (postId) => {
            try {
                const { data } = await createComment({
                    variables: {
                        postId, // Use postId from state
                        commentText: newCommentText, // Use newCommentText from state
                    },
                });
            } catch (error) {
                console.error(error);
            }
        };

        const user = AuthService.getProfile();
        const isAdminOrOwner =
            user && (user.data.role == "Admin" || user.data.role == "Owner");
        
        const isSmallScreen = useMediaQuery(`(max-width: 750px)`);

        if (!posts.length) {
            return <p>No Announcements</p>;
        } else {
            return posts
                .slice()
                .reverse()
                .map((post) => (
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
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {post.postText}
                                </Typography>
                            </CardContent>

                            {editingPostId === post._id && (
                                <input
                                    type="text"
                                    defaultValue={post.postText}
                                    onBlur={(e) =>
                                        handleUpdatePost(
                                            post._id,
                                            e.target.value
                                        )
                                    }
                                />
                            )}

                            {/* add like button and comment button */}
                            <div className="postButtons">
                                <IconButton
                                    aria-label="comment"
                                    onClick={() => openModal(post._id)}
                                >
                                    <ChatBubbleIcon />
                                    <div>{post.comments.length}</div>
                                </IconButton>
                                {/* Modal to access comments. */}
                                <Modal open={showModal} onClose={closeModal}>
                                <Box
                sx={{
                    position: "absolute",
                    maxHeight: isSmallScreen ? '80%' : "100%", // Adjust the height for smaller screens
                    overflow: "auto",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: isSmallScreen ? '60%' : 500, // Adjust the width for smaller screens
                    bgcolor: "background.paper",
                    boxShadow: 22,
                    p: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "4px solid #000",
                }}
            >
                {/* Close button */}
                <IconButton
                    aria-label="close"
                    sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                    }}
                    onClick={closeModal}
                >
                    <CloseIcon />
                </IconButton>
                                        {/* Post content */}
                                        <div
                                            className="post"
                                            style={{
                                                border: "1px solid #e6e6e6",
                                                width: "100%",
                                                padding: "8px",
                                                borderRadius: "10px",
                                                marginBottom: "8px",
                                                marginTop: "8px",
                                            }}
                                        >
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
                                        </div>

                                        {/* Comments */}
                                        <TextField
                                            placeholder="Add a comment..."
                                            fullWidth={true}
                                            multiline={true}
                                            variant="outlined"
                                            value={newCommentText}
                                            onChange={(e) =>
                                                setNewCommentText(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {/* Comment input field */}

                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                handleCreateComment(post._id)
                                            }
                                            fullWidth={true}
                                        >
                                            Comment
                                        </Button>
                                        {!loading &&
                                            singlePost?.post.comments &&
                                            singlePost.post.comments
                                                .slice()
                                                .reverse()
                                                .map((comment) => (
                                                    <Comment
                                                        key={comment._id}
                                                        comment={comment}
                                                        user={user}
                                                        postId={post._id}
                                                    />
                                                ))}
                                    </Box>
                                </Modal>
                            </div>
                        </Card>
                    </div>
                ));
        }
    } else {
    }
};

export default Post;
