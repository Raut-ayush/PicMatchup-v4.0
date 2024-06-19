import React, { useState } from 'react';
import axios from 'axios';

const DeleteUser = ({ adminToken }) => {
    const [email, setEmail] = useState('');

    const handleDelete = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/admin/delete', { email }, {
                headers: {
                    'Authorization': adminToken
                }
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    return (
        <div>
            <h2>Delete User</h2>
            <input
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button onClick={handleDelete}>Delete User</button>
        </div>
    );
};

export default DeleteUser;
