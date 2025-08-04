import axios from 'axios';

const API_BASE = 'http://localhost:5112/api/draw';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Token not found");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const decodePrompt = async (prompt) => {
  try {
    const response = await axiosInstance.post('/decode', prompt, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error decoding the prompt:', error.response?.data || error.message);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/login', { username, password });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const saveDrawing = async (name, jsonData, messages) => {
  const dto = {
    name,
    jsonData: JSON.stringify(jsonData),
    prompt: JSON.stringify(messages),
  };
  try {
    const response = await axiosInstance.post('/drawing', dto, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error saving:", error.response?.data || error.message);
    throw error;
  }
};

export async function updateDrawing(id, name, commands, messages) {
const dto = {
    name,
    jsonData: JSON.stringify(commands),
    prompt: JSON.stringify(messages),
  };
  try {
    const response = await axiosInstance.put(`/drawing/${id}`, dto, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating drawing:', error.response?.data || error.message);
    throw error;
  }
};


export const loadUserDrawings = async () => {
  try {
    const response = await axiosInstance.get('/user-drawings', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error loading drawings:", error.response?.data || error.message);
    throw error;
  }
};
