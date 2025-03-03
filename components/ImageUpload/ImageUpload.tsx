'use client';

import { useState } from 'react';
import { Button, Stack } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import { ImageUploadProps } from '@/app/lib/definitions';

export default function ImageUpload({ setSelectedImage, setLoading }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { user } = useAppContext();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const deleteExistingImage = async (publicId: string) => {
    setLoading(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const response = await fetch('/api/cloudinary/cloudinary-signature', {
        method: 'POST',
        body: JSON.stringify({ public_id: publicId, timestamp }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch signature');

      const { signature } = await response.json();

      const deleteResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
          method: 'POST',
          body: new URLSearchParams({
            public_id: publicId,
            api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
            timestamp: timestamp.toString(),
            signature: signature.toString(),
          }),
        }
      );

      const deleteData = await deleteResponse.json();
    } catch (err) {
      console.error('Error deleting existing image:', err);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.userName) return;

    setUploading(true);
    const publicId = `profile_picture_${user._id}`;

    // Delete existing image
    await deleteExistingImage(publicId);

    // Upload new image
    const formData = new FormData();
    formData.append('file', file);
    formData.append('public_id', publicId);
    formData.append('invalidate', 'true');

    try {
      const response = await fetch('/api/cloudinary/cloudinary-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      setSelectedImage(`profilepictures/${publicId}`);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack align="center" mt={'-10px'}>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: 'none' }}
        id="fileInput"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label htmlFor="fileInput">
        <Button variant="subtle" component="span" c={'#9c9c9c'}>
          Choose Picture
        </Button>
      </label>
    </Stack>
  );
}
