import pool from './dbconnect.js';

export const agregarUsuario = async (nombre, balance) => {  // Función para agregar un estudiante a la base de datos
    try {
        if (!nombre || !balance) {
            throw new Error('Datos de los usuarios incompletos. Debe ingresar nombre y balance');
        } else {
            const query = 'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *';
            const values = [nombre, balance];
            const result = await pool.query(query, values);
            console.log('Usuario agregado correctamente.');
            return result;
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
    }
};

export const agregarTransferencia = async (emisor, receptor, monto) => {
    let client;
    try {
        if (!emisor || !receptor || !monto) {
            return res.status(400).json({
                status: "Error",
                message: "Se requieren emisor, receptor y monto en la solicitud.",
                code: 400
            });
        }
        client = await pool.connect();
        await client.query('BEGIN');
        await client.query('UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2', [monto, emisor]);
        await client.query('UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2', [monto, receptor]);
        const insertTransferencia = 'INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ((SELECT id FROM usuarios WHERE nombre = $1), (SELECT id FROM usuarios WHERE nombre = $2), $3, NOW())';
        const result = await client.query(insertTransferencia, [emisor, receptor, monto]);
        await client.query('COMMIT');
        console.log('Transferencia agregada correctamente.');
        return result.rows[0];
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error('Error al registrar la transferencia:', error);
        throw error; // Propagar el error para que pueda ser manejado en la capa superior
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const obtenerUsuarios = async () => {    // Función para obtener todos los estudiantes
    try {
        const query = 'SELECT * FROM usuarios';
        const result = await pool.query(query);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener las canciones:', error);
    }
};

export const obtenerTransferencias = async () => {    // Función para obtener todas las transferencias
    try {
        const query = `
            SELECT t.*, e.nombre AS nombre_emisor, r.nombre AS nombre_receptor
            FROM transferencias t
            INNER JOIN usuarios e ON t.emisor = e.id
            INNER JOIN usuarios r ON t.receptor = r.id
        `;
        const result = await pool.query(query);
        console.log(result.rows);
        return result.rows;
    }  catch (error) {
        res.status(500).json({
            error: "Error al obtener las transferencias de la base de datos",
        });
      
    }
};

export const editarUsuario = async (nombre, balance, id) => {    // Función para actualizar un estudiante
    try {
        if (!nombre || !balance) {
            console.error('Datos de los usuarios incompletos. Debe ingresar nombre, balance');
        } else {
            const query = 'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *';
            const values = [nombre, balance, id];
            const result = await pool.query(query, values);
            console.log('Usuario editado correctamente.');
            return result;
        }
    } catch (error) {
        console.error('Error al editar el usuario correctamente:', error);
    }
};

export const eliminarUsuario = async (id) => {
    let client;
    try {
        if (!id) {
            console.error('El id es un campo obligatorio.');
        } else {
            client = await pool.connect();
            await client.query('BEGIN');
            await client.query('DELETE FROM transferencias WHERE emisor = $1 OR receptor = $1', [id]);
            const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
            const result = await client.query(query, [id]);
            await client.query('COMMIT');
            console.log('Usuario eliminado correctamente.');
            return result;
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar el usuario:', error);
    } finally {
        client.release();
    }
};