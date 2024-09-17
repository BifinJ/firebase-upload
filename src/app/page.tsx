import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">Welcome to File Uploader</h1>
        <p className="text-lg mb-8 text-gray-600">
          Upload files like images, videos, PDFs, PPTs, and audio files easily.
        </p>
        <Link href="/pages/upload" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Upload Page
        </Link>
      </div>
    </div>
  );
}
