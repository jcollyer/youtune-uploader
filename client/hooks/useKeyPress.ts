import { useEffect } from 'react';

export default function useKeyPress(key:any, callback:() => void, active = true) {
  useEffect(() => {
    const keypress = (e:any) => {
      if (e.key === key) {
        callback();
      }
    };

    if (active) {
      window.addEventListener('keypress', keypress);
    }

    return () => {
      if (active) {
        window.removeEventListener('keypress', keypress);
      }
    };
  }, [key, callback, active]);
}
