import React, { useState, useRef } from 'react';
import { FaFilePdf, FaFileWord, FaFileUpload, FaTimes, FaPaste, FaCloudUploadAlt } from 'react-icons/fa';
import { uploadJobDescription } from '../../services/chatbotApi';

export default function FileUpload({ onJDReady, isProcessing }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mode, setMode] = useState('upload'); // 'upload' or 'paste'
  const [pastedText, setPastedText] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setUploadError(null);
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setUploadError('Please select a valid PDF, DOCX, or TXT file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadRes = await uploadJobDescription(selectedFile);
      // Callback to parent to trigger analysis
      onJDReady({ sessionId: uploadRes.session_id, filename: selectedFile.name });
    } catch (err) {
      setUploadError(err.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasteAnalyze = () => {
    if (!pastedText.trim() || pastedText.trim().length < 30) {
      setUploadError('Job description text must be at least 30 characters.');
      return;
    }
    setUploadError(null);
    onJDReady({ jdText: pastedText.trim(), filename: 'Pasted Job Description' });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Mode Toggle: File Upload vs Paste Text */}
      <div className="flex border border-white/10 rounded-xl p-1 bg-white/5">
        <button
          onClick={() => { setMode('upload'); setUploadError(null); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
            mode === 'upload' ? 'bg-primary text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaFileUpload size={12} /> Upload File
        </button>
        <button
          onClick={() => { setMode('paste'); setUploadError(null); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
            mode === 'paste' ? 'bg-primary text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaPaste size={12} /> Paste Text
        </button>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-start gap-2">
          <FaTimes className="text-red-400 mt-0.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Mode 1: File Upload */}
      {mode === 'upload' ? (
        <div className="space-y-3">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-primary bg-primary/10'
                : 'border-white/10 hover:border-primary/40 bg-white/5 hover:bg-white/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <FaCloudUploadAlt className="mx-auto text-primary text-3xl mb-2" />
            <p className="text-xs font-medium text-white mb-1">
              Drag & drop your Job Description here
            </p>
            <p className="text-[11px] text-gray-400">
              Supports <span className="text-sky-300 font-medium">PDF, DOCX, TXT</span> (Max 5MB)
            </p>
          </div>

          {/* Selected File Card */}
          {selectedFile && (
            <div className="bg-card border border-primary/30 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {selectedFile.name.endsWith('.pdf') ? (
                  <FaFilePdf className="text-red-400 flex-shrink-0" size={18} />
                ) : (
                  <FaFileWord className="text-blue-400 flex-shrink-0" size={18} />
                )}
                <div className="truncate">
                  <p className="text-xs text-white font-medium truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-gray-400">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-red-400 p-1 cursor-pointer transition-colors"
                title="Remove file"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}

          <button
            onClick={handleUploadAndAnalyze}
            disabled={!selectedFile || isUploading || isProcessing}
            className="w-full bg-gradient-to-r from-primary to-sky-600 hover:from-sky-400 hover:to-primary disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading || isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Job Description...
              </>
            ) : (
              'Upload & Compare Profile'
            )}
          </button>
        </div>
      ) : (
        /* Mode 2: Paste Text */
        <div className="space-y-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste complete Job Description text here (roles, responsibilities, required skills)..."
            rows={7}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors resize-none"
          />
          <button
            onClick={handlePasteAnalyze}
            disabled={!pastedText.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-primary to-sky-600 hover:from-sky-400 hover:to-primary disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Job Description...
              </>
            ) : (
              'Analyze Pasted JD'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
