import crypto from 'crypto';

export interface WhatsAppMessageResponse {
  messaging_product: string;
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
}

export class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private apiVersion: string = 'v21.0';

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  private get apiUrl() {
    return `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  }

  /**
   * Sends a generic template message
   */
  async sendTemplateMessage(to: string, templateName: string, components: any[] = []) {
    const payload = {
      messaging_product: 'whatsapp',
      to: this.formatPhoneNumber(to),
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' }, // Adjust as needed
        components
      }
    };

    return this.postRequest(payload);
  }

  /**
   * Sends an image-based template message
   */
  async sendImageTemplateMessage(to: string, templateName: string, imageUrl: string, bodyTextParams: string[] = []) {
    const components: any[] = [
      {
        type: 'header',
        parameters: [
          {
            type: 'image',
            image: { link: imageUrl }
          }
        ]
      }
    ];

    if (bodyTextParams.length > 0) {
      components.push({
        type: 'body',
        parameters: bodyTextParams.map(param => ({ type: 'text', text: param }))
      });
    }

    return this.sendTemplateMessage(to, templateName, components);
  }

  /**
   * Sends a promotional template message
   */
  async sendPromotionalTemplate(to: string, templateName: string, bodyParams: string[] = []) {
    const components: any[] = [
      {
        type: 'body',
        parameters: bodyParams.map(param => ({ type: 'text', text: param }))
      }
    ];
    return this.sendTemplateMessage(to, templateName, components);
  }

  /**
   * Sends an order update template message
   */
  async sendOrderUpdateTemplate(to: string, templateName: string, orderId: string, status: string) {
    const components: any[] = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: orderId },
          { type: 'text', text: status }
        ]
      }
    ];
    return this.sendTemplateMessage(to, templateName, components);
  }

  /**
   * Formats phone number to include country code without '+' or spaces
   */
  private formatPhoneNumber(phone: string) {
    const clean = phone.replace(/\D/g, '');
    // Ensure it has a country code if missing? 
    // For now, assume users provide full number with country code.
    return clean;
  }

  private async postRequest(payload: any): Promise<WhatsAppMessageResponse> {
    // Development logging
    console.log(`[WhatsApp API] Sending to ${payload.to}:`, JSON.stringify(payload, null, 2));

    if (!this.accessToken || !this.phoneNumberId) {
      console.warn('[WhatsApp API] Missing credentials. Skipping actual request.');
      // Return a mock response for development if credentials are missing
      if (process.env.NODE_ENV === 'development') {
        return {
          messaging_product: 'whatsapp',
          contacts: [{ input: payload.to, wa_id: payload.to }],
          messages: [{ id: `mock_${Date.now()}` }]
        };
      }
      throw new Error('WhatsApp API credentials are not configured');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[WhatsApp API] Error:', JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || 'Failed to send WhatsApp message');
    }

    return data;
  }

  /**
   * Verifies the signature from Meta webhooks
   */
  verifyWebhookSignature(payload: string, signature: string) {
    const appSecret = process.env.META_APP_SECRET || '';
    if (!appSecret) {
      console.error('[WhatsApp Webhook] META_APP_SECRET is not set');
      return false;
    }
    const hmac = crypto.createHmac('sha256', appSecret);
    const digest = hmac.update(payload).digest('hex');
    const expectedSignature = `sha256=${digest}`;
    return signature === expectedSignature;
  }
}

export const whatsappService = new WhatsAppService();
