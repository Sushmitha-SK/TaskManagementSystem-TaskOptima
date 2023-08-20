import React, { useEffect, useState } from 'react';
import {
    Modal,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    TextareaAutosize,
    OutlinedInput,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { editUser, getAllUser } from '../api/userAuthApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const EditUserModal = ({ isOpen, onClose, onSubmit, data }) => {
    const [id, setId] = useState('')
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        console.log(data)
        if (data) {
            setId(data._id)
            setName(data.name);
            setEmail(data.email);
            setPassword(data.password);
            setRole(data.role);
        }
    }, [data]);

    const handleEditUser = async (e) => {
        e.preventDefault();
        const editdata = await editUser(id, name, email, password, role);
        console.log('editdata', editdata);
        toast.success('User details updated successfully');
        onSubmit({ _id: id, name, email, password, role });
        onClose();
    };

    return (
        <>
            <Modal open={isOpen} onClose={onClose} className="modal" >
                <div className="modal-content" >
                    <div className="modal-header">
                        <h2>Edit User</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                    <form onSubmit={handleEditUser}>
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
                            Edit User
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default EditUserModal;
