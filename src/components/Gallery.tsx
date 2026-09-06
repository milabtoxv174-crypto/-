import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Upload, Trash2, Plus, Check } from 'lucide-react';
import { BotanicalCorner, FloralDivider } from './FloralDecor';
import { loadStoredPhotos, savePhotosToStorage, clearStoredPhotos, fileToDataUrl } from '../utils/photoStorage';
import { DEFAULT_WEDDING_PHOTOS } from '../data/defaultPhotos';

export const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>(DEFAULT_WEDDING_PHOTOS);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showManageModal, setShowManageModal] = useState<boolean>(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('edit') === 'true') {
        setIsAdminMode(true);
      }
    }
  }, []);

  // Load photos on mount from IndexedDB if user customized them, otherwise use DEFAULT_WEDDING_PHOTOS
  useEffect(() => {
    let isMounted = true;

    async function initPhotos() {
      try {
        const stored = await loadStoredPhotos();
        if (stored && stored.length > 0 && isMounted) {
          setPhotos(stored);
          return;
        }

        // Check if static photos are provided in /photos/
        try {
          const res = await fetch('/photos/wedding_photo_01.jpg', { method: 'HEAD' });
          if (res.ok) {
            const detected: string[] = [];
            for (let i = 1; i <= 12; i++) {
              const num = i < 10 ? `0${i}` : `${i}`;
              detected.push(`/photos/wedding_photo_${num}.jpg`);
            }
            if (isMounted) {
              setPhotos(detected);
              return;
            }
          }
        } catch {
          // Ignore network probe error
        }

        if (isMounted) {
          setPhotos(DEFAULT_WEDDING_PHOTOS);
        }
      } catch (err) {
        console.error('Failed to load gallery photos:', err);
        if (isMounted) {
          setPhotos(DEFAULT_WEDDING_PHOTOS);
        }
      }
    }

    initPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileList.length === 0) return;

    try {
      const dataUrls = await Promise.all(fileList.map((file) => fileToDataUrl(file)));
      const updatedPhotos = [...photos, ...dataUrls];
      setPhotos(updatedPhotos);
      await savePhotosToStorage(updatedPhotos);
      setUploadNotice(`Загружено фотографий: ${fileList.length}`);
      setTimeout(() => setUploadNotice(null), 3000);
    } catch (error) {
      console.error('Error processing uploaded photos:', error);
    }
  };

  const handleClearPhotos = async () => {
    await clearStoredPhotos();
    setPhotos([]);
    setShowManageModal(false);
    setSelectedIndex(null);
  };

  const handleRemovePhoto = async (indexToRemove: number) => {
    const updated = photos.filter((_, idx) => idx !== indexToRemove);
    setPhotos(updated);
    await savePhotosToStorage(updated);
    if (selectedIndex === indexToRemove) {
      setSelectedIndex(null);
    } else if (selectedIndex !== null && selectedIndex > indexToRemove) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleOpenLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedIndex(null);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex === null || photos.length === 0) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1));
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex === null || photos.length === 0) return;
    setSelectedIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length]);

  return (
    <section id="gallery-section" className="py-12 px-4 max-w-5xl mx-auto">
      <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-10 shadow-2xl relative bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />

        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-[#051a14] border border-[#c5a059]/40 px-4 py-1.5 rounded-full text-xs font-sans-clean uppercase tracking-[2px] text-[#c5a059] mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Свадебная фотогалерея</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#fdfcf0] font-normal">
            Моменты нашего счастья
          </h2>
          <FloralDivider className="my-3" />

          {/* Manage / Add Photos Bar (Visible in admin mode or if user requests ?admin=true) */}
          {isAdminMode && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#051a14] hover:bg-[#113a30] text-[#c5a059] border border-[#c5a059]/50 rounded-lg text-xs font-sans-clean transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{photos.length > 0 ? 'Заменить / Добавить фото' : 'Загрузить 12 фото'}</span>
              </button>

              {photos.length > 0 && (
                <button
                  onClick={() => setShowManageModal(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#051a14] hover:bg-[#1a0808] text-[#fdfcf0]/70 hover:text-rose-400 border border-[#c5a059]/30 hover:border-rose-500/40 rounded-lg text-xs font-sans-clean transition-colors cursor-pointer"
                >
                  <span>Управление ({photos.length})</span>
                </button>
              )}
            </div>
          )}

          {uploadNotice && (
            <div className="mt-3 inline-flex items-center space-x-2 bg-emerald-900/60 border border-emerald-500/50 px-4 py-1.5 rounded-full text-xs text-emerald-300 font-sans-clean animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>{uploadNotice}</span>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            if (e.target) e.target.value = '';
          }}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center text-[#c5a059] text-sm font-sans-clean animate-pulse">
            Загрузка фотографий...
          </div>
        )}

        {/* Empty State: Prompt to upload the 12 photos */}
        {!isLoading && photos.length === 0 && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#ffd700] bg-[#051a14]'
                : 'border-[#c5a059]/40 hover:border-[#c5a059] bg-[#051a14]/60 hover:bg-[#051a14]'
            }`}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#0a2a22] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059]">
              <Upload className="w-6 h-6" />
            </div>

            <h3 className="font-serif-display text-xl text-[#fdfcf0] font-normal mb-2">
              Загрузите ваши 12 фотографий
            </h3>

            <p className="font-sans-clean text-sm text-[#fdfcf0]/80 max-w-md mx-auto mb-5 leading-relaxed">
              Перетащите все 12 фото сюда или нажмите кнопку, чтобы выбрать их с устройства. Фотографии отобразятся в полном качестве без сторонних подписей.
            </p>

            <button
              type="button"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffd700] border border-[#c5a059] rounded-lg font-sans-clean text-xs uppercase tracking-wider font-semibold shadow-md transition-all pointer-events-none"
            >
              <Plus className="w-4 h-4" />
              <span>Выбрать фотографии</span>
            </button>
          </div>
        )}

        {/* Clean Photo Grid - Pure photography, NO text overlays, NO extra buttons */}
        {!isLoading && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenLightbox(idx)}
                className="group relative h-72 sm:h-80 rounded-xl overflow-hidden border border-[#c5a059]/40 cursor-pointer shadow-lg transition-all duration-500 hover:border-[#ffd700] hover:shadow-2xl hover:shadow-[#c5a059]/25 bg-[#051a14]"
              >
                <img
                  src={imgSrc}
                  alt={`Свадебное фото ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.98] group-hover:brightness-105"
                />

                {/* Subtle Hover Glow Border & Zoom Icon */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                  <div className="p-3 rounded-full bg-[#051a14]/80 text-[#ffd700] border border-[#c5a059] backdrop-blur-sm shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clean Fullscreen Lightbox Modal */}
      {selectedIndex !== null && photos[selectedIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={handleCloseLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0a2a22] border border-[#c5a059] rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-3 flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#c5a059]/30 mb-2">
              <span className="font-sans-clean text-xs text-[#c5a059] tracking-widest uppercase font-semibold">
                {selectedIndex + 1} / {photos.length}
              </span>

              <button
                onClick={handleCloseLightbox}
                className="p-1.5 rounded-full bg-[#051a14] text-[#fdfcf0]/80 hover:text-[#ffd700] border border-[#c5a059]/40 hover:bg-[#0a2a22] transition-colors cursor-pointer"
                title="Закрыть (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Stage */}
            <div className="relative flex-1 flex items-center justify-center min-h-[50vh] max-h-[82vh] bg-[#051a14] rounded-xl overflow-hidden">
              <img
                src={photos[selectedIndex]}
                alt={`Свадебное фото ${selectedIndex + 1}`}
                className="w-full h-full max-h-[80vh] object-contain select-none"
              />

              {/* Prev Button */}
              {photos.length > 1 && (
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#051a14]/80 text-[#ffd700] border border-[#c5a059]/60 hover:bg-[#c5a059] hover:text-[#051a14] transition-all cursor-pointer backdrop-blur-sm shadow-lg"
                  title="Предыдущее фото (Стрелка влево)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next Button */}
              {photos.length > 1 && (
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#051a14]/80 text-[#ffd700] border border-[#c5a059]/60 hover:bg-[#c5a059] hover:text-[#051a14] transition-all cursor-pointer backdrop-blur-sm shadow-lg"
                  title="Следующее фото (Стрелка вправо)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Management Modal */}
      {showManageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowManageModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-3 mb-4">
              <h3 className="font-serif-display text-xl text-[#fdfcf0]">
                Управление фото ({photos.length})
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                className="p-1 rounded-full text-[#fdfcf0]/70 hover:text-[#ffd700] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1 mb-4">
              {photos.map((src, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#c5a059]/40 aspect-square">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 hover:text-rose-200 transition-opacity cursor-pointer"
                    title="Удалить фото"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#c5a059]/20">
              <button
                onClick={handleClearPhotos}
                className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                Очистить всю галерею
              </button>

              <button
                onClick={() => {
                  setShowManageModal(false);
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-[#051a14] hover:bg-[#113a30] text-[#ffd700] border border-[#c5a059] rounded-lg text-xs font-sans-clean transition-colors cursor-pointer"
              >
                Добавить ещё фото
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
