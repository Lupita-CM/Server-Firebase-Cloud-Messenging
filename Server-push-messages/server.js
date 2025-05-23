const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');

// Configura Firebase Admin SDK
const serviceAccount = require('./firebase-admin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// Configura EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Carpeta donde están tus archivos EJS

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Para archivos CSS/JS estáticos

// Ruta principal (renderiza el formulario)
app.get('/', (req, res) => {
  res.render('index', { message: null }); // 'index' es tu archivo EJS sin extensión
});

// Ruta para enviar notificaciones
app.post('/send', async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const message = {
      notification: { title, body },
      token: token
    };

    const response = await admin.messaging().send(message);
    res.render('index', { 
      message: `✅ Notificación enviada: ${response}` 
    });
  } catch (error) {
    res.render('index', { 
      message: `❌ Error: ${error.message}` 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});