import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook to copy text to clipboard with toast feedback.
 */
export const useClipboard = () => {
  const copy = useCallback(async (text, label = 'Link') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
      return true;
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast.success(`${label} copied!`);
      return true;
    }
  }, []);

  return { copy };
};
