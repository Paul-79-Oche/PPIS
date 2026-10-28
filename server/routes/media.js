const express = require('express');
const multer = require('multer');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAdmin } = require('../middleware/auth');

// Setup multer for in-memory file handling before uploading to Supabase
const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET /api/media - Fetch all school media
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('school_media')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// ==========================================
// ADMIN ROUTES (Requires Auth)
// ==========================================

// POST /api/media - Upload new media
router.post('/', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { description, media_type } = req.body;

    if (!file || !media_type) {
      return res.status(400).json({ error: 'File and media_type are required' });
    }

    // 1. Upload to Supabase Storage
    const fileName = `${Date.now()}_${file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('school-media')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('school-media')
      .getPublicUrl(fileName);

    // 2. Insert metadata into Database
    const { data: dbData, error: dbError } = await supabase
      .from('school_media')
      .insert([
        {
          media_type,
          storage_path: publicUrl,
          description,
          uploader_id: req.user.id
        }
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    res.status(201).json(dbData);
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// DELETE /api/media/:id - Delete media
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get the record to find the storage path
    const { data: mediaItem, error: fetchError } = await supabase
      .from('school_media')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError || !mediaItem) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Extract filename from public URL (last segment)
    const fileName = mediaItem.storage_path.split('/').pop();

    // 2. Delete from Supabase Storage
    const { error: deleteStorageError } = await supabase.storage
      .from('school-media')
      .remove([fileName]);

    if (deleteStorageError) {
      console.error('Failed to delete file from storage:', deleteStorageError);
      // We continue to delete the DB record even if storage delete fails
    }

    // 3. Delete from Database
    const { error: dbError } = await supabase
      .from('school_media')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

module.exports = router;
