import React, { useEffect, useState } from 'react';
import { Modal, TextField, Select, MenuItem, FormControl, InputLabel, Button, TextareaAutosize } from '@mui/material';
import '../styles/Task.css'
import { addTask } from '../api/taskApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import { getAllUser } from '../api/userAuthApi';

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [userinfo, setUserinfo] = useState([])

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleAssignedToChange = (event) => {
        setAssignedTo(event.target.value);
    };

    const handleDueDateChange = (event) => {
        setDueDate(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = await addTask(title, description, assignedTo, dueDate)
        toast.success('Task added successfully')
        onSubmit(data.data);
        onClose();
        // navigate('/task')

    };

    const fetchUserDetails = async () => {
        const user_data = await getAllUser()
        setUserinfo(user_data.data)

    }

    useEffect(() => {
        fetchUserDetails()
    }, [])



    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                className="modal"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Add Task</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={handleTitleChange}
                            fullWidth
                            required

                        />

                        <TextareaAutosize
                            aria-label="Description"
                            placeholder="Description"
                            minRows={3}
                            value={description}
                            onChange={handleDescriptionChange}
                            fullWidth
                            required
                            className="text-area"
                        />

                        <FormControl fullWidth required>
                            <InputLabel className="form-control-label">Assigned To</InputLabel>
                            <Select
                                value={assignedTo}
                                onChange={handleAssignedToChange}>
                                {userinfo.map((item, i) => {
                                    return (
                                        <MenuItem value={item._id}>{item.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Due Date"
                            type="date"
                            value={dueDate}
                            onChange={handleDueDateChange}
                            fullWidth
                            required
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            className="add-task-button"
                            style={{ background: '#00AFB9', width: '200px', height: 'auto' }}
                        >
                            Add Task
                        </Button>


                    </form>
                </div>
            </Modal>
        </>
    );
};

export default AddTaskModal;
