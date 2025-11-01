import React from 'react';
import { XIcon } from 'lucide-react';

const Modal = ({ isOpen, closeModal, title, value }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-neutral-900 bg-opacity-80 z-50">
      <div className="bg-neutral-200 dark:bg-neutral-800 p-6 rounded-lg max-w-md w-full relative text-center">
    
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-neutral-900 dark:text-neutral-500 hover:text-neutral-700"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-md text-neutral-900 dark:text-neutral-500 mb-4">{title}</h2>
        <p className="text-xl font-semibold mb-6 capitalize">{value.toLowerCase()}</p>
      </div>
    </div>
  );
};

export default Modal;

