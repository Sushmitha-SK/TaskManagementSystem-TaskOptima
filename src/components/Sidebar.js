import React, { useEffect } from 'react'
import '../styles/Dashboard.css'
import userImage from '../assets/user.png'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../api/userAuthApi';
import { Tooltip } from '@mui/material';

const Sidebar = () => {
    const data = useSelector(state => state.login.data);
    const getUserData = async () => {
        const data = await getUserInfo()
    }

    useEffect(() => {
        getUserData()
    }, [])


    const loginData = useSelector((state) => state.login.data.user.role);
    const userDetails = useSelector((state) => state.login.data.user);
    const isAdmin = loginData === 'admin';

    return (
        <>
            <input type="checkbox" id="menu-toggle" />
            <div className="sidebar sidebarContent" style={{ background: '#fff' }}>
                <div className="side-header" style={{ textAlign: 'center' }}>
                    <h3>T<span>askOptima</span></h3>
                </div>
                <div className="side-content">
                    <div className="profile">

                        <div className="profile-img bg-img" style={{ backgroundImage: `url(${userImage})` }} />
                        <h4 style={{ color: '#333' }}>{userDetails.name.toUpperCase()}</h4>
                        <small>{userDetails.role}</small>
                    </div>
                    <div className="side-menu">
                        <ul>
                            {isAdmin ? (
                                <li>
                                    <Tooltip title="Dashboard">
                                        <Link to="/dashboard-admin">
                                            <a>
                                                <span className="las la-home" />
                                                <small>Dashboard</small>
                                            </a>
                                        </Link>
                                    </Tooltip>

                                </li>
                            ) : (
                                <li>
                                    <Tooltip title="Dashboard">
                                        <Link to="/dashboard">
                                            <a>
                                                <span className="las la-home" />
                                                <small>Dashboard</small>
                                            </a>
                                        </Link>
                                    </Tooltip>

                                </li>
                            )}

                            {isAdmin && (
                                <li>
                                    <Tooltip title="User">
                                        <Link to="/user">
                                            <a>
                                                <span className="las la-user" />
                                                <small>User</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            {isAdmin ? (
                                <li>
                                    <Tooltip title="User">

                                        <Link to="/task-admin">
                                            <a>
                                                <span className="las la-tasks" />
                                                <small>Tasks</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            ) : (
                                <li>
                                    <Tooltip title="Task">

                                        <Link to="/task">
                                            <a>
                                                <span className="las la-tasks" />
                                                <small>Tasks</small>
                                            </a>
                                        </Link>
                                    </Tooltip>
                                </li>
                            )}

                            <li>
                                <Tooltip title="Profile">

                                    <Link to="/profile">

                                        <a>
                                            <span className="las la-user-alt" />
                                            <small>Profile</small>
                                        </a>
                                    </Link>
                                </Tooltip>

                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar