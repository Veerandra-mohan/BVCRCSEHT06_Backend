const express = require('express');
const router = express.Router();

module.exports = (db) => {

router.get('/', async (req, res) => {
  try {
    const enrollmentsRef = db.collection('enrollments');
    const snapshot = await enrollmentsRef.get();
    const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(enrollments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollmentsRef = db.collection('enrollments');
    const snapshot = await enrollmentsRef.where('studentId', '==', studentId).get();
    const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(enrollments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollmentsRef = db.collection('enrollments');
    const snapshot = await enrollmentsRef.where('courseId', '==', courseId).get();
    const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(enrollments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const newEnrollmentRef = await db.collection('enrollments').add({ studentId, courseId });
    res.status(201).json({ id: newEnrollmentRef.id, studentId, courseId });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('enrollments').doc(id).delete();
    res.send('Enrollment deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

return router;
};