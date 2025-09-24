const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

// GET all students
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Students');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST a new student
router.post('/', async (req, res) => {
  try {
    const { name, grade, email } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('grade', sql.Int, grade)
      .input('email', sql.NVarChar, email)
      .query('INSERT INTO Students (name, grade, email) VALUES (@name, @grade, @email)');
    res.status(201).send('Student created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT (update) a student
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade, email } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('grade', sql.Int, grade)
      .input('email', sql.NVarChar, email)
      .query('UPDATE Students SET name = @name, grade = @grade, email = @email WHERE id = @id');
    res.send('Student updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Students WHERE id = @id');
    res.send('Student deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
