'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { encrypt, decrypt } from '@/lib/security'
import { revalidatePath } from 'next/cache'

/**
 * Gets the current user's email from the session
 */
async function getEmail() {
    const session = await getServerSession(authOptions)
    return session?.user?.email
}

/**
 * Retrieves WhatsApp settings for the current user
 */
export async function getWhatsAppSettings() {
    const email = await getEmail()
    if (!email) return null

    const settings = await prisma.whatsAppSettings.findUnique({
        where: { business_email: email }
    })

    if (settings && settings.whatsapp_access_token) {
        // Decrypt the token before returning to the UI (caution: use sparingly)
        try {
            settings.whatsapp_access_token = decrypt(settings.whatsapp_access_token) || '';
        } catch (e) {
            settings.whatsapp_access_token = '';
        }
    }

    return settings
}

/**
 * Saves or updates WhatsApp API settings
 */
export async function saveWhatsAppSettings(prevState: any, formData: FormData) {
    const email = await getEmail()
    if (!email) return { success: false, message: "Unauthorized" }

    const appId = formData.get('meta_app_id') as string
    const appSecret = formData.get('meta_app_secret') as string
    const phoneId = formData.get('whatsapp_phone_number_id') as string
    const businessId = formData.get('whatsapp_business_id') as string
    const accessToken = formData.get('whatsapp_access_token') as string
    const verifyToken = formData.get('whatsapp_verify_token') as string

    try {
        await prisma.whatsAppSettings.upsert({
            where: { business_email: email },
            update: {
                meta_app_id: appId,
                meta_app_secret: appSecret,
                whatsapp_phone_number_id: phoneId,
                whatsapp_business_id: businessId,
                whatsapp_access_token: encrypt(accessToken),
                whatsapp_verify_token: verifyToken
            },
            create: {
                business_email: email,
                meta_app_id: appId,
                meta_app_secret: appSecret,
                whatsapp_phone_number_id: phoneId,
                whatsapp_business_id: businessId,
                whatsapp_access_token: encrypt(accessToken),
                whatsapp_verify_token: verifyToken
            }
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE_WHATSAPP_SETTINGS',
                userEmail: email,
                details: 'WhatsApp API credentials updated'
            }
        })

        revalidatePath('/settings/whatsapp')
        return { success: true, message: "Settings saved successfully" }
    } catch (e) {
        console.error('[WhatsApp Settings] Save failed:', e)
        return { success: false, message: "Failed to save settings" }
    }
}

/**
 * Tests the connection to the WhatsApp Cloud API
 */
export async function testWhatsAppConnection() {
    const email = await getEmail()
    if (!email) return { success: false, message: "Unauthorized" }

    const settings = await prisma.whatsAppSettings.findUnique({
        where: { business_email: email }
    })

    if (!settings || !settings.whatsapp_access_token || !settings.whatsapp_phone_number_id) {
        return { success: false, message: "Missing credentials. Please save settings first." }
    }

    const token = decrypt(settings.whatsapp_access_token)
    if (!token) return { success: false, message: "Invalid access token" }
    
    try {
        // Simple API call to verify identity
        const response = await fetch(`https://graph.facebook.com/v21.0/${settings.whatsapp_phone_number_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const data = await response.json()
        
        if (response.ok) {
            return { 
                success: true, 
                message: "Connection successful! API is reachable.",
                data: {
                    id: data.id,
                    display_phone_number: data.display_phone_number
                }
            }
        } else {
            return { success: false, message: data.error?.message || "Connection failed" }
        }
    } catch (e) {
        console.error('[WhatsApp Settings] Test failed:', e)
        return { success: false, message: "Connection error: Could not reach Meta API" }
    }
}
