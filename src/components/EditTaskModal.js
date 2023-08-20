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
} from '@mui/material';
import { getAllUser } from '../api/userAuthApi';
import { editTask } from '../api/taskApi';

const formatDateForInput = (originalDate) => {
    const dateObj = new Date(originalDate);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (originalDate) => {
    const dateObj = new Date(originalDate);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
};


const EditTaskModal = ({ isOpen, onClose, data }) => {
    const [taskid, setTaskid] = useState('')
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [user, setUser] = useState('');
    const [duedate, setDuedate] = useState('');
    const [userinfo, setUserinfo] = useState([]);
    const [status, setStatus] = useState('');


    const fetchUserDetails = async () => {
        const user_data = await getAllUser();
        setUserinfo(user_data.data);
    };


    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (data) {
            setTaskid(data._id)
            setTitle(data.title);
            setDescription(data.description);
            setUser(data.user);
            // setDuedate(data.duedate);
            setDuedate(formatDateForInput(data.duedate));
            setStatus(data.status);
        }
    }, [data]);

    const handleEditForm = async (e) => {
        e.preventDefault();
        const updateData = await editTask(taskid, title, description, user, duedate, status)
    };


    return (
        <>
            <Modal open={isOpen} onClose={onClose} className="modal" >
                <div className="modal-content" style={{ height: '580px' }}>
                    <div className="modal-header">
                        <h2>Edit Task</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                    <form onSubmit={handleEditForm}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                        />

                        <TextareaAutosize
                            aria-label="Description"
                            placeholder="Description"
                            minRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            className="text-area"
                        />

                        {userinfo.length > 0 && (
                            <FormControl fullWidth required>
                                <InputLabel className="form-control-label">Assigned To</InputLabel>
                                <Select
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                >
                                    {userinfo.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <TextField
                            label="Due Date"
                            type="date"
                            value={duedate}
                            onChange={(e) => setDuedate(e.target.value)}
                            fullWidth
                            required
                        />

                        <FormControl fullWidth required>
                            <InputLabel className="form-control-label">Status</InputLabel>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value="New">New</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>

                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            type="submit"
                            className="add-task-button"
                            style={{ background: '#00AFB9', width: '200px', height: 'auto' }}
                        >
                            Save Changes
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default EditTaskModal;
