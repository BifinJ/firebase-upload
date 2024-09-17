"use client";
import { ChangeEvent, useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebaseConfig";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadMessage, setUploadMessage] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      setErrorMessage("Please select a file to upload");
      return;
    }

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
      },
      (error) => setErrorMessage(error.message),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFileUrl(url);
          setUploadMessage(true); // Show the success message
          setFile(null);
          setProgress(0);
          setErrorMessage("");

          // Hide the success message after 3 seconds
          setTimeout(() => {
            setUploadMessage(false);
            setFileUrl(null);
          }, 3000);
        });
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Upload Your Files</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,video/*,.pdf,.ppt,.pptx,audio/*"
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        {file && <p className="mb-4 text-sm text-gray-600">Selected file: {file.name}</p>}
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Upload File
        </button>
        {uploadMessage && (
          <div className="mt-6">
            <p className="text-green-500">File uploaded successfully!</p>
          </div>
        )}
        <button className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg hover:bg-gray-600">
          <a href="/pages/files">View All Uploaded Files</a>
        </button>
      </div>
    </div>
  );
}
