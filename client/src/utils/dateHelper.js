// src/utils/dateHelper.js
export const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { color: 'transparent', label: 'N/A' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 60 ദിവസത്തിന് മുകളിൽ കളർ വേണ്ട
    if (diffDays > 60) return { color: 'transparent', label: `${diffDays} days left` };
    
    // അലർട്ടുകൾ (60 ദിവസത്തിന് താഴെ)
    if (diffDays <= 0) return { color: '#ff4d4d', label: 'Expired' };      // Red
    if (diffDays <= 15) return { color: '#ff8533', label: 'Urgent' };     // Orange
    if (diffDays <= 30) return { color: '#ffcc00', label: 'Warning' };    // Yellow
    if (diffDays <= 60) return { color: '#66ccff', label: 'Follow up' };  // Light Blue
    
    return { color: 'transparent', label: `${diffDays} days` };
};