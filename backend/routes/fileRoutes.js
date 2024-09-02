const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require('../config/multerConfig');
const File = require('../models/fileModels');
const fs = require('fs');

// Subir archivo
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { originalname, size, mimetype } = file;

    // Crear un nuevo documento con metadatos
    const newFile = new File({
      filename: file.filename,
      originalName: originalname,
      size,
      type: mimetype,
      uploadDate: new Date(),
      url: `/uploads/${file.filename}`,
    });

    await newFile.save();
    res.json({ message: 'Archivo subido y metadatos almacenados.', file: newFile });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).json({ error: 'Error al subir el archivo.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { name, size } = req.query;
    const query = {};

    if (name) query.filename = new RegExp(name, 'i');
    if (size) query.size = size;

    console.log("Query:", query);  // Verifica que la consulta sea correcta

    const files = await File.find(query);
    console.log("Archivos encontrados:", files);  // Verifica los resultados

    if (!files.length) {
      console.log("No se encontraron archivos.");
      return res.status(404).json({ message: 'No se encontraron archivos.' });
    }

    res.json(files);
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    res.status(500).json({ error: 'Error al obtener los archivos.' });
  }
});

// Descargar archivo
router.get('/download/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const file = await File.findOne({ filename });
    if (!file) return res.status(404).json({ error: 'Archivo no encontrado' });

    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    // Usar el nombre original del archivo en la cabecera de la respuesta
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error al descargar archivo:', err);
        res.status(500).json({ error: 'Error al descargar el archivo.' });
      }
    });
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    res.status(500).json({ error: 'Error al descargar el archivo.' });
  }
});

// Eliminar archivo por nombre
router.delete('/delete/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    // Construir la ruta del archivo
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    console.log(`Ruta del archivo a eliminar: ${filePath}`);

    // Eliminar el archivo del sistema de archivos
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Error al eliminar el archivo del sistema:', err);
        return res.status(500).json({ error: 'Error al eliminar el archivo del sistema.' });
      }

      // Eliminar el archivo de la base de datos
      await File.findOneAndDelete({ filename });
      console.log('Archivo eliminado correctamente de la base de datos');
      res.json({ message: 'Archivo eliminado correctamente.' });
    });
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    res.status(500).json({ error: 'Error al eliminar el archivo.' });
  }
});


module.exports = router;
