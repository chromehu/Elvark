'use client';

import { GraduationCap } from 'lucide-react';
import { Modal } from './Modal';

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export function DemoModal({ open, onClose, message }: DemoModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="ELVARK bemutató verzió">
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-full bg-cobalt-50 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-7 h-7 text-cobalt-600" />
        </div>
        <p className="text-navy-900 text-base leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors"
        >
          Értem
        </button>
      </div>
    </Modal>
  );
}
