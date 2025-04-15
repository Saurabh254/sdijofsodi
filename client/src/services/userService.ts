import api from '../api_client';
import { User } from './authService';

export interface ProfileUpdateData {
    name?: string;
    email?: string;
    class?: string;
    rollNumber: string;
}

export const getProfile = async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
};

export const updateProfile = async (data: ProfileUpdateData): Promise<User> => {
    const response = await api.put<User>('/users/profile', data);
    // Update user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
};