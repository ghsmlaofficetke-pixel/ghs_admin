import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadPdfToFirebase = async (file: File) => {
  try {
    const fileRef = ref(
      storage,
      `adhiveshana/${Date.now()}_${file.name}`
    );

    // ✅ add metadata
    const metadata = {
      contentType: "application/pdf",
    };

    await uploadBytes(fileRef, file, metadata);

    const url = await getDownloadURL(fileRef);

    return url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};