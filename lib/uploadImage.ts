"use server"

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ALLOWED_FILE_TYPES = ['image/png', 'image/webp', 'image/jpeg'];

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('Aucun fichier n\'a été téléchargé')
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Type de fichier non autorisé. Seuls PNG, WebP et JPG sont acceptés.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`La taille du fichier dépasse la limite maximale de ${MAX_FILE_SIZE / 1024 / 1024} MB.`)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = `${Date.now()}-${file.name}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const filePath = path.join(uploadDir, fileName)

  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (error) {
    console.error("Erreur lors de la création du dossier 'uploads':", error)
  }

  await writeFile(filePath, buffer)
  return `/uploads/${fileName}` 
}