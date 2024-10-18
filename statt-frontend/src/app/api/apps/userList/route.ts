import axios from 'axios';

export const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3001/user/all-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUsersById = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by Id:', error);
    throw error;
  }
};

export const addUser = async (userData: any) => {
  try {
    const response = await axios.post('http://localhost:3001/user/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, updatedData: any) => {
  try {
    const response = await axios.put(`http://localhost:3001/user/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:3001/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
