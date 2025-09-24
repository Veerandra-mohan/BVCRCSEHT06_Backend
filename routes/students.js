const express = require('express');
const router = express.Router();

module.exports = (db) => {

router.get('/', async (req, res) => {
  try {
    const studentsRef = db.collection('students');
    const snapshot = await studentsRef.get();
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, grade, email } = req.body;
    const newStudentRef = await db.collection('students').add({ name, grade, email });
    res.status(201).json({ id: newStudentRef.id, name, grade, email });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade, email } = req.body;
    await db.collection('students').doc(id).update({ name, grade, email });
    res.send('Student updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('students').doc(id).delete();
    res.send('Student deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

return router;
};
