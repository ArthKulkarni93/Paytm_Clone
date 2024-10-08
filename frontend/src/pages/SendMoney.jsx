import axios from "axios";
import { useState } from "react"
import { useLocation } from "react-router-dom";


export const SendMoney = () => {
    const location = useLocation(); 
    const { to } =location.state;
    const [amount, setAmount] = useState(0);

    const call = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/v1/account/transfer', {
                amount, to
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
        } catch (error) {
            console.error("Error fetching balance:", error);
            setError("Failed to load balance."); // S
        }
    }
    

    return <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div
                className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
            >
                <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="text-3xl font-bold text-center">Send Money</h2>
                </div>
                <div className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-2xl text-white">A</span>
                    </div>
                    <h3 className="text-2xl font-semibold">Friend's Name</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        //for="amount"
                    >
                        Amount (in Rs)
                    </label>
                    <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="amount"
                        onChange={(e)=>setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                    </div>
                    <button onClick={call}
                    className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                        Initiate Transfer
                    </button>
                </div>
                </div>
        </div>
      </div>
    </div>
}