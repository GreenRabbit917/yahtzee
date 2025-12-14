import express from 'express';
import { db } from './db/index.js'; // Your Drizzle connection
import { game } from './db/schema.js';
import cors from 'cors';

const PORT = process.env.PORT || 3030;


const app = express();

const corsOptions = {
    origin: '*', // http://localhost:3000', // Only allow requests from your frontend
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    console.log('Root route hit!');
    res.send(`Hello bradley!`);
});

app.get('/games', async (req, res) => {
    const allGames = await db
        .select()
        .from(game);
    res.status(200).send(allGames);
})

app.put('/game', async (req, res) => {
    const game = await db.insert(game).values({});
    res.status(200).send(game);
})

app.listen(PORT,  () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Click to open: http://localhost:${PORT}`);
});
