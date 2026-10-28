const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAdmin } = require('../middleware/auth');

// ==========================================
// STUDENT MANAGEMENT ROUTES (Admin)
// Must be defined BEFORE parameterized /:studentId route
// ==========================================

// GET /api/results/students - List all registered students
router.get('/students', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('studentreg')
      .select('*')
      .order('adm_year', { ascending: false })
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /api/results/students - Add a new student registration
router.post('/students', requireAdmin, async (req, res) => {
  try {
    const { name, age, adm_year } = req.body;

    if (!name || !age || !adm_year) {
      return res.status(400).json({ error: 'Missing required fields (name, age, adm_year)' });
    }

    const { data, error } = await supabase
      .from('studentreg')
      .insert([{ name, age, adm_year }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// DELETE /api/results/students/:id - Delete a student registration (cascades to results)
router.delete('/students/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('studentreg')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Student and related results deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// ==========================================
// PUBLIC RESULT LOOKUP ROUTES
// ==========================================

// GET /api/results/lookup?name=John&year=2023&term=First%20Term - Get results by name and year (and optional term)
router.get('/lookup', async (req, res) => {
  try {
    const { name, year, term } = req.query;
    
    if (!name || !year) {
      return res.status(400).json({ error: 'Name and year are required' });
    }

    // Find student by name (case-insensitive) and admission year
    const { data: student, error: studentError } = await supabase
      .from('studentreg')
      .select('id, name, adm_year, age')
      .ilike('name', `%${name}%`)
      .eq('adm_year', parseInt(year))
      .single();

    if (studentError || !student) {
      return res.status(404).json({ error: 'Student not found with the provided name and admission year' });
    }

    // Build results query with optional term filter
    let resultsQuery = supabase
      .from('student_results')
      .select('*')
      .eq('student_id', student.id);

    if (term && term !== 'All' && term !== 'All Terms') {
      resultsQuery = resultsQuery.eq('term', term);
    }

    const { data: results, error: resultsError } = await resultsQuery.order('term', { ascending: true });

    if (resultsError) throw resultsError;

    res.json({
      student,
      results,
      selectedTerm: term || 'All Terms'
    });
  } catch (error) {
    console.error('Error in result lookup:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// GET /api/results/:studentId - Get results for a student by ID (placed after static routes)
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // First verify if student exists
    const { data: student, error: studentError } = await supabase
      .from('studentreg')
      .select('name, adm_year, age')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Then get their results
    const { data: results, error: resultsError } = await supabase
      .from('student_results')
      .select('*')
      .eq('student_id', studentId)
      .order('term', { ascending: true });

    if (resultsError) throw resultsError;

    res.json({
      student,
      results
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// ==========================================
// RESULT CRUD ROUTES (Admin, Requires Auth)
// ==========================================

// POST /api/results - Create new student result
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { student_id, subject, score, grade, term } = req.body;

    if (!student_id || !subject || score == null || !grade || !term) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('student_results')
      .insert([{ student_id, subject, score, grade, term }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating result:', error);
    res.status(500).json({ error: 'Failed to create result' });
  }
});

// PUT /api/results/:id - Update student result
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('student_results')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ error: 'Failed to update result' });
  }
});

// DELETE /api/results/:id - Delete student result
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('student_results')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ error: 'Failed to delete result' });
  }
});

module.exports = router;
