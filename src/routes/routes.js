import { Router } from 'express';
import path from 'path';
import { agregarUsuario, agregarTransferencia, obtenerUsuarios, obtenerTransferencias, editarUsuario, eliminarUsuario } from '../controllers/dbactions.js';

const router = Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Devuelve la aplicación cliente disponible en el apoyo de la prueba.
router.get('/', (req, res) => {
    try {
        res.sendFile(__dirname + '/index.html');
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para registrar un nuevo usuario.
router.post('/usuario', async (req, res) => {
    const { nombre, balance } = req.body;
    try {
        const usuario = await agregarUsuario(nombre, balance);
        res.json(usuario);
    } catch (error) {
        manejadorErrores(error, 'Error al agregar el usuario:');
        res.status(500).json({error: 'Error interno del servidor'});
    }
});

router.post('/transferencia', async (req, res) => {
    const { emisor, receptor, monto } = req.body;
    try {
        const transferencia = await agregarTransferencia(emisor, receptor, monto);
        res.json(transferencia);
    } catch (error) {
        manejadorErrores(error, 'Error al agregar la transferencia:');
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para obtener todos los usuarios.
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        manejadorErrores(error, 'Error al obtener los usuarios:');
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/transferencias', async (req, res) => {
    try {
        const transferencias = await obtenerTransferencias();
        res.json(transferencias);
    } catch (error) {
        manejadorErrores(error, 'Error al obtener las transferencias:');
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para actualizar un usuario.
router.put('/usuario', async (req, res) => {;
    const { nombre, balance, id } = req.body;
    try {
        const usuario = await editarUsuario(nombre, balance, id);
        if (usuario.rowCount === 0) {
            res.status(404).send('Nombre de usuario no encontrado');
        } else {
            console.log('Nombre de usuario y balance actualizado exitosamente');
            res.json(usuario.rows);
        }
    } catch (error) {
        manejadorErrores(error, 'Error al actualizar usuario:');
        res.status(500).send('Error interno del servidor');
    }
});
  
// Ruta para eliminar un usuario.
router.delete('/usuario', async (req, res) => {
    const { id } = req.query;
    try {
        const usuario = await eliminarUsuario(id);
        if (usuario.rowCount === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            console.log('Usuario eliminado exitosamente');
            res.json(usuario.rows);
        }
    } catch (error) {
        manejadorErrores(error, 'Error al eliminar usuario:');
        res.status(500).send('Error interno del servidor');
    }
});

const manejadorErrores = (error, mensajeError) => {
    console.error(mensajeError, error.message);
};

export default router;