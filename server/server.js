
const express = require('express');
const path = require('path');
const { Client } = require('pg'); // Importa el cliente de PostgreSQL

const app = express();

// Configura los datos de conexión
const client = new Client({
    user: 'dbmasteruser',          // Usuario de PostgreSQL
    host: 'ls-ef6cea836d847f09c85f3d354ae9db50bd1912c5.c1a60uoi6neh.us-east-1.rds.amazonaws.com',           // Host de la base de datos (o IP del servidor)
    database: 'gdb_3031',       // Nombre de la base de datos
    password: 'x|8)]Xu5q6&[^8Ps[OiMDo*NppV5!H1g',   // Contraseña del usuario
    port: 5432, 
    ssl: {
        rejectUnauthorized: false,   // Verifica el certificado                 // Puerto donde está PostgreSQL (por defecto 5432)
    }
    });

//     // Conectar a la base de datos
// client.connect(err => {
//     if (err) {
//       console.error('Error conectando a la base de datos con SSL', err.stack);
//     } else {
//       console.log('Conectado a la base de datos PostgreSQL con SSL');
//     }
//   });


// // *** Servir archivos estáticos (CSS, JS, imágenes) ***
// app.use(express.static(path.join(__dirname, '../public')));

// // Ruta (index.html)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public', 'index.html'));
// });

// //Endpoints
// // Endpoint para consultar todas las tablas del esquema public
// app.get('/tablas', async (req, res) => {
//   try {
//     const query = `
//       SELECT table_name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public'
//       AND table_name NOT IN ('geography_columns', 'geometry_columns', 'spatial_ref_sys');
//     `;
//     const result = await client.query(query);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error ejecutando la consulta', err);
//     res.status(500).send('Error al obtener las tablas');
//   }
// });

// // tablas geo

// app.get('/tablasgeo', async (req, res) => {
//   try {
//     const query = `
//       SELECT f_table_name AS table_name
//       FROM geometry_columns
//       WHERE f_table_schema = 'public';
//     `;
//     const result = await client.query(query);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error ejecutando la consulta', err);
//     res.status(500).send('Error al obtener las tablas con geometría');
//   }
// });

// // Ruta para consultar datos de una tabla específica en el esquema 'public'
// app.get('/tablas/:nombreTabla', async (req, res) => {
//     const nombreTabla = req.params.nombreTabla;
  
//     try {
//       // Ejecutar consulta a la tabla específica
//       const result = await client.query(`
//         SELECT * FROM public.${nombreTabla};
//       `);
//       res.json(result.rows);  // Devuelve los datos de la tabla en formato JSON
//     } catch (err) {
//       console.error('Error ejecutando la consulta', err.stack);
//       res.status(500).send(`Error al consultar la tabla ${nombreTabla}`);
//     }
//   });


// Conectar a la base de datos
client.connect(err => {
  if (err) {
      console.error('Error conectando a la base de datos con SSL', err.stack);
  } else {
      console.log('Conectado a la base de datos PostgreSQL con SSL');
  }
});

// *** Servir archivos estáticos (CSS, JS, imágenes) ***
app.use(express.static(path.join(__dirname, '../public')));

// Ruta principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// *** Endpoints ***

// Endpoint para consultar todas las tablas del esquema public
app.get('/tablas', async (req, res) => {
  try {
      const query = `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name NOT IN ('geography_columns', 'geometry_columns', 'spatial_ref_sys');
      `;
      const result = await client.query(query);
      res.json(result.rows);
  } catch (err) {
      console.error('Error ejecutando la consulta', err);
      res.status(500).send('Error al obtener las tablas');
  }
});

// Endpoint para consultar tablas con geometría (geo)
app.get('/tablasgeo', async (req, res) => {
  try {
      const query = `
          SELECT f_table_name AS table_name
          FROM geometry_columns
          WHERE f_table_schema = 'public';
      `;
      const result = await client.query(query);
      res.json(result.rows);
  } catch (err) {
      console.error('Error ejecutando la consulta', err);
      res.status(500).send('Error al obtener las tablas con geometría');
  }
});

// Endpoint para consultar los datos de una tabla específica en formato GeoJSON
app.get('/tablas/:nombreTabla', async (req, res) => {
  const nombreTabla = req.params.nombreTabla;

  try {
      // Ejecutar la consulta para obtener los datos de la tabla en formato GeoJSON
      const result = await client.query(`
          SELECT ST_AsGeoJSON(geom) AS geometry, * 
          FROM public.${nombreTabla};
      `);

      // Formatear los datos como un FeatureCollection de GeoJSON
      const geojson = {
          type: "FeatureCollection",
          features: result.rows.map(row => ({
              type: "Feature",
              geometry: JSON.parse(row.geometry),
              properties: row  // Puedes ajustar las propiedades que desees incluir
          }))
      };
      res.json(geojson);
  } catch (err) {
      console.error('Error ejecutando la consulta', err.stack);
      res.status(500).send(`Error al consultar la tabla ${nombreTabla}`);
    }
});
// // Desplegar en un servicio local a través del puerto 3030
app.listen(3031, () => {
    console.log('Servidor ejecutándose en http://localhost:3031');
});