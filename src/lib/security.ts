import crypto from 'crypto';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Ensure this key is 32 characters for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'antigravity_secure_v1_key_32_chars'; 
const IV_LENGTH = 16;

/**
 * Encrypts sensitive text (e.g. WhatsApp Access Tokens)
 */
export function encrypt(text: string) {
    if (!text) return null;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts sensitive text
 */
export function decrypt(text: string | null) {
    if (!text) return null;
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        console.error('Decryption failed', e);
        return null;
    }
}

/**
 * Validates international phone numbers
 */
export function validateWhatsAppNumber(number: string) {
    // Removes non-digits and checks length (10-15 digits)
    const clean = number.replace(/\D/g, '');
    return clean.length >= 10 && clean.length <= 15;
}

/**
 * Server-side check for admin role
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        redirect('/login');
    }
    return session;
}

/**
 * Server-side check for authenticated user
 */
export async function requireAuth() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    return session;
}
