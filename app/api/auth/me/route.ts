import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { getUserFromRequest, getAuthorizedAdminEmails } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    const userEmail = authUser?.email || 'transporter@sarathi.in';
    const authorizedAdmins = getAuthorizedAdminEmails();

    const pool = await getDbPool();
    if (pool) {
      try {
        const [users]: any = await pool.execute(
          'SELECT id, name, email, mobile, role, company_name, gst_number, city, onboarded FROM users WHERE email = ?',
          [userEmail]
        );
        if (users.length > 0) {
          const u = users[0];
          const isAuthorizedAdmin = authorizedAdmins.includes(u.email.toLowerCase());
          const finalRole = isAuthorizedAdmin ? 'Admin' : (u.role === 'Admin' ? 'Transporter' : u.role);

          return NextResponse.json({
            id: u.id,
            name: u.name,
            email: u.email,
            mobile: u.mobile,
            role: finalRole,
            companyName: u.company_name,
            gstNumber: u.gst_number,
            city: u.city,
            onboarded: Boolean(u.onboarded)
          });
        }
      } catch (dbErr: any) {
        console.warn('MySQL pool execute error during /api/auth/me:', dbErr.message);
      }
    }

    const isOwnerAdmin = authorizedAdmins.includes(userEmail.toLowerCase());
    return NextResponse.json({
      id: 1,
      name: isOwnerAdmin ? 'Platform Admin' : 'Srinivas Murthy',
      email: userEmail,
      role: isOwnerAdmin ? 'Admin' : 'Transporter',
      companyName: 'Sarathi Transports Pvt Ltd',
      onboarded: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
