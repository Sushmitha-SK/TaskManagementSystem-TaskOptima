import axios from "axios";
import api from './endPoint'

//Add Task
export async function addTask(title, description, assignedTo, dueDate) {

    const URL = api.baseApi + `/api/task/addtask`
    try {
        const response = await axios.post(URL,
            JSON.stringify({
                "title": title,
                "description": description,
                "assignedto": assignedTo,
                "duedate": dueDate
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            }
        );

        if (response.status == 200) {
            return response;
        }
    }
    catch (error) {
        console.log('Error', error);
    }
}

//Get User Task
export async function getUserTask() {
    const URL = api.baseApi + `/api/task/fetchalltask`
    try {
        const response = await axios.get(URL, {
            headers: {
                "Content-Type": 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })
        if (response.status === 200) {
            return response;
        }
    }
    catch (error) {
        console.log('Error', error)
    }
}



//Edit Task
export async function editTask(taskid, title, description, assignedTo, dueDate, status) {

    const URL = api.baseApi + `/api/task/updatetask/${taskid}`
    try {
        const response = await axios.put(URL,
            JSON.stringify({
                "title": title,
                "description": description,
                "assignedto": assignedTo,
                "duedate": dueDate,
                "status": status
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            }
        );
        if (response.status == 200) {
            return response;
        }
    }
    catch (error) {
        console.log('Error', error);
    }
}


//Delete Task
export async function deleteTask(id) {

    const URL = api.baseApi + `/api/task/deletetask/${id}`
    try {
        const response = await axios.delete(URL,

            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            }
        );

        if (response.status == 200) {
            return response;
        }
    }
    catch (error) {
        console.log('Error', error);
    }
}


//Get all task

export async function getAllTask() {

    const URL = api.baseApi + `/api/task/alltasks`
    try {
        const response = await axios.get(URL,

            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (response.status == 200) {
            return response;
        }
    }
    catch (error) {
        console.log('Error', error);
    }
}