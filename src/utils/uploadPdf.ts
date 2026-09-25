import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadPdfToFirebase = async (
  file: File,
  folder = "adhiveshana"
) => {
  const fileRef = ref(
    storage,
    `${folder}/${Date.now()}_${file.name}`
  );

  await uploadBytes(fileRef, file, {
    contentType: "application/pdf",
  });

  return await getDownloadURL(fileRef);
};