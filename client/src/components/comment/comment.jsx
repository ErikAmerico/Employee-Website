import { useMutation } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { formatDate } from "../../utils/date";
import { REMOVE_COMMENT, UPDATE_COMMENT } from "../../utils/mutations";
import { QUERY_POSTS, QUERY_SINGLE_POST } from "../../utils/queries";

const Comment = ({ comment, user, postId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState(
        comment.commentText
    );
    // Update comment and Cache
    const [updateComment] = useMutation(UPDATE_COMMENT, {
        update: (cache, { data }) => {
            try {
                const { singlePost } = cache.readQuery({
                    query: QUERY_SINGLE_POST,
                    variables: { postId: postId },
                });
                const filteredComments = singlePost.comments.filter(
                    (comment) => comment._id !== data.updateComment._id
                );

                cache.writeQuery({
                    query: QUERY_SINGLE_POST,
                    data: {
                        ...singlePost,
                        comments: [updateComment, filteredComments],
                    },
                });
            } catch (e) {
                console.error(e);
            }
        },
    });
    // Remove comment and Cache
    const [removeComment] = useMutation(REMOVE_COMMENT, {
        update: (cache, { data }) => {
            console.log(data);
            try {
                const { post } = cache.readQuery({
                    query: QUERY_SINGLE_POST,
                    variables: { postId },
                });
                const deletedCommentId = data.removeComment._id;
                const filteredComments = post.comments.filter(
                    (comment) => comment._id !== deletedCommentId
                );
                console.log(filteredComments);

                cache.writeQuery({
                    query: QUERY_SINGLE_POST,
                    data: {
                        post: { ...post, comments: filteredComments },
                    },
                });
            } catch (e) {
                console.error(e);
            }
        },
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleEditComment = async () => {
        try {
            const { data } = await updateComment({
                variables: {
                    postId: postId,
                    commentId: comment._id,
                    commentText: editedCommentText,
                },
            });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteComment = async () => {
        try {
            const { data } = await removeComment({
                variables: {
                    postId: postId,
                    commentId: comment._id,
                },
            });
            setDeleteDialogOpen(false);
            // Handle the response as needed (e.g., remove the comment from UI).
        } catch (error) {
            console.error(error);
        }
    };

    const openDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    return (
        <div
            className="comment"
            style={{
                border: "1px solid #e6e6e6",
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                marginBottom: "8px",
                backgroundColor: "#D8DEEC",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px", // Add spacing between user info and comment text
                }}
            >
                <Typography variant="subtitle2">
                    {comment.user.firstName} {comment.user.lastName} ·{" "}
                    {formatDate(comment.createdAt)}
                </Typography>
                {user &&
                    (user._id === comment.user._id ||
                        user.role === "Admin") && (
                        <div>
                            <IconButton onClick={() => setIsEditing(true)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={openDeleteDialog}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    )}
            </div>

            {isEditing ? (
                <div>
                    <TextareaAutosize
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                    />
                    <div>
                        <Button
                            onClick={handleEditComment}
                            variant="contained"
                            color="primary"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                        {comment.commentText}
                    </Typography>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this comment?
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteComment} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Comment;
