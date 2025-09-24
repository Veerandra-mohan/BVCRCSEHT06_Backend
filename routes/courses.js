const express = require('express');
const router = express.Router();

module.exports = (db) => {

router.get('/', async (req, res) => {
  try {
    const coursesRef = db.collection('courses');
    const snapshot = await coursesRef.get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(courses);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, teacherId } = req.body;
    const newCourseRef = await db.collection('courses').add({ title, description, teacherId });
    res.status(201).json({ id: newCourseRef.id, title, description, teacherId });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, teacherId } = req.body;
    await db.collection('courses').doc(id).update({ title, description, teacherId });
    res.send('Course updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE a course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('courses').doc(id).delete();
    res.send('Course deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

return router;
};
