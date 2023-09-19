import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import React from "react";

export default function ChatModal({ isOpen, onClose }) {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    borderRadius: "10px",
                    boxShadow: 24,
                    p: 4,
                    textAlign: "center",
                }}
            >
                <h2 id="modal-title">1 on 1 Chat</h2>
                <p id="modal-description">
                    This feature will be available in the coming months.
                </p>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </Box>
        </Modal>
    );
}
