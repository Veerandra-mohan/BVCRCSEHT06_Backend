const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

// GET all enrollments
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Enrollments');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET enrollments by studentId
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('studentId', sql.Int, studentId)
      .query('SELECT * FROM Enrollments WHERE studentId = @studentId');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET enrollments by courseId
router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('courseId', sql.Int, courseId)
      .query('SELECT * FROM Enrollments WHERE courseId = @courseId');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST a new enrollment
router.post('/', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('studentId', sql.Int, studentId)
      .input('courseId', sql.Int, courseId)
      .query('INSERT INTO Enrollments (studentId, courseId) VALUES (@studentId, @courseId)');
    res.status(201).send('Enrollment created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE an enrollment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Enrollments WHERE id = @id');
    res.send('Enrollment deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;