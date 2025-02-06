import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { Stopwatch } from './Stopwatch';

interface StopwatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StopwatchModal({ isOpen, onClose }: StopwatchModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} center>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Stopwatch</h2>
        <Stopwatch />
      </div>
    </Modal>
  );
}