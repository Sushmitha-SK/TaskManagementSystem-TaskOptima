import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard_Admin from './pages/Dashboard_Admin';
import Dashboard from './pages/Dashboard';
import Task from './pages/Task';
import Task_Admin from './pages/Task_Admin';
import User from './pages/User';
import Profile from './pages/Profile';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard-admin" element={<Dashboard_Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task" element={<Task />} />
          <Route path="/task-admin" element={<Task_Admin />} />
          <Route path="/user" element={<User />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
