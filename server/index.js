import express from 'express';
import cors from 'cors';
import routes from '../src/routes/routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta base para las canciones
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});