"use client";

import axios from "axios";
import { useState, ChangeEvent } from "react";
import Image from "next/image";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const NEXT_PUBLIC_CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

export function UploadImage({ onImageAdded, image }: { onImageAdded: (image: string) => void; image?: string }) {
  const [uploading, setUploading] = useState(false);

  async function onFileSelect(e: ChangeEvent<HTMLInputElement>) {
    setUploading(true);
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Get presigned POST data from backend
      const response = await axios.get(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/user/presigned-url`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log(response)

      const { preSignedUrl, fields } = response.data;

      const formData = new FormData();

      // Append all returned fields dynamically
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // Append the file last
      formData.append("file", file);

      // POST the formData to DO Spaces presigned URL
      await axios.post(preSignedUrl, formData);

      // Construct the public URL of the uploaded file
      // Fields.key contains the path of the uploaded object
      const publicUrl = `${NEXT_PUBLIC_CLOUDFRONT_URL}/${fields.key}`;

      onImageAdded(publicUrl);
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setUploading(false);
    }
  }

  if (image) {
    return (
      <div className="relative w-96 h-48">
        <Image 
          src={image} 
          alt="uploaded" 
          fill
          className="p-2 rounded object-cover"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="w-40 h-40 rounded border text-2xl cursor-pointer">
        <div className="h-full flex justify-center flex-col relative w-full">
          <div className="h-full flex justify-center w-full pt-16 text-4xl">
            {uploading ? (
              <div className="text-sm">Loading...</div>
            ) : (
              <>
                +
                <input
                  className="w-full h-full bg-red-400 w-40 h-40"
                  type="file"
                  style={{ position: "absolute", opacity: 0, top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%" }}
                  onChange={onFileSelect}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
