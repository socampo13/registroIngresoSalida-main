const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database('./registros.db', (err) => {
    if(err){
        console.error('Error ak conectar la BD:', err.message);
    }else{
        console.log('Conectado a la BD');
    }
});

db.run(`
  CREATE TABLE IF NOT EXISTS personas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    horaEntrada TEXT,
    horaSalida TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error al crear la tabla:', err.message);
  }
});
// Ruta para registrar personas
app.post('/registrar', (req, res) => {
    const { nombre, apellido } = req.body;
  
    if (!nombre || !apellido) {
      return res.status(400).send('Nombre y apellido son obligatorios');
    }
  
    // Verificar si la persona ya existe en la base de datos
    db.get(`SELECT * FROM personas WHERE nombre = ? AND apellido = ?`, [nombre, apellido], (err, row) => {
      if (err) {
        return res.status(500).send('Error al consultar la base de datos');
      }
  
      if (row) {
        // Si ya existe, actualizar la hora de salida
        const horaSalida = new Date().toLocaleString();
        db.run(`UPDATE personas SET horaSalida = ? WHERE id = ?`, [horaSalida, row.id], (err) => {
          if (err) {
            return res.status(500).send('Error al actualizar la hora de salida');
          }
          res.send(`Hora de salida registrada para ${nombre} ${apellido}.`);
        });
      } else {
        // Si no existe, registrar una nueva entrada
        const horaEntrada = new Date().toLocaleString();
        db.run(`INSERT INTO personas (nombre, apellido, horaEntrada) VALUES (?, ?, ?)`, [nombre, apellido, horaEntrada], (err) => {
          if (err) {
            return res.status(500).send('Error al registrar en la base de datos');
          }
          res.send(`Registro exitoso para ${nombre} ${apellido}. Hora de entrada: ${horaEntrada}`);
        });
      }
    });
  });
  
  // Ruta para obtener todas las personas registradas
  app.get('/personas', (req, res) => {
    db.all(`SELECT * FROM personas`, [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error al consultar la base de datos');
      }
      res.json(rows);
    });
  });
  
  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });