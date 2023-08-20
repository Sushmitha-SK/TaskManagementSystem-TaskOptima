import React, { useEffect, useState } from 'react';
import { Modal, Button } from '@mui/material';
import '../styles/Task.css'
import { useNavigate } from 'react-router-dom';
import '../styles/ViewUserModal.css'
import '../styles/Task.css'
import profileImage from '../assets/user.png'


const ViewUserModal = ({ isOpen, onClose, onSubmit, data }) => {
    const [id, setId] = useState('')
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        if (data) {
            setId(data._id)
            setName(data.name);
            setEmail(data.email);
            setPassword(data.password);
            setRole(data.role);
        }
    }, [data]);

    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                className="modal"
            >
                <div className="modal-content" style={{ boxShadow: 'none', top: '50%' }}>
                    <div className="modal-header">
                        <h2>View User</h2>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                    <div class="wrapper" style={{ boxShadow: 'none', top: '50%' }}>
                        <div class="left">
                            <img src={profileImage} alt="user" width="100" />
                            <h4>{name}</h4>
                            <p>{role}</p>
                        </div>
                        <div class="right">
                            <div class="info">
                                <div class="info_data">
                                    <div class="data">
                                        <p>Name</p>
                                        <h4>{name}</h4>
                                        <p>Email</p>
                                        <h4 style={{ fontWeight: 400 }}>{email}</h4>
                                        <p>Role</p>
                                        <h4 style={{ fontWeight: 400 }}>{role}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="buttonContainer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }}>
                        <Button variant="contained" onClick={onClose} style={{ background: '#00AFB9', width: '200px', height: 'auto' }}>Close</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ViewUserModal;


