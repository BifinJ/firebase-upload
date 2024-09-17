"use client";
import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import Link from "next/link";

type FileItem = {
  name: string;
  url: string;
};

export default function UploadedFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFiles = async () => {
      const storageRef = ref(storage, "uploads/");
      const fileList = await listAll(storageRef);

      const fileUrls = await Promise.all(
        fileList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        })
      );

      setFiles(fileUrls);
      setLoading(false);
    };

    fetchFiles();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading files...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Uploaded Files</h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {files.length === 0 ? (
          <p className="text-center text-gray-600">No files uploaded yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {files.map((file) => (
              <li key={file.name} className="bg-gray-200 p-4 rounded-lg">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-center mt-6">
        <Link href="/"  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Upload Page
        </Link>
      </div>
    </div>
  );
}
