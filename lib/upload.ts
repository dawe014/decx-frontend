import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Acceptable MIME types
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

export async function handleMediaUpload(
  file: File,
  folder: string = "uploads"
) {
  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    throw new Error("Unsupported file type");
  }

  const ext = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${ext}`;
  const subfolder = isVideo ? "videos" : "images"; // separate folders if desired
  const uploadPath = path.join(
    process.cwd(),
    "public",
    folder,
    subfolder,
    fileName
  );

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(uploadPath, buffer);

  const url = `/${folder}/${subfolder}/${fileName}`;
  return {
    url,
    type: isImage ? "image" : "video",
    fileName,
  };
}
