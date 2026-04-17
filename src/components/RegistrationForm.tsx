'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { useFileUpload } from '../lib/hooks/useFileUpload';
import { supabase } from '../lib/supabase/client';
import { BatchYear, BATCH_LABELS } from '../lib/database.types';

export function RegistrationForm() {
  const { uploadFile, uploading: isUploading } = useFileUpload();
  
  const [formData, setFormData] = useState({
    student_id: '',
    title_prefix: '',
    full_name: '',
    email: '',
    batch: '' as BatchYear,
  });
  
  const webcamRef = useRef<Webcam>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhotoPreview(imageSrc);
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
          setPhoto(file);
          setShowCamera(false);
        });
    }
  }, [webcamRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id || !formData.title_prefix || !formData.full_name || !formData.email || !formData.batch) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    if (!photo) {
      setError('จำเป็นต้องใช้รูปถ่ายใบหน้าสำหรับการลงทะเบียน กรุณาถ่ายภาพ');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let photo_url = null;

      // Upload photo
      photo_url = await uploadFile(photo);
      if (!photo_url) {
        throw new Error('ไม่สามารถอัพโหลดรูปภาพได้');
      }

      // Insert into student table
      const { error: dbError } = await supabase
        .from('students')
        .insert([
          {
            student_id: formData.student_id,
            title_prefix: formData.title_prefix,
            full_name: formData.full_name,
            email: formData.email,
            batch: formData.batch,
            photo_url,
          },
        ]);

      if (dbError) throw dbError;

      // Success
      setSuccess(true);
      // Reset form
      setFormData({ student_id: '', title_prefix: '', full_name: '', email: '', batch: '' as BatchYear });
      setPhoto(null);
      setPhotoPreview(null);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการลงทะเบียน';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">ลงทะเบียน</h2>
        <p className="text-white/60 mb-8">ขอเชิญบัณฑิตและผู้เข้าร่วมงานลงทะเบียนเพื่อจัดทำสถิติข้อมูล</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Photo Webcam Capture */}
          <div className="flex flex-col items-center justify-center mb-2 gap-3">
            <div className="relative flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-white/20 bg-black/50 overflow-hidden shadow-inner">
              {showCamera ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="4" strokeWidth={2} />
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-widest text-center">รูปถ่าย<br/>ใบหน้า</span>
                </div>
              )}
              
              {/* Face Guide Overlay */}
              {showCamera && (
                <div className="absolute inset-0 border-[3px] border-dashed border-white/60 rounded-full pointer-events-none scale-[0.80] opacity-80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
              )}
            </div>

            {/* Camera Controls */}
            {showCamera ? (
              <button 
                type="button" 
                onClick={capture} 
                className="text-sm bg-white text-black font-semibold px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-lg border border-transparent"
              >
                📸 ถ่ายภาพ
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setShowCamera(true)} 
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition-colors border border-white/20 font-medium"
              >
                {photoPreview ? 'ถ่ายภาพใหม่' : 'เปิดกล้อง'}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/80">รหัสนักศึกษา *</label>
            <input
              type="text"
              required
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              placeholder="เช่น 406x590xx"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/80">คำนำหน้าชื่อ (Title) *</label>
            <select
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition appearance-none"
              value={formData.title_prefix}
              onChange={(e) => setFormData({ ...formData, title_prefix: e.target.value })}
            >
              <option value="" disabled style={{ background: '#171717', color: '#888' }}>-- เลือกคำนำหน้าชื่อ --</option>
              <option value="นาย" style={{ background: '#171717' }}>นาย</option>
              <option value="นางสาว" style={{ background: '#171717' }}>นางสาว</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/80">ชื่อ-นามสกุล *</label>
            <input
              type="text"
              required
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              placeholder="สมชาย ใจดี"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/80">อีเมลมหาวิทยาลัย *</label>
            <input
              type="email"
              required
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              placeholder="student@yru.ac.th"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/80">ปีการศึกษา (รุ่น) *</label>
            <select
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition appearance-none"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value as BatchYear })}
            >
              <option value="" disabled style={{ background: '#171717', color: '#888' }}>-- เลือกปีการศึกษา (รุ่น) --</option>
              {(Object.keys(BATCH_LABELS) as BatchYear[]).map((year) => (
                <option key={year} value={year} style={{ background: '#171717' }}>
                  {BATCH_LABELS[year]}
                </option>
              ))}
            </select>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200 text-sm">
                ลงทะเบียนสำเร็จ!
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting || isUploading || showCamera}
            className="mt-4 w-full bg-white text-black font-semibold rounded-xl py-3.5 px-4 transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isUploading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนตอนนี้'}
          </button>
        </form>
      </div>
    </div>
  );
}
