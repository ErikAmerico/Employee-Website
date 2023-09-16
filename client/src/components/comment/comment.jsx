import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import React from "react";
import { formatDate } from "../../utils/date";
import "./comment.css";

import { useQuery } from "@apollo/client";
import { QUERY_COMMENTS } from "../../utils/queries";

import { useMutation } from "@apollo/client";
import { REMOVE_COMMENT, CREATE_COMMENT } from "../../utils/mutations";

import { useState } from "react";
import { UPDATE_COMMENT } from "../../utils/mutations";

const Comment = ({ post }) => {};

export default Comment;
