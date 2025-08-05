// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/application');
const adminRoutes = require("./routes/adminRoutes");
const newsRoutes = require("./routes/newsRoutes"); // ⭐ Nouveau : Importe les routes des actualités publiques
const messageRoutes = require("./routes/messageRoutes"); // ⭐ NOUVEAU : Importe les routes des messages

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/news", newsRoutes); // ⭐ Nouveau : Utilise les routes des actualités publiques
app.use("/api/messages", messageRoutes); 
// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));