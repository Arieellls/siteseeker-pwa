"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [predictedFilePath, setPredictedFilePath] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8080/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "File uploaded successfully!");

        // Check if it's an image or video and set the predicted file path
        if (result.image_path) {
          setPredictedFilePath(result.image_path);
        } else if (result.video_path) {
          setPredictedFilePath(result.video_path);
        }
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to upload the file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred." + error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="my-5 text-center">Upload an Image or Video</h1>
      {message && <p className="text-center text-green-500">{message}</p>}
      <form
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input
          className="border border-gray-300"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>

      {/* Display the prediction result */}
      {predictedFilePath && (
        <div className="mt-5">
          {predictedFilePath.endsWith(".mp4") ? (
            <video controls width="600">
              <source
                src={`http://localhost:8080/${predictedFilePath}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={`http://localhost:8080/${predictedFilePath}`}
              alt="Prediction result"
              width="600"
              height={400}
            />
          )}
        </div>
      )}
    </div>
  );
}
