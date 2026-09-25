import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImageToFirebase = async (
  file: File,
  folder = "elections"
) => {
  const extension = file.type || "image/jpeg";

  const fileRef = ref(
    storage,
    `${folder}/${Date.now()}_${file.name}`
  );

  await uploadBytes(fileRef, file, {
    contentType: extension,
  });

  return await getDownloadURL(fileRef);
};