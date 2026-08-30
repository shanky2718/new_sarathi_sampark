import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';

const router = Router();

// GET ALL DOCUMENTS
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM digital_documents ORDER BY id DESC');
      const formatted = rows.map((d: any) => ({
        docId: d.doc_id,
        title: d.title,
        category: d.category,
        entity: d.entity,
        uploadDate: d.upload_date ? new Date(d.upload_date).toISOString().split('T')[0] : '2026-08-28',
        expiryDate: d.expiry_date ? new Date(d.expiry_date).toISOString().split('T')[0] : null,
        status: d.status,
        fileSize: d.file_size,
        documentNumber: d.document_number
      }));
      return res.json(formatted);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// UPLOAD DOCUMENT
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, entity, documentNumber, fileSize } = req.body;
    const docId = `DOC-${Math.floor(200 + Math.random() * 800)}`;
    const docNo = documentNumber || `DOC-${Math.floor(100000 + Math.random() * 899999)}`;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO digital_documents (doc_id, title, category, entity, upload_date, status, file_size, document_number)
         VALUES (?, ?, ?, ?, CURRENT_DATE(), 'Pending', ?, ?)`,
        [docId, title, category || 'RC', entity || 'TRK-101', fileSize || '1.5 MB', docNo]
      );
    }

    return res.status(201).json({
      docId,
      title,
      category: category || 'RC',
      entity: entity || 'TRK-101',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      fileSize: fileSize || '1.5 MB',
      documentNumber: docNo
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// UPDATE DOCUMENT STATUS
router.put('/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const docId = req.params.id;
    const { status } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute('UPDATE digital_documents SET status = ? WHERE doc_id = ?', [status, docId]);
    }
    return res.json({ success: true, docId, status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
