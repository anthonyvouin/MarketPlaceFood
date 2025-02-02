"use server"

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import cloudinary from 'cloudinary'; 

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ALLOWED_FILE_TYPES = ['image/png', 'image/webp', 'image/jpeg'];


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadTemporaryImageToCloudinary(formData: FormData): Promise<string> {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('Aucun fichier n\'a été téléchargé');
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream({
        folder: 'temp',
        resource_type: 'image',
        type: 'upload',
        invalidate: true,
        eager: [{ transformation: { width: 1500, crop: 'scale', quality: 'auto:good' } }],
      }, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Upload result is undefined'));
        }
      });
      uploadStream.end(buffer);
    });

    return result.secure_url;
}

export async function uploadImageToCloudinary(formData: FormData): Promise<string> {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('Aucun fichier n\'a été téléchargé');
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream({
        folder: 'uploads',
        resource_type: 'image',
        type: 'upload',
        eager: [{ transformation: { width: 1000, crop: 'scale' } }],
      }, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Upload result is undefined'));
        }
      });
      uploadStream.end(buffer);
    });

    return result.secure_url;
}


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