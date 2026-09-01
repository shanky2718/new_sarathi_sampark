import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
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
      return NextResponse.json(formatted);
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, category, entity, documentNumber, fileSize } = await req.json();
    const docId = `DOC-${Math.floor(200 + Math.random() * 800)}`;
    const docNo = documentNumber || `DOC-${Math.floor(100000 + Math.random() * 899999)}`;

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `INSERT INTO digital_documents (doc_id, title, category, entity, upload_date, status, file_size, document_number)
         VALUES (?, ?, ?, ?, CURRENT_DATE(), 'Pending', ?, ?)`,
        [docId, title, category || 'RC', entity || 'TRK-101', fileSize || '1.5 MB', docNo]
      );
    }

    return NextResponse.json({
      docId,
      title,
      category: category || 'RC',
      entity: entity || 'TRK-101',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      fileSize: fileSize || '1.5 MB',
      documentNumber: docNo
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
