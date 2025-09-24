const express = require('express');
const router = express.Router();

module.exports = (db) => {

router.get('/', async (req, res) => {
  try {
    const teachersRef = db.collection('teachers');
    const snapshot = await teachersRef.get();
    const teachers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(teachers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, subject, email } = req.body;
    const newTeacherRef = await db.collection('teachers').add({ name, subject, email });
    res.status(201).json({ id: newTeacherRef.id, name, subject, email });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, email } = req.body;
    await db.collection('teachers').doc(id).update({ name, subject, email });
    res.send('Teacher updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE a teacher
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('teachers').doc(id).delete();
    res.send('Teacher deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

return router;
};
