import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';
import careersRoutes from './routes/careersRoutes.js';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const corsOptions = {
    origin: 'http://localhost:5173'
};
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: "Too many requests from this IP, please try again later"
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/api', apiLimiter);
app.use('/api/contact', contactRoutes);
app.use('/api/careers', careersRoutes);
// Serve the built React frontend files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendBuildPath = path.resolve(__dirname, '../../../react-frontend/dist');
app.use(express.static(frontendBuildPath));
// Catch-all route handler for serving the frontend index.html
app.get('*', (req, res)=>{
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});

//# sourceMappingURL=server.js.map