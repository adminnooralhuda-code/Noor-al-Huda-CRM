require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const companyRoutes = require('./routes/companyRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes'); // ഈ ലൈൻ ആഡ് ചെയ്യുക



const app = express();
connectDB();

app.use(cors({
    origin: '*', // അല്ലെങ്കിൽ നിങ്ങളുടെ ഫ്രണ്ട്-എൻഡ് ലൈവ് URL ഇവിടെ നൽകാം
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes); // ഇവിടെയാണ് '/api/companies' ഡിഫൈൻ ചെയ്തത്
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes); // ഈ ലൈൻ ആഡ് ചെയ്യുക
app.use('/api/customers', customerRoutes); // ഈ ലൈൻ ആഡ് ചെയ്യുക


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));