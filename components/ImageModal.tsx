import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  // Prevent clicks on the image from closing the modal
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview"
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] animate-scale-up"
        onClick={handleImageClick}
      >
        <img src={imageUrl} alt="Generated spooky" className="object-contain w-full h-full rounded-lg shadow-2xl shadow-orange-500/20" />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500"
          aria-label="Close image preview"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

// Add animations to the document head
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  @keyframes scaleUp {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-scale-up {
    animation: scaleUp 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default ImageModal;
