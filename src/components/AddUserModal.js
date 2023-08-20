import React, { useEffect, useState } from 'react';
import { Modal, TextField, Select, MenuItem, FormControl, InputLabel, Button, TextareaAutosize, InputAdornment, IconButton, OutlinedInput } from '@mui/material';
import '../styles/Task.css'
import { addTask } from '../api/taskApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import { addUser } from '../api/userAuthApi';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AddUserModal = ({ isOpen, onClose, onSubmit, onAddUserSuccess }) => {
    const navigate = useNavigate()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const adduserdata = await addUser(name, email, password, role);
        console.log('Add user Data', adduserdata);
        toast.success('User added successfully');

        // Call the onAddUserSuccess callback with the newly added user data
        onAddUserSuccess({
            _id: adduserdata.data._id,
            name,
            email,
            role,
        });

        onClose();
    };

    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                className="modal"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Add User</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                        />

                        <FormControl
                            variant="outlined"
                            sx={{ width: "100%" }}
                        >
                            <InputLabel
                                sx={{
                                    color: "#9CA3AF",
                                    fontWeight: 500,
                                    fontSize: "18px",
                                }}
                                htmlFor="outlined-adornment-password"
                                required
                            >
                                Password
                            </InputLabel>
                            <OutlinedInput

                                sx={{
                                    fontFamily: "Poppins",
                                    fontWeight: 500,
                                    fontSize: "18px",
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="outlined-adornment-password"
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel className="form-control-label">Role</InputLabel>
                            <Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            type="submit"
                            className="add-task-button"
                            style={{ background: '#00AFB9', width: '200px', height: 'auto' }}
                        >
                            SAVE
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default AddUserModal;
