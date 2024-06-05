import pg from "pg"; // Importamos el módulo pg para conectarnos a la base de datos
const { Pool } = pg; // Extraemos el objeto Pool de pg

const USER_DB = "postgres";
const HOST_DB =  "localhost";
const NAME_DB = "bancosolar";
const PASS_DB = "1234";
const PORT_DB = 5432;

// Creamos una nueva instancia de Pool con la configuración
const pool = new Pool({
    connectionString: `postgres://${USER_DB}:${PASS_DB}@${HOST_DB}:${PORT_DB}/${NAME_DB}`,
}); 

export default pool; // Exportamos la configuración de la conexión