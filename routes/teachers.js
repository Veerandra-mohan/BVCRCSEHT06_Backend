const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

// GET all teachers
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Teachers');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST a new teacher
router.post('/', async (req, res) => {
  try {
    const { name, subject, email } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('subject', sql.NVarChar, subject)
      .input('email', sql.NVarChar, email)
      .query('INSERT INTO Teachers (name, subject, email) VALUES (@name, @subject, @email)');
    res.status(201).send('Teacher created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT (update) a teacher
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, email } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('subject', sql.NVarChar, subject)
      .input('email', sql.NVarChar, email)
      .query('UPDATE Teachers SET name = @name, subject = @subject, email = @email WHERE id = @id');
    res.send('Teacher updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE a teacher
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Teachers WHERE id = @id');
    res.send('Teacher deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
