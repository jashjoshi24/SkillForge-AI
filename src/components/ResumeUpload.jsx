import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { extractResume } from '../services/api';
import { LoadingScanner } from './LoadingScanner';
import { ExtractionReview } from './ExtractionReview';
import { Upload, FileText, CheckCircle2, FileUp, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const ResumeUpload = () => {
  const { demoMode, targetRole, setActiveTab } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setSelectedFile(file);
    setIsScanning(true);
  };

  const handleSampleResume = () => {
    setSelectedFile({ name: 'Charmi_Sonagra_Resume_2026.pdf', size: 142000 });
    setIsScanning(true);
  };

  const handleScannerComplete = () => {
    setIsScanning(false);
    setIsReviewed(true);
  };

  const handleConfirmProfile = () => {
    setActiveTab('roadmap');
  };

  if (isScanning) {
    return (
      <div className="py-12">
        <LoadingScanner 
          title={`PARSING RESUME: ${selectedFile?.name || 'Uploaded Document'}`} 
          onComplete={handleScannerComplete} 
        />
      </div>
    );
  }

  if (isReviewed) {
    return <ExtractionReview onConfirm={handleConfirmProfile} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 font-mono text-xs">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16324F] border border-[#C89B3C]/40 text-[#C89B3C] text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LLM RESUME SKILL EXTRACTOR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#EDEDE3]">
          Upload Your Resume for Skill Cartography
        </h1>
        <p className="text-xs font-body text-[#A9B4C0] max-w-lg mx-auto">
          Our structured LLM parser extracts your technical skills, work history, and projects to calculate exact skill gap coordinates for <strong className="text-[#EDEDE3]">{targetRole}</strong>.
        </p>
      </div>

      {/* Drag & Drop Dropzone Card */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleFileDrop}
        className={`bg-[#16324F] p-10 rounded-md border-2 border-dashed transition-all text-center space-y-4 ${
          dragActive 
            ? 'border-[#C89B3C] bg-[#16324F]/80 shadow-2xl scale-[1.01]' 
            : 'border-[#EDEDE3]/20 hover:border-[#C89B3C]/50'
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-[#10243E] border border-[#C89B3C]/50 mx-auto flex items-center justify-center text-[#C89B3C]">
          <Upload className="w-8 h-8 animate-bounce-slow" />
        </div>

        <div className="space-y-1">
          <h3 className="font-display font-bold text-sm text-[#EDEDE3]">
            Drag & drop your resume PDF or DOCX file here
          </h3>
          <p className="text-[#A9B4C0] text-[11px]">
            Supports .pdf, .docx format up to 10MB
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <label className="px-5 py-2.5 rounded bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] font-bold text-xs tracking-wider cursor-pointer shadow inline-flex items-center gap-2">
            <FileUp className="w-4 h-4" />
            CHOOSE FILE
            <input 
              type="file" 
              accept=".pdf,.docx,.doc" 
              onChange={handleFileInput} 
              className="hidden" 
            />
          </label>

          <button
            onClick={handleSampleResume}
            className="px-4 py-2.5 rounded bg-[#10243E] hover:bg-[#16324F] text-[#EDEDE3] border border-[#EDEDE3]/20 text-xs tracking-wider inline-flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-[#6B9080]" />
            USE SAMPLE RESUME
          </button>
        </div>
      </div>

      {/* Security & Confidentiality Footer */}
      <div className="p-4 rounded bg-[#16324F]/60 border border-[#EDEDE3]/10 flex items-center justify-between text-[11px] text-[#A9B4C0]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6B9080]" />
          <span>DATA SECURITY: Client-side parsing & central API prompt isolation.</span>
        </div>
        <div className="text-[#C89B3C]">
          MODE: {demoMode ? 'STANDALONE DEMO' : 'LIVE FASTAPI'}
        </div>
      </div>

    </div>
  );
};
