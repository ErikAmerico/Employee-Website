import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Avatar from "@mui/material/Avatar";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";
import AuthService from "../../utils/auth";
import { formatDate } from "../../utils/date";
import Comment from "../comment/comment";
import "./post.css";

import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_SINGLE_POST } from "../../utils/queries";

import { useMutation } from "@apollo/client";
import { REMOVE_POST } from "../../utils/mutations";

import { useState } from "react";
import { UPDATE_POST } from "../../utils/mutations";

const Post = () => {
    if (AuthService.loggedIn()) {
        const [editingPostId, setEditingPostId] = useState(null);
        const [showModal, setShowModal] = useState(false);
        const [postId, setPostId] = useState();
        const [updatePost, { errors }] = useMutation(UPDATE_POST);
        const [removePost, { error }] = useMutation(REMOVE_POST);

        const { data } = useQuery(QUERY_POSTS);
        const posts = data?.posts || [];
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

                            {showModal && (
                                <Modal
                                    open={showModal}
                                    onClose={closeModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Comment post={singlePost} />
                                </Modal>
                            )}
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
