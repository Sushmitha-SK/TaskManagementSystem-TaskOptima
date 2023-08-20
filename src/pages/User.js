import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Select, MenuItem, TextField, InputLabel } from '@mui/material';
import '../styles/Task.css';
import AddUserModal from '../components/AddUserModal';
import { delete_User, getAllUser } from '../api/userAuthApi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SortIcon from '@mui/icons-material/Sort';
import EditUserModal from '../components/EditUserModal';
import ViewUserModal from '../components/ViewUserModal';
import { ThreeCircles } from 'react-loader-spinner';

const User = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [data, setData] = useState([]);
    const [editedUser, setEditedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState(null); // Column to sort by
    const [sortOrder, setSortOrder] = useState('asc'); // Sort order ('asc' or 'desc')
    const [filterBy, setFilterBy] = useState(null); // Column to filter by
    const [filterValue, setFilterValue] = useState(''); // Filter value
    const [searchQuery, setSearchQuery] = useState(''); // Search query
    const [isLoading, setIsLoading] = useState(true);
    const [isAddUserModalClosed, setIsAddUserModalClosed] = useState(true);

    const handleEditModalOpen = (user) => {
        setEditedUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditedUser(null);
        setIsEditModalOpen(false);
    };

    const handleEditFormSubmit = (editedData) => {
        // Logic to update the user data using the editedData
        handleEditModalClose();
        refreshUserList();
    };

    /**********View User Modal*********** */
    const handleViewModalOpen = (user) => {
        setViewUser(user);
        setIsViewModalOpen(true);
    };

    const handleViewModalClose = () => {
        setViewUser(null);
        setIsViewModalOpen(false);
    };
    const handleViewFormSubmit = (editedData) => {
        // Logic to update the user data using the editedData
        handleViewModalClose();
        refreshUserList();
    };

    /************View User Modal End************** */
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleDeleteDialogOpen = (user) => {
        setDeleteUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteUser(null);
        setIsDeleteDialogOpen(false);
    };

    const handleDeleteUser = async () => {
        // Logic to delete the user
        const id = deleteUser._id
        const deleteData = await delete_User(id)
        handleDeleteDialogClose();
        await refreshUserList();
    };

    const getAlluser_details = async () => {
        setIsLoading(true);
        const user_data = await getAllUser();
        setData(user_data.data);
        setIsLoading(false);
    };

    useEffect(() => {
        getAlluser_details();
    }, []);

    const handleFormSubmit = async (taskData) => {
        handleModalClose();
        await refreshUserList();
    };

    const refreshUserList = async () => {
        const user_data = await getAllUser();
        setData(user_data.data);
        setCurrentPage(0); // Reset to the first page after data update
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

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

    const handleAddUserSuccess = async () => {
        // Fetch the newly added user from the server to get the complete user object with the generated _id
        const user_data = await getAllUser();
        setData(user_data.data);
    };

    //Sorting
    const handleSort = (column) => {
        if (sortBy === column) {
            // If already sorted by this column, toggle the sort order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // If sorting a different column, set it as the new sort column and use the default 'asc' order
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const sortedData = () => {
        if (sortBy) {
            return data.slice().sort((a, b) => {
                // Customize the sorting logic based on the data types of the columns
                const valueA = a[sortBy];
                const valueB = b[sortBy];

                if (typeof valueA === 'string') {
                    return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                } else if (typeof valueA === 'number') {
                    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
                }
                // Add more conditions for other data types if needed
                return 0;
            });
        }
        return data;
    };

    const indexOfLastRow = (currentPage + 1) * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    // const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const currentRows = sortedData().slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <>
            <div>
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <main>
                        <div className="page-header">
                            <h1>User</h1>
                            <small>Home / User</small>
                        </div>
                        <div className="page-content">
                            <div className="records table-responsive">
                                <div class="record-header">
                                    <div class="add" >
                                        {/* Filter input */}
                                        <FormControl variant="outlined" style={{ width: '150px' }}>
                                            <InputLabel>Filter By</InputLabel>
                                            <Select
                                                value={filterBy}
                                                onChange={(e) => setFilterBy(e.target.value)}
                                                label="Filter By"
                                                size="small"
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                <MenuItem value="name">Name</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            label="Filter Value"
                                            value={filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            variant="outlined"
                                            style={{ width: '150px', marginLeft: '10px' }}
                                            size="small"
                                        />
                                    </div>

                                    <div className="add-button-container">
                                        {/* Search input */}
                                        <TextField
                                            label="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            variant="outlined"
                                            style={{ width: '150px', marginRight: '10px' }}
                                            size="small"
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleModalOpen}
                                            className="add-button"
                                            style={{ background: '#00AFB9' }}
                                        >
                                            Add User
                                        </Button>
                                    </div>
                                </div>

                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">

                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <div onClick={() => handleSort('_id')}>
                                                        ID{' '}
                                                        {sortBy === '_id' && (
                                                            <SortIcon
                                                                fontSize="small"
                                                                style={{
                                                                    transform:
                                                                        sortOrder === 'asc'
                                                                            ? 'rotate(180deg)'
                                                                            : 'rotate(0deg)',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <div onClick={() => handleSort('name')}>
                                                        Name{' '}
                                                        {sortBy === 'name' && (
                                                            <SortIcon
                                                                fontSize="small"
                                                                style={{
                                                                    transform:
                                                                        sortOrder === 'asc'
                                                                            ? 'rotate(180deg)'
                                                                            : 'rotate(0deg)',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <div onClick={() => handleSort('email')}>
                                                        Email{' '}
                                                        {sortBy === 'email' && (
                                                            <SortIcon
                                                                fontSize="small"
                                                                style={{
                                                                    transform:
                                                                        sortOrder === 'asc'
                                                                            ? 'rotate(180deg)'
                                                                            : 'rotate(0deg)',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600' }}>
                                                    <div onClick={() => handleSort('role')}>
                                                        Role{' '}
                                                        {sortBy === 'role' && (
                                                            <SortIcon
                                                                fontSize="small"
                                                                style={{
                                                                    transform:
                                                                        sortOrder === 'asc'
                                                                            ? 'rotate(180deg)'
                                                                            : 'rotate(0deg)',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{ fontWeight: '600', textAlign: 'center' }}>
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {currentRows
                                                .filter((row) => {
                                                    if (!filterBy || !filterValue) return true;
                                                    return row[filterBy].toLowerCase().includes(filterValue.toLowerCase());
                                                })
                                                .filter((row) => {
                                                    if (!searchQuery) return true;
                                                    return Object.values(row)
                                                        .join(' ')
                                                        .toLowerCase()
                                                        .includes(searchQuery.toLowerCase());
                                                })
                                                .map((row) => (
                                                    <TableRow
                                                        key={row._id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row._id}
                                                        </TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.email}</TableCell>
                                                        <TableCell>{row.role}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <Button >
                                                                <RemoveRedEyeIcon onClick={() => handleViewModalOpen(row)}
                                                                    sx={{ color: '#8B8FA7' }} />
                                                            </Button>
                                                            <Button onClick={() => handleEditModalOpen(row)}>
                                                                <EditIcon sx={{ color: '#6684FF' }} />
                                                            </Button>
                                                            <Button onClick={() => handleDeleteDialogOpen(row)}>
                                                                <DeleteIcon sx={{ color: '#F7002B' }} />
                                                            </Button>
                                                        </TableCell>

                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TablePagination
                                    component="div"
                                    count={data.length}
                                    page={currentPage}
                                    onPageChange={handlePageChange}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={[]}
                                />
                            </div>
                            <AddUserModal
                                isOpen={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setIsAddUserModalClosed(true);
                                }}
                                onSubmit={handleFormSubmit}
                                onAddUserSuccess={handleAddUserSuccess} // Pass the callback function here
                            />
                            <EditUserModal
                                isOpen={isEditModalOpen}
                                onClose={handleEditModalClose}
                                onSubmit={handleEditFormSubmit}
                                data={editedUser}
                            />

                            <ViewUserModal
                                isOpen={isViewModalOpen}
                                onClose={handleViewModalClose}
                                onSubmit={handleViewFormSubmit}
                                data={viewUser}
                            />

                            <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
                                <DialogTitle>Delete User</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete the user?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDeleteDialogClose} >Cancel</Button>
                                    <Button onClick={handleDeleteUser} color="error" >
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default User;
