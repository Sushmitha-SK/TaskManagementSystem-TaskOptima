import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Button, TablePagination, TextField } from '@mui/material';
import '../styles/Task.css';
import AddTaskModal from '../components/AddTaskModal';
import { deleteTask, getAllTask, getUserTask } from '../api/taskApi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableSortLabel } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { ThreeCircles } from 'react-loader-spinner';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewTaskModal from '../components/ViewTaskModal';
import EditTaskModal from './../components/EditTaskModal';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getAllUser } from '../api/userAuthApi';

const Task_Admin = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [selectedTask, setSelectedTask] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTaskToDelete, setSelectedTaskToDelete] = useState(null);
    const [users, setUsers] = useState([]);
    const [sortedColumn, setSortedColumn] = useState('');

    const getUserCount = async () => {
        const getusercount_data = await getAllUser()
        setUsers(getusercount_data.data);
    }

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const getTaskDetails = async () => {
        try {
            const task_data = await getAllTask();
            setData(task_data.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getTaskDetails();
        getUserCount();
    }, []);

    const handleFormSubmit = async (taskData) => {
        handleModalClose();
        await refreshTaskList();
    };

    const refreshTaskList = async () => {
        const task_data = await getAllTask();
        setData(task_data.data);
        setPage(0); // Reset to the first page after data update
    };

    const handleEdit = (taskData) => {
        setEditedTask(taskData); // Update the edited task details in the state
        handleModalClose();

    };

    const handleDeleteModalOpen = (taskData) => {
        setSelectedTaskToDelete(taskData);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setSelectedTaskToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (taskData) => {
        // Call the delete API endpoint or perform any necessary actions
        // to delete the task from the database
        const id = taskData._id;
        const deleteData = await deleteTask(id);
        handleDeleteModalClose();
        await refreshTaskList();
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const sortedData = data.sort((a, b) => {
        if (sortBy === 'id') {
            return sortOrder === 'asc' ? (a._id - b._id) : (b._id - a._id);
        } else {
            const valueA = a[sortBy];
            const valueB = b[sortBy];
            return sortOrder === 'asc' ? (valueA?.localeCompare(valueB)) || (valueA - valueB) : (valueB?.localeCompare(valueA)) || (b[sortBy] - a[sortBy]);
        }
    });

    const filteredData = sortedData.filter(
        (row) =>
            row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.assignedto.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sliceData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleView = (taskData) => {
        setSelectedTask(taskData);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
    };

    const handleEditModalOpen = (taskData) => {
        setEditedTask(taskData);
        setIsEditModalOpen(true);
    };

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

    return (
        <>
            <div>
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <main>
                        <div className="page-header">
                            <h1>Task</h1>
                            <small>Home / Task</small>
                        </div>
                        <div className="page-content">
                            <div className="records table-responsive">
                                <div class="record-header">
                                    <div class="add" >
                                        <TextField
                                            label="Search"
                                            onChange={handleSearch}
                                            variant="outlined"
                                            style={{ width: '150px', marginLeft: '10px' }}
                                            size="small"
                                        />
                                    </div>
                                    <div className="add-button-container">
                                        <Button
                                            variant="contained"
                                            onClick={handleModalOpen}
                                            className="add-button"
                                            style={{ background: '#00AFB9' }}
                                        >
                                            Add Task
                                        </Button>
                                    </div>
                                </div>

                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <TableSortLabel
                                                        active={sortedColumn === 'id'}
                                                        direction={sortOrder}
                                                        onClick={() => handleSort('id')}
                                                        IconComponent={sortedColumn === 'id' ? (sortOrder === 'asc' ? ArrowUpward : ArrowDownward) : null}
                                                    >
                                                        ID
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <TableSortLabel
                                                        active={sortBy === 'title'}
                                                        direction={sortOrder}
                                                        onClick={() => handleSort('title')}
                                                        IconComponent={sortBy === 'title' ? (sortOrder === 'asc' ? ArrowUpward : ArrowDownward) : null}
                                                    >
                                                        Title
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <TableSortLabel
                                                        active={sortBy === 'description'}
                                                        direction={sortOrder}
                                                        onClick={() => handleSort('description')}
                                                        IconComponent={sortBy === 'description' ? (sortOrder === 'asc' ? ArrowUpward : ArrowDownward) : null}
                                                    >
                                                        Description
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <TableSortLabel
                                                        active={sortBy === 'assignedto'}
                                                        direction={sortOrder}
                                                        onClick={() => handleSort('assignedto')}
                                                        IconComponent={sortBy === 'assignedto' ? (sortOrder === 'asc' ? ArrowUpward : ArrowDownward) : null}
                                                    >
                                                        Assigned To
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <TableSortLabel
                                                        active={sortBy === 'date'}
                                                        direction={sortOrder}
                                                        onClick={() => handleSort('date')}
                                                        IconComponent={sortBy === 'date' ? (sortOrder === 'asc' ? ArrowUpward : ArrowDownward) : null}
                                                    >
                                                        Start Date
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <TableSortLabel
                                                        active={sortBy === 'duedate'}
                                                        direction={sortOrder}
                                                        onClick={() => handleSort('duedate')}
                                                        IconComponent={sortBy === 'duedate' ? (sortOrder === 'asc' ? ArrowUpward : ArrowDownward) : null}
                                                    >
                                                        Due Date
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', textAlign: 'center' }}>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sliceData.map((row) => (
                                                <TableRow
                                                    key={row._id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row._id}
                                                    </TableCell>
                                                    <TableCell>{row.title}</TableCell>
                                                    <TableCell>{row.description}</TableCell>
                                                    <TableCell>
                                                        {users.find((user) => user._id === row.assignedto)?.name || "N/A"}
                                                    </TableCell>
                                                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell> {/* Format the start date */}
                                                    <TableCell>{new Date(row.duedate).toLocaleDateString()}</TableCell> {/* Format the due date */}
                                                    <TableCell style={{ textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <Button onClick={() => handleView(row)}>
                                                                <RemoveRedEyeIcon sx={{ color: '#8B8FA7' }} />
                                                            </Button>
                                                            <Button onClick={() => handleEditModalOpen(row)}>
                                                                <EditIcon sx={{ color: '#6684FF' }} />
                                                            </Button>
                                                            <Button onClick={() => handleDeleteModalOpen(row)}>
                                                                <DeleteIcon sx={{ color: '#F7002B' }} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </div>
                            <AddTaskModal
                                isOpen={isModalOpen}
                                onClose={handleModalClose}
                                onSubmit={handleFormSubmit}
                            />
                            <ViewTaskModal
                                isOpen={isViewModalOpen}
                                onClose={closeViewModal}
                                task={selectedTask}
                            />
                            <EditTaskModal
                                isOpen={isEditModalOpen}
                                onClose={handleEditModalClose}
                                data={editedTask}
                                onSubmit={handleEdit}

                            />
                            <Dialog open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogContent>
                                    <p>Are you sure you want to delete this task?</p>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDeleteModalClose}>Cancel</Button>
                                    <Button onClick={() => handleDelete(selectedTaskToDelete)}>Delete</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default Task_Admin;
