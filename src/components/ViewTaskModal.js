import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, Paper, Typography } from '@mui/material';
import '../styles/Task.css'
import { useNavigate } from 'react-router-dom';
import DateRangeIcon from '@mui/icons-material/DateRange';


const ViewTaskModal = ({ isOpen, onClose, task }) => {
    const [id, setId] = useState('')
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [startdate, setStartdate] = useState('')
    const [duedate, setDuedate] = useState('')

    const navigate = useNavigate()

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        if (task) {
            setId(task._id)
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            setStartdate(formatDate(task.date))
            setDuedate(formatDate(task.duedate))
        }
    }, [task]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return '#3754DB';
            case 'In Progress':
                return '#8937DB';
            case 'Completed':
                return '#00C271';
            default:
                return '#333';
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            className="modal"
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h2>View Task</h2>
                    <button className="close-button" onClick={onClose}>
                        X
                    </button>
                </div>
                <div className='wrapper' style={{ boxShadow: 'none', top: '50%' }}>
                    <div className='modal_Task' style={{ boxShadow: 'none' }}>
                        <div className='modalContent_Task' style={{ boxShadow: 'none', margin: '10px 0' }}>
                            <div style={{ marginTop: '10px' }}>
                                <Typography variant="h6" style={{ fontWeight: 600, color: '#000000' }}>{title}</Typography>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <div style={{ backgroundColor: '#f0f0f0', borderRadius: '16px', padding: '4px 10px', display: 'inline-block' }}>
                                    <Typography style={{ fontSize: '12px', color: getStatusColor(status), fontWeight: 600 }}>{status}</Typography>
                                </div>

                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Typography style={{ color: '#808080' }}>{description}</Typography>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <DateRangeIcon style={{ marginRight: '10px' }} />
                                    <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Start Date</Typography>
                                    <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{startdate}</Typography>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <DateRangeIcon style={{ marginRight: '10px' }} />
                                    <Typography style={{ marginRight: '10px', fontSize: '12px', fontWeight: 600, color: '#999999' }}>Due Date</Typography>
                                    <Typography style={{ marginRight: '20px', fontSize: '12px' }}>{duedate}</Typography>
                                </div>
                            </div>

                            <div className="buttonContainer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant="contained" onClick={onClose} style={{ background: '#00AFB9', width: '200px', height: 'auto' }}>Close</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Modal >
    )
}

export default ViewTaskModal