"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface EvidenceUploadProps {
  onImageChange: (file: File | null) => void;
  currentImage: File | null;
}

export default function EvidenceUpload({
  onImageChange,
  currentImage,
}: EvidenceUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      onImageChange(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageChange(files[0]);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-3">
        Attach Evidence（証拠写真を添付）
      </label>

      {!currentImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-green-400 bg-green-500/10"
              : "border-gray-700 hover:border-green-500/50 hover:bg-gray-900/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload
            size={32}
            className={`mx-auto mb-3 ${
              isDragging ? "text-green-400" : "text-gray-500"
            }`}
          />
          <p className="text-sm text-gray-400 mb-2">
            ドラッグ＆ドロップまたはクリックして画像を選択
          </p>
          <p className="text-xs text-gray-600">
            証拠写真を添付すると信頼性ボーナスが適用されます
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="border-2 border-green-500/50 rounded-lg p-4 bg-gray-900">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                <img
                  src={URL.createObjectURL(currentImage)}
                  alt="証拠写真"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon size={16} className="text-green-400" />
                  <span className="text-sm font-semibold text-white">
                    {currentImage.name}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {(currentImage.size / 1024).toFixed(1)} KB
                </div>
                <div className="mt-2 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400 inline-block">
                  証拠あり：インパクト 1.5x 適用中
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-colors"
              >
                <X size={18} className="text-red-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

