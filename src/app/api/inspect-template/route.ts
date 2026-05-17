import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/security';

export async function GET() {
  try {
    const settings = await prisma.whatsAppSettings.findFirst();
    if (!settings || !settings.whatsapp_access_token) {
      return NextResponse.json({ error: "No WhatsApp settings found in DB" }, { status: 404 });
    }

    const token = decrypt(settings.whatsapp_access_token);
    if (!token) {
      return NextResponse.json({ error: "Failed to decrypt access token" }, { status: 500 });
    }

    const wabaId = settings.whatsapp_business_id;
    if (!wabaId) {
      return NextResponse.json({ error: "No WABA ID in settings" }, { status: 400 });
    }

    const url = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?name=product_announcement`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
