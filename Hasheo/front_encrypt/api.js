import axios from 'axios';
const API_URL = 'http://localhost:3000'; // Cambia esto a la URL de tu API

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/users/name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by name:', error);
    throw error;
  }
};

export const addUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const countUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/count`);
    return response.data;
  } catch (error) {
    console.error('Error counting users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}