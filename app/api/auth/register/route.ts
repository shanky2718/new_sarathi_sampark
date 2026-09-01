import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { hashPassword, generateToken, getAuthorizedAdminEmails } from '@/lib/auth';
import { logAuditAction } from '@/lib/auditLogger';

export async function POST(req: Request) {
  try {
    const { name, email, mobile, password, role, companyName, gstNumber, address } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const authorizedAdmins = getAuthorizedAdminEmails();

    let userRole = 'Transporter';
    if (authorizedAdmins.includes(cleanEmail)) {
      userRole = 'Admin';
    } else {
      userRole = (role && role !== 'Admin') ? role : 'Transporter';
    }

    const hashed = await hashPassword(password);
    const compName = companyName || 'Sarathi Transports';

    const pool = await getDbPool();

    if (pool) {
      const [existing]: any = await pool.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
      if (existing.length > 0) {
        await logAuditAction(null, cleanEmail, 'failed_registration', 'Attempted to register with existing email');
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }

      const [result]: any = await pool.execute(
        `INSERT INTO users (name, email, mobile, password_hash, role, company_name, gst_number, address, onboarded) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [name, cleanEmail, mobile || null, hashed, userRole, compName, gstNumber || null, address || null]
      );

      const userId = result.insertId;
      const token = generateToken({ id: userId, email: cleanEmail, role: userRole });

      await logAuditAction(userId, cleanEmail, 'user_registration', `New ${userRole} account registered for ${name}`);

      return NextResponse.json({
        user: {
          id: userId,
          name,
          email: cleanEmail,
          mobile,
          role: userRole,
          companyName: compName,
          gstNumber,
          onboarded: true
        },
        token
      }, { status: 201 });
    } else {
      const userId = Date.now();
      const token = generateToken({ id: userId, email: cleanEmail, role: userRole });
      return NextResponse.json({
        user: {
          id: userId,
          name,
          email: cleanEmail,
          mobile,
          role: userRole,
          companyName: compName,
          onboarded: true
        },
        token
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error during registration' }, { status: 500 });
  }
}
