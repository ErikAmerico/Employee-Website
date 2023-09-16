// Comment.jsx

import { useMutation } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { formatDate } from "../../utils/date";
import {
    CREATE_COMMENT,
    REMOVE_COMMENT,
    UPDATE_COMMENT,
} from "../../utils/mutations";

const Comment = forwardRef((props, ref) => {
    const [commentText, setCommentText] = useState("");
    const [editCommentText, setEditCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Define GraphQL mutations for creating, updating, and removing comments
    const [createComment] = useMutation(CREATE_COMMENT);
    const [updateComment] = useMutation(UPDATE_COMMENT);
    const [removeComment] = useMutation(REMOVE_COMMENT);

    // Function to open the modal
    const openModal = () => {
        setShowModal(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Function to create a new comment
    const handleCreateComment = async () => {
        try {
            await createComment({
                variables: {
                    commentText,
                    postId: post._id,
                },
            });
            setCommentText("");
        } catch (err) {
            console.error(err);
        }
    };

    // Function to edit a comment
    const handleEditComment = async (commentId) => {
        try {
            await updateComment({
                variables: {
                    commentId,
                    commentText: editCommentText,
                },
            });
            setEditingCommentId(null);
        } catch (err) {
            console.error(err);
        }
    };

    // Function to delete a comment
    const handleDeleteComment = async (commentId) => {
        try {
            await removeComment({
                variables: {
                    commentId,
                },
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="comment-container">
            <div className="comment-title">Comments</div>
            <div className="comment-list">
                {post.comments.map((comment) => (
                    <div className="comment" key={comment._id}>
                        <div className="comment-header">
                            <Avatar
                                sx={{ width: 24, height: 24 }}
                                alt="avatar"
                                src={comment.avatar}
                            />
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    marginLeft: 1,
                                }}
                                color="text.secondary"
                                gutterBottom
                            >
                                {comment.username}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    marginLeft: 1,
                                }}
                                color="text.secondary"
                                gutterBottom
                            >
                                {formatDate(comment.createdAt)}
                            </Typography>
                        </div>
                        <div className="comment-body">
                            {editingCommentId === comment._id ? (
                                // Edit mode for the current comment
                                <>
                                    <textarea
                                        value={editCommentText}
                                        onChange={(e) =>
                                            setEditCommentText(e.target.value)
                                        }
                                    />
                                    <button
                                        onClick={() =>
                                            handleEditComment(comment._id)
                                        }
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                // Display the comment text
                                comment.commentText
                            )}
                        </div>
                        <div className="comment-footer">
                            {editingCommentId === comment._id ? (
                                // Edit mode: Save and Cancel buttons
                                <>
                                    <button
                                        onClick={() =>
                                            setEditingCommentId(null)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                // View mode: Edit and Delete buttons
                                <>
                                    <button
                                        onClick={() =>
                                            setEditingCommentId(comment._id)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteComment(comment._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="comment-form">
                <textarea
                    className="comment-textarea"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                    className="comment-button"
                    onClick={handleCreateComment}
                >
                    Comment
                </button>
            </div>
            <Modal
                open={showModal}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {/* Render comments or other content inside the modal */}
                <div className="modal-content">
                    {post.comments.map((comment) => (
                        <div className="comment" key={comment._id}>
                            {/* Display comments */}
                            {/* ... */}
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
});

export default Comment;
