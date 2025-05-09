const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/appointments', (req, res) => {
  db.query('SELECT * FROM appointments', (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(result);
  });
});


app.post('/appointments', (req, res) => {
  const { hospital, patient, doctor, contact, date, reason } = req.body;

  if (!hospital || !patient || !doctor || !contact || !date || !reason) {
    return res.status(400).send('Missing required fields');
  }

  db.query('INSERT INTO appointments (hospital, patient, doctor, contact, date, reason) VALUES (?, ?, ?, ?, ?, ?)',
    [hospital, patient, doctor, contact, date, reason], (err) => {
      if (err) return res.status(500).json({ error: 'Insert failed' });
      res.json({ success: true });
  });
});


app.delete('/appointments/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM appointments WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ success: true });
  });
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
