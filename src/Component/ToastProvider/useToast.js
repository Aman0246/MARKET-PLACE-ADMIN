import { useToastContext } from './ToastProvider';

const useToast = () => {
  const context = useToastContext();
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default useToast;
