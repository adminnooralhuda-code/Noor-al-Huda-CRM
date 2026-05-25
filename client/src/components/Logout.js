const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/'; // ലോഗിൻ പേജിലേക്ക് തിരിച്ചുവിടുന്നു
};

// സൈഡ്‌ബാറിൽ:
<li style={{ marginBottom: '15px', cursor: 'pointer', color: '#fff' }} onClick={handleLogout}>
    Logout
</li>