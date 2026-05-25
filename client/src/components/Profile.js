import React, { useEffect, useState } from 'react'; // useState, useEffect ഇംപോർട്ട് ചെയ്യാൻ മറക്കരുത്
import api from '../api';

function Profile() {
    const [user, setUser] = useState(null);
    const [mobile, setMobile] = useState(''); // മൊബൈൽ നമ്പർ സ്റ്റോർ ചെയ്യാൻ

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await api.get('/me', {
                    headers: { 'Authorization': token }
                });
                setUser(res.data);
                setMobile(res.data.mobile || ''); // നിലവിലുള്ള മൊബൈൽ നമ്പർ സെറ്റ് ചെയ്യുന്നു
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    const updateProfile = async (e) => {
        e.preventDefault(); // ഫോം സബ്മിറ്റ് ആകുമ്പോൾ പേജ് റീലോഡ് ആകുന്നത് തടയാൻ
        try {
            const token = localStorage.getItem('token');
            await api.put('/profile', { mobile }, {
                headers: { 'Authorization': token }
            });
            alert('Profile updated!');
        } catch (error) {
            alert('Update failed');
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <p>Email: {user.email}</p>

            {/* എഡിറ്റ് പ്രൊഫൈൽ ഫോം */}
            <form onSubmit={updateProfile}>
                <input 
                    type="text" 
                    value={mobile} 
                    onChange={(e) => setMobile(e.target.value)} 
                    placeholder="Enter mobile number" 
                />
                <button type="submit">Update Profile</button>
            </form>

            <br />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Profile;