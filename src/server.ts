import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db';

// load env vars
dotenv.config();

// connect to database
connectDB();

// route files
import auth from './routes/auth';
import admin from './routes/admin';
import nodes from './routes/nodes';
import edges from './routes/edges';
import preferences from './routes/preferences';
import routes from './routes/routes';

const app = express();

// body parser
app.use(express.json());

// set security headers
app.use(helmet());

// enable CORS
app.use(cors());

// mount routers
app.use('/api/auth', auth);
app.use('/api/admin', admin);
app.use('/api/nodes', nodes);
app.use('/api/edges', edges);
app.use('/api/preferences', preferences);
app.use('/api/routes', routes);

app.get('/', (req, res) => {
  res.send('TrueNavi API is running...');
});

const PORT = parseInt(process.env.PORT || '5000', 10);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${(err as Error).message}`);
  server.close(() => process.exit(1));
});
