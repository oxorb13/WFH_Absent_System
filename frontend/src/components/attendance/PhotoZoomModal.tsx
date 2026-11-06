import React from 'react';
import { X } from 'lucide-react';

interface PhotoZoomModalProps {
  photoUrl: string | null;
  onClose: () => void;
}

export const PhotoZoomModal: React.FC<PhotoZoomModalProps> = ({
  photoUrl,
  onClose,
}) => {
  if (!photoUrl || photoUrl.includes('privacy') || photoUrl.includes('deleted')) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl p-4 border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={photoUrl}
          alt="Bukti Foto Full"
          className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
        />
      </div>
    </div>
  );
};

