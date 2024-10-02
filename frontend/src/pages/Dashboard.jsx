import { useState, useEffect } from "react";
import axios from "axios";
import { Profile } from "../components/Profile";

export function Dashboard() {
    const [users, setUsers] = useState([]); // Set initial state to an array
    const [filter, setFilter] = useState('');
    const [error, setError] = useState(null); // State for error handling
    const [balance, setBalance] = useState(''); // State for user balance

    const fetchBal = async () => {
        try {
            const token = localStorage.getItem('token'); // Ensure case matches what you set
            const response = await axios.get('http://localhost:3000/api/v1/account/balance', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBalance(response.data.balance); // Set balance from API response
        } catch (error) {
            console.error("Error fetching balance:", error);
            setError("Failed to load balance."); // Set error message if needed
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`);
            const { data } = response;
            setUsers(data.user || []); // Ensure this is an array
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users."); // Set error message
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchBal();
    }, [filter]);

    return (
        <div className="bg-white h-screen items-center">
            <header className="flex justify-between p-6">
                <div className="font-bold text-xl">Payments App</div>
                <hr />
                <div>Hello User, U</div>
            </header>
            <div className="p-6 font-bold text-lg">Your Balance : ${balance}</div>
            <div className="p-6 font-bold text-lg">Users</div>
            <div className="flex justify-center mt-5 px-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="border border-gray-300 w-full max-w-[1500px] px-3 py-2"
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            {
                users.map((user) => (
                    <Profile key={user._id} label={user} /> // Ensure user.id is unique
                ))
            }
            {error && <div className="text-red-500">{error}</div>} {/* Display error if exists */}
        </div>
    );
}
