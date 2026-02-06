'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

async function getUser() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null
    return await prisma.user.findUnique({ where: { email: session.user.email } })
}

export async function updateProfile(prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    const imageFile = formData.get('image') as File

    const user = await getUser()
    if (!user) return { success: false, message: 'Unauthorized' }

    let imageUrl = user.image

    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
            const uploadDir = path.join(process.cwd(), "public/uploads");

            await mkdir(uploadDir, { recursive: true });
            await writeFile(path.join(uploadDir, filename), buffer);
            imageUrl = `/uploads/${filename}`;
        } catch (e) {
            console.error(e)
            return { success: false, message: 'Image upload failed' }
        }
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { name, image: imageUrl }
        })
        return { success: true, message: 'Profile updated' }
    } catch (e) {
        return { success: false, message: 'Failed to update profile' }
    }
}
