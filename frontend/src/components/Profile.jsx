import {useNavigate} from 'react-router-dom'
export function Profile({ label }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between p-6">
            <div>
                {label.firstname} {label.lastname} 
            </div>
            <div>
                <button className="bg-black text-white" onClick={()=>navigate('/send', { state:{to:label._id}})}>Send Money</button>
            </div>
        </div>
    );
}