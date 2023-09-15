import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './users.css';

import { useQuery } from '@apollo/client';

import { GET_USERS_BY_COMPANY } from '../utils/queries';

export default function Users({ triggerRefetch }) {
  const [users, setUsers] = useState([]);
  const { loading, error, data } = useQuery(GET_USERS_BY_COMPANY, {
    variables: { companyId: localStorage.getItem('company_id') },
  });
    
  useEffect(() => {
    if (data) {
        const userData = data.users;
      setUsers(userData);
    }
  }, [data, triggerRefetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
                <button onClick={() => handleStartChat(user)}>Chat</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}