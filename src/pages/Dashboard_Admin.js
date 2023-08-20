import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getAllTask, getUserTask } from '../api/taskApi';
import { getAllUser } from '../api/userAuthApi';
import GroupIcon from '@mui/icons-material/Group';
import TaskIcon from '@mui/icons-material/Task';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, CircularProgress } from '@mui/material';
import AddTaskModal from './../components/AddTaskModal';
import { ThreeCircles } from 'react-loader-spinner';

const Dashboard_Admin = () => {
    const [counttask, setCounttask] = useState(0)
    const [notstartedcount, setNotstartedcount] = useState(0)
    const [progressCount, setProgressCount] = useState(0)
    const [completeCount, setCompleteCount] = useState(0)
    const [usercountno, setUsercountno] = useState(0)
    const [allTask, setAllTask] = useState([])
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deadline, setDeadline] = useState(0)
    const [sortColumn, setSortColumn] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [users, setUsers] = useState([]);

    const getTaskCount = async () => {
        try {
            const getcount = await getAllTask()
            setAllTask(getcount.data)
            setCounttask(getcount.data.length)
            const tasks = getcount.data;
            const inProgressTasks = tasks.filter(task => task.status === "In Progress");
            setProgressCount(inProgressTasks.length);
            const completedTasks = tasks.filter(task => task.status === "Completed");
            setCompleteCount(completedTasks.length);
            const notstartedTask = tasks.filter(task => task.status === "New");
            setNotstartedcount(notstartedTask.length);
            setIsLoading(false);
        } catch (error) {
            console.log('Error: ', error);
            setIsLoading(false); // Set loading state to false even if there's an error
        }
    }

    const getUserCount = async () => {
        const getusercount_data = await getAllUser()
        setUsercountno(getusercount_data.data.length)
        setUsers(getusercount_data.data);
    }

    useEffect(() => {
        getTaskCount()
        getUserCount()

    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleTask = () => {

    }

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        console.log('Closing the modal');
        setIsModalOpen(false);
    };

    const barData = [
        { name: 'New', count: notstartedcount },
        { name: 'In Progress', count: progressCount },
        { name: 'Completed', count: completeCount },
    ];

    // Format the date as "Mon 22, 2021"
    const formattedDate = currentDateTime.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        year: 'numeric',
    });

    // Format the time as "HH:MM:SS"
    const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const handleSort = (column) => {
        if (sortColumn === column) {
            // Reverse the sort order if the same column is clicked
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set the new sort column and default sort order
            setSortColumn(column);
            setSortOrder('asc');
        }
    };
    const getSortIcon = () => {
        if (sortOrder === 'asc') {
            return <span className="las la-sort-up"></span>; // Use an up arrow icon for ascending order
        } else {
            return <span className="las la-sort-down"></span>; // Use a down arrow icon for descending order
        }
    };

    const sortedTasks = allTask.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue && bValue) {
            if (sortOrder === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        } else if (!aValue && bValue) {
            return 1; // Treat undefined aValue as greater, move it towards the end
        } else if (aValue && !bValue) {
            return -1; // Treat undefined bValue as greater, move it towards the end
        } else {
            return 0; // Both values are undefined, consider them equal
        }
    });

    // Pagination
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const tasksToShow = allTask.slice(indexOfFirstTask, indexOfLastTask);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(allTask.length / tasksPerPage);

    // Render the loader if loading state is true
    if (isLoading) {
        return (
            <div className="loader-container">

                <ThreeCircles
                    height="80"
                    width="80"
                    color="#00AFB9"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="three-circles-rotating"
                    outerCircleColor=""
                    innerCircleColor=""
                    middleCircleColor=""
                />
            </div>
        );
    }
    const handleAddTask = (newTask) => {
        // Update the task list with the new task
        setAllTask((prevTasks) => [...prevTasks, newTask]);
    };

    return (
        <>
            <div>
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <main>
                        <div className="page-header">
                            <h1>Dashboard</h1>
                            <small>Home / Dashboard</small>
                        </div>

                        <div className="page-content">
                            <div className="page-header" style={{ backgroundColor: '#fdfefe', borderRadius: '10px', marginBottom: '2%', width: '250px' }}>
                                <h1>Today</h1>
                                <div style={{ paddingTop: '1%' }}>
                                    <small style={{ fontSize: '16px', color: '#00AFB9', fontWeight: '600' }}>{formattedDate} | {formattedTime}</small>
                                </div>

                            </div>
                            <div className="analytics">
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{counttask}</h2>
                                        <span>
                                            <TaskIcon fontSize='large' />
                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Total Tasks</small>
                                        <div className="card-indicator">
                                            <div className="indicator one" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{notstartedcount}</h2>
                                        <span>
                                            <AssignmentIcon fontSize='large' />
                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Not Started</small>
                                        <div className="card-indicator">
                                            <div className="indicator four" style={{ width: '80%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{progressCount}</h2>
                                        <span>
                                            <FormatListBulletedIcon fontSize='large' />

                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>In Progress</small>
                                        <div className="card-indicator">
                                            <div className="indicator two" style={{ width: '80%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{completeCount}</h2>
                                        <span>
                                            <TaskAltIcon fontSize='large' />
                                        </span>

                                    </div>
                                    <div className="card-progress">
                                        <small>Completed</small>
                                        <div className="card-indicator">
                                            <div className="indicator three" style={{ width: '65%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{usercountno}</h2>
                                        <span>
                                            <GroupIcon fontSize="large" />
                                        </span>
                                    </div>
                                    <div className="card-progress">
                                        <small>Users</small>
                                        <div className="card-indicator">
                                            <div className="indicator two" style={{ width: '90%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bar-chart-container">
                                <BarChart width={600} height={300} data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </div>

                            <div className="records table-responsive">
                                <div className="record-header">
                                    <div className="add">
                                        {/* <button>Add record</button> */}
                                    </div>

                                    <div className="browse">
                                        <Button
                                            onClick={handleModalOpen}
                                            type="submit"
                                            sx={{ borderRadius: 3, backgroundColor: '#00AFB9', boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;', width: '150px' }}
                                            variant="contained">
                                            Add Task
                                        </Button>
                                    </div>
                                </div>

                                <div>

                                    <table width="100%">
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSort('id')}>
                                                    ID {sortColumn === 'id' && getSortIcon()}
                                                </th>
                                                <th onClick={() => handleSort('title')}>
                                                    Title {sortColumn === 'title' && getSortIcon()}
                                                </th>
                                                <th onClick={() => handleSort('status')} style={{ textAlign: 'center' }}>
                                                    Status {sortColumn === 'status' && getSortIcon()}
                                                </th>
                                                <th onClick={() => handleSort('assignedto')}>
                                                    Assigned To {sortColumn === 'assignedto' && getSortIcon()}
                                                </th>
                                                <th onClick={() => handleSort('date')}>
                                                    Start Date {sortColumn === 'date' && getSortIcon()}
                                                </th>
                                                <th onClick={() => handleSort('duedate')}>
                                                    Due Date {sortColumn === 'duedate' && getSortIcon()}
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {tasksToShow.map((row) => (
                                                <tr>
                                                    <td>{row._id}</td>
                                                    <td>
                                                        <div class="client">

                                                            <div class="client-info">
                                                                <h4>{row.title}</h4>
                                                                <small>{row.description}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {row.status === 'In Progress' ? (
                                                            <div className='pill' style={{ background: '#FCC650', color: '#333' }}>
                                                                {row.status}
                                                            </div>
                                                        ) : row.status === 'New' ? (
                                                            <div className='pill' style={{ background: '#A9B5EF', color: '#333' }}>
                                                                {row.status}
                                                            </div>
                                                        ) : (
                                                            <div className='pill' style={{ background: '#00E183', color: '#333' }}>
                                                                {row.status}
                                                            </div>
                                                        )}



                                                    </td>
                                                    <td>
                                                        {users.find((user) => user._id === row.assignedto)?.name || "N/A"}
                                                    </td>
                                                    <td>{new Date(row.date).toLocaleDateString()}</td> {/* Format the start date */}
                                                    <td>{new Date(row.duedate).toLocaleDateString()}</td> {/* Format the due date */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div class="center">
                                        <div className="pagination">
                                            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                                <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? 'active' : ''}>{page}</button>
                                            ))}
                                            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AddTaskModal
                                isOpen={isModalOpen}
                                onClose={handleModalClose}
                                onSubmit={handleAddTask}
                            // onSubmit={handleFormSubmit}
                            />

                        </div>

                    </main>
                </div>
            </div>

        </>
    );
};

export default Dashboard_Admin;