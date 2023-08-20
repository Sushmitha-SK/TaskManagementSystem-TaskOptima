import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import '../styles/Profile.css'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import userImage from '../assets/user.png'
import EditUserModal from '../components/EditUserModal';

const Profile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([])

    const handleModalOpen = () => {
        setIsModalOpen(true);
        setData(userDetails)
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const userDetails = useSelector((state) => state.login.data.user);

    const handleEditProfile = () => {
        setData(userDetails)
    }

    const handleFormSubmit = (userDetails) => {
        console.log(userDetails);
        handleModalClose();
    };
    return (
        <>
            <div>
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <main>
                        <div className="page-header">
                            <h1>Profile</h1>
                            <small>Home / Profile</small>
                        </div>
                        <div className="page-content">
                            <div className="records table-responsive">
                                <div className="record-header">
                                    <div className="add">
                                        {/* <button>Add record</button> */}
                                    </div>
                                    <div className="browse">
                                        <Button onClick={handleModalOpen} sx={{
                                            borderRadius: 3, marginTop: 3, color: '#fff',
                                            backgroundColor: '#00AFB9',
                                            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;',
                                            width: '150px',
                                            '&:hover': {
                                                backgroundColor: '#008B99',
                                            },
                                        }}>Edit Profile</Button>
                                    </div>
                                </div>
                                <Box sx={{ flexGrow: 1 }}>

                                    <Grid container spacing={2}>

                                        <Grid item xs={4}>
                                            <Paper className="MuiPaper-root" sx={{ boxShadow: 'none' }}>
                                                <div className="profile-card__header__pic">
                                                    <img src={userImage} alt="" style={{
                                                        display: 'block',
                                                        margin: '0 auto',
                                                    }} />
                                                </div>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Paper className="MuiPaper-root-right" sx={{ boxShadow: 'none' }}>
                                                <div style={{ marginLeft: '16px' }}>
                                                    <h2 style={{ margin: '2%' }}>{userDetails.name}</h2>
                                                    <p style={{ margin: '2%' }}>Role: {userDetails.role}</p>
                                                    <p style={{ fontWeight: 400, margin: '2%' }}>Email: {userDetails.email}</p>
                                                </div>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <EditUserModal
                                    isOpen={isModalOpen}
                                    onClose={handleModalClose}
                                    onSubmit={handleFormSubmit}
                                    data={data}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </div>


        </>
    )
}

export default Profile