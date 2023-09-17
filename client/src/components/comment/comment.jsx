import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
    CREATE_COMMENT,
    REMOVE_COMMENT,
    UPDATE_COMMENT,
} from "../../utils/mutations";

const Comment = ({ comment, user, postId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState(
        comment.commentText
    );
    const [updateComment] = useMutation(UPDATE_COMMENT);
    const [removeComment] = useMutation(REMOVE_COMMENT);

    const handleEditComment = async () => {
        try {
            const { data } = await updateComment({
                variables: {
                    commentId: comment._id,
                    commentText: commentText,
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
                    commentId: comment._id,
                },
            });
            // Handle the response as needed (e.g., remove the comment from UI).
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="comment">
            {isEditing ? (
                <div>
                    <textarea
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                    />
                    <button onClick={handleEditComment}>Save</button>
                </div>
            ) : (
                <div>
                    <p>{comment.commentText}</p>
                    {user &&
                        (user._id === comment.user._id ||
                            user.role === "Admin") && (
                            <div>
                                <button onClick={() => setIsEditing(true)}>
                                    Edit
                                </button>
                                <button onClick={handleDeleteComment}>
                                    Delete
                                </button>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
};

export default Comment;
