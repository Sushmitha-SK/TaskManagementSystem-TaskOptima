import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getAllTask, getUserTask } from '../api/taskApi';
import { getAllUser } from '../api/userAuthApi';
import TaskIcon from '@mui/icons-material/Task';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@mui/material';
import AddTaskModal from '../components/AddTaskModal';
import { useSelector } from 'react-redux';


const Dashboard = () => {
    const [counttask, setCounttask] = useState(0)
    const [notstartedcount, setNotstartedcount] = useState(0)
    const [progressCount, setProgressCount] = useState(0)
    const [completeCount, setCompleteCount] = useState(0)
    const [usercountno, setUsercountno] = useState(0)
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [allTask, setAllTask] = useState([])
    const [duetask, setDuetask] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const userDetails = useSelector((state) => state.login.data.user);

    const formattedDate = currentDateTime.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    // Format the time as "HH:MM:SS"
    const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const getTaskCount = async () => {
        const getcount = await getAllTask()
        const filteredCount = await getcount.data.filter((filterdata) => filterdata.assignedto === userDetails.id)
        setAllTask(filteredCount)
        setCounttask(filteredCount.length)
        const tasks = filteredCount;
        const inProgressTasks = tasks.filter(task => task.status === "In Progress");
        setProgressCount(inProgressTasks.length);
        const completedTasks = tasks.filter(task => task.status === "Completed");
        setCompleteCount(completedTasks.length);
        const notstartedTask = tasks.filter(task => task.status === "New");
        setNotstartedcount(notstartedTask.length);

        // Get the current date
        const today = new Date().toISOString().split('T')[0];

        // Filter tasks with duedate equal to today
        const tasksDueToday = tasks.filter(
            (task) => task.duedate.split("T")[0] === today && task.status !== "Completed"
        );
        setDuetask(tasksDueToday)
    }

    const getUserCount = async () => {
        const getusercount_data = await getAllUser()
        setUsercountno(getusercount_data.data.length)
        setUsers(getusercount_data.data);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        getTaskCount()
        getUserCount()
    }, [])


    // Bar chart
    const barData = [
        { name: 'New', count: notstartedcount },
        { name: 'In Progress', count: progressCount },
        { name: 'Completed', count: completeCount },
    ];


    //Add Task 
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };


    //Table Sort
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column);
            setSortOrder('asc')
        }
    };

    const getSortIcon = () => {
        if (sortOrder === 'asc') {
            return <span className="las la-sort-up"></span>;
        } else {
            return <span className="las la-sort-down"></span>;
        }
    }
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
    console.log('ALL TASK', allTask)
    const tasksToShow = allTask.slice(indexOfFirstTask, indexOfLastTask);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const totalPages = Math.ceil(allTask.length / tasksPerPage);

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
                                    {duetask.length === 0 ? (
                                        <div >
                                            <h1 style={{ fontSize: '14px', margin: '1%', marginTop: '2%' }}>No tasks due today!</h1>
                                        </div>

                                    ) : (
                                        <div>
                                            <h1 style={{ fontSize: '14px', margin: '1%', marginTop: '2%' }}>{duetask.length} task due today</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="analytics" style={{ 'gridTemplateColumns': 'repeat(4,1fr)' }}>
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
                                            <div className="indicator one" style={{ width: '60%' }} />
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
                                            <div className="indicator two" style={{ width: '80%' }} />
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
                                                        {/* {row.assignedto} */}
                                                    </td>
                                                    <td>{new Date(row.date).toLocaleDateString()}</td>
                                                    <td>{new Date(row.duedate).toLocaleDateString()}</td>
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
                            // onSubmit={handleFormSubmit}
                            />
                        </div>
                    </main>
                </div >
            </div >

        </>
    );
};

export default Dashboard;