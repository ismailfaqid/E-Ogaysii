import { NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp';
import { prisma } from '@/lib/prisma';

/**
 * Meta Webhook Verification (GET)
 * Used by Meta to verify the endpoint when setting up the webhook.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verification successful');
    return new Response(challenge, { status: 200 });
  }

  console.warn('[WhatsApp Webhook] Verification failed: token mismatch');
  return new Response('Forbidden', { status: 403 });
}

/**
 * WhatsApp Webhook Events (POST)
 * Handles status updates (delivered, read, failed) and incoming messages.
 */
export async function POST(req: Request) {
  const payloadText = await req.text();
  const signature = req.headers.get('x-hub-signature-256') || '';

  // Validate the signature from Meta
  if (!whatsappService.verifyWebhookSignature(payloadText, signature)) {
    console.error('[WhatsApp Webhook] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(payloadText);
  
  // Log the event for the dashboard
  try {
    await prisma.webhookLog.create({
      data: {
        eventType: payload.entry?.[0]?.changes?.[0]?.field || 'unknown',
        payload: payload
      }
    });
  } catch (e) {
    console.error('[WhatsApp Webhook] Failed to log event:', e);
  }

  // Extract changes
  const entry = payload.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;

  if (!value) {
    return NextResponse.json({ received: true });
  }

  // Handle Status Updates (sent, delivered, read, failed)
  if (value.statuses) {
    for (const statusUpdate of value.statuses) {
      const { id: messageId, status, errors } = statusUpdate;
      
      console.log(`[WhatsApp Webhook] Status update for ${messageId}: ${status}`);

      try {
        await prisma.broadcastRecipient.update({
          where: { whatsapp_message_id: messageId },
          data: {
            status: status,
            errorMessage: errors ? JSON.stringify(errors) : undefined,
          }
        });
      } catch (e) {
        // If messageId is not found, it might be a message not sent through this system or a race condition
        console.warn(`[WhatsApp Webhook] Message ID ${messageId} not found in database`);
      }
    }
  }

  // Handle Incoming Messages (Replies)
  if (value.messages) {
    for (const message of value.messages) {
      const from = message.from;
      const body = message.text?.body;
      console.log(`[WhatsApp Webhook] Incoming message from ${from}: ${body}`);
      
      // TODO: Implement conversation tracking or CRM integration
    }
  }

  return NextResponse.json({ received: true });
}
