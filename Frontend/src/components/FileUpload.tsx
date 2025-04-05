import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, Clipboard, Brain, Activity, X, File } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface FileWithPreview {
  file: File;
  preview?: string;
}

const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API key. Ensure it's in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

interface FileUploadProps {
  onAnalysisComplete: (results: any[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onAnalysisComplete,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeWithGemini = async (fileObj: FileWithPreview) => {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
      });

      const medicalPrompt = `
        Analyze this medical report as a senior radiologist. Follow this structure:
        - Clinical Findings: Identify key pathological features
        - Interpretation: Medical significance of findings
        - Differential Diagnosis: List possible conditions (most likely first)
        - Recommendations: Next steps for clinical correlation
        - Confidence Level: Percentage certainty of findings

        Format response as JSON with keys: 
        fileName, findings, diagnosis, recommendations, confidenceLevel.
      `;

      // Convert file to base64
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileObj.file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      const base64Data = fileData.split(",")[1];

      const result = await model.generateContent({
        contents: [
          {
            parts: [
              { text: medicalPrompt },
              {
                inlineData: {
                  data: base64Data,
                  mimeType: fileObj.file.type,
                },
              },
            ],
          },
        ],
      });

      const response = await result.response;
      const responseText = response.text();

      if (!responseText) throw new Error("Invalid AI response format");

      // Improved JSON parsing with error handling
      const rawResponse = responseText.replace(/```json|```/g, "");
      let parsedResponse;

      try {
        parsedResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Failed to parse AI response");
      }

      return {
        fileName: parsedResponse.fileName || fileObj.file.name,
        findings:
          typeof parsedResponse.findings === "string"
            ? parsedResponse.findings
            : JSON.stringify(parsedResponse.findings, null, 2),
        diagnosis:
          typeof parsedResponse.diagnosis === "string"
            ? parsedResponse.diagnosis
            : JSON.stringify(parsedResponse.diagnosis, null, 2),
        recommendations:
          typeof parsedResponse.recommendations === "string"
            ? parsedResponse.recommendations
            : JSON.stringify(parsedResponse.recommendations, null, 2),
        confidenceLevel: parsedResponse.confidenceLevel || 0,
      };
    } catch (error) {
      console.error("Analysis error:", error);
      throw new Error("Failed to analyze report");
    }
  };

  const analyzeReports = async () => {
    setIsAnalyzing(true);
    const loadingToast = toast.loading("Analyzing medical reports...");

    try {
      const analysisPromises = files.map(async (fileObj) => {
        const result = await analyzeWithGemini(fileObj);
        return {
          fileName: fileObj.file.name,
          content: fileObj.file.type.startsWith("image/")
            ? "Medical Imaging"
            : "Text Report",
          ...result,
        };
      });

      const analysisResults = await Promise.all(analysisPromises);
      onAnalysisComplete(analysisResults);
      toast.success("Analysis completed successfully!", { id: loadingToast });
    } catch (error) {
      toast.error("Analysis failed. Please try again.", { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const existingFileNames = new Set(files.map((file) => file.file.name));

      const newFiles = acceptedFiles
        .filter((file) => !existingFileNames.has(file.name))
        .map((file) => ({
          file,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        }));

      if (newFiles.length === 0) {
        toast.error("Duplicate file detected. Please upload unique files.");
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded successfully`);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast.error(`${file.name} is too large. Max size is 10MB`);
          } else {
            toast.error(`Error uploading ${file.name}: ${error.message}`);
          }
        });
      });
    },
  });

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles((files) =>
      files.filter((file) => file.file !== fileToRemove.file)
    );
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragActive
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-green-500"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <div>
            <p className="text-lg text-gray-700">
              {isDragActive
                ? "Drop files here"
                : "Drag medical reports or click to browse"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports: JPG, PNG, PDF (Max size: 10MB)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clipboard className="w-5 h-5" />
              Uploaded Files ({files.length})
            </h3>
            <button
              onClick={analyzeReports}
              disabled={isAnalyzing}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isAnalyzing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Start Analysis
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {files.map((fileObj, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <File className="w-12 h-12 text-gray-400" />
                  <span className="text-sm">{fileObj.file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(fileObj)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
