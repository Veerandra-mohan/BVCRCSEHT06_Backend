const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Courses');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST a new course
router.post('/', async (req, res) => {
  try {
    const { title, description, teacherId } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('teacherId', sql.Int, teacherId)
      .query('INSERT INTO Courses (title, description, teacherId) VALUES (@title, @description, @teacherId)');
    res.status(201).send('Course created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT (update) a course
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, teacherId } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('teacherId', sql.Int, teacherId)
      .query('UPDATE Courses SET title = @title, description = @description, teacherId = @teacherId WHERE id = @id');
    res.send('Course updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE a course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Courses WHERE id = @id');
    res.send('Course deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
