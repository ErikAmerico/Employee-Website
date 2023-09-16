import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AuthService from "../../utils/auth";
import ChatModal from "../../components/chatModal/chatModal";
import './users.css';

import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { GET_USERS_BY_COMPANY } from '../../utils/queries';
import { REMOVE_USER } from '../../utils/mutations';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(AuthService.getProfile());
  const [removeUser] = useMutation(REMOVE_USER);

  const { loading, error, data } = useQuery(GET_USERS_BY_COMPANY, {
    variables: { companyId: localStorage.getItem('company_id') },
  });

  const myRole = profile.data.role;
  const myId = profile.data._id;
  console.log(myId)

  const { refetch } = useQuery(GET_USERS_BY_COMPANY, {
        variables: { companyId: localStorage.getItem('company_id') },
        skip: true, // Set skip to true to prevent automatic fetching
    });

  const triggerRefetch = () => {
        refetch();
    };
    
  useEffect(() => {
    if (data) {
        const userData = data.users;
      setUsers(userData);
    }
  }, [data, triggerRefetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleRemoveUser = (user) => {
    const userId = user._id;
    console.log(userId)

  removeUser({ variables: { userId } })
    .then(() => {
      triggerRefetch();
    })
    .catch((error) => {
      console.error('Error removing user:', error);
    });
};

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='tableContainerDiv'>
    <TableContainer component={Paper} className="tableContainer">
      <Table sx={{ minWidth: 650 }} aria-label="user table" className='userTable'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell component="th" scope="row">
                {`${user.firstName} ${user.lastName}`}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.title}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                {user._id !== myId && (
                <Button key='chatUzer'
                  onClick={() => openModal()}
                  sx={{ backgroundColor: '#134074' }}
                  variant='contained'>
                  {`Chat with ${user.firstName}`}
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {myRole.includes("Owner") && user._id !== myId && [
                  <Button key='removeUzer' onClick={() => handleRemoveUser(user)} color='error' variant='contained'>Remove User</Button>
                ]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <ChatModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}