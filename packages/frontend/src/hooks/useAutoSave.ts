import { useCallback, useEffect, useRef } from "react";

export interface UseAutoSaveOptions<T> {
  key: string;
  interval?: number; // default: 0 = no auto save
  debounceMs?: number; // default: 5000ms
  enabled?: boolean;
  blurDelayMs?: number; // default: 5000ms
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

/**
 * Hook for automatic saving of form data to localStorage with debounce, interval, and backup support.
 */
export function useAutoSave<T>(formData: T | undefined, options: UseAutoSaveOptions<T>) {
  const {
    key,
    interval = 0,
    debounceMs = 5000,
    enabled = false,
    blurDelayMs = 5000,
    setData,
  } = options;

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<T | undefined>(formData);

  // const saveToStorage = (dataToSave: T) => {
  //   try {
  //     localStorage.setItem(key, JSON.stringify(dataToSave));
  //     localStorage.setItem(`${key}_last_saved`, Date.now().toString());

  //     const backupKey = `${key}_backup_${Date.now()}`;
  //     localStorage.setItem(backupKey, JSON.stringify(dataToSave));

  //     // Keep only last 5 backups
  //     const backups = Object.keys(localStorage)
  //       .filter(k => k.startsWith(`${key}_backup_`))
  //       .sort();

  //     if (backups.length > 5) {
  //       backups.slice(0, backups.length - 5).forEach(k => localStorage.removeItem(k));
  //     }

  //     lastSavedRef.current = dataToSave;
  //     console.log(`💾 Auto-saved to localStorage (${key})`);
  //   } catch (err) {
  //     console.error(`❌ Error saving to localStorage (${key}):`, err);
  //   }
  // };


  const saveToStorage = useCallback((dataToSave:T) => {
    try {
      localStorage.setItem(key, JSON.stringify(dataToSave));
      localStorage.setItem(`${key}_last_saved`, Date.now().toString());

      // יצירת גיבוי אחד בלבד במקום 5
      const backupKey = `${key}_backup`;
      localStorage.setItem(backupKey, JSON.stringify(dataToSave));

      lastSavedRef.current = dataToSave;
      console.log(`💾 Auto-saved to localStorage (${key})`);
    } catch (err) {
      console.error(`❌ Error saving to localStorage (${key}):`, err);
    }
  }, [key]); 

  const debouncedSave = () => {
    if (!formData) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(lastSavedRef.current)) {
        saveToStorage(formData);
      }
    }, debounceMs);
  };

  useEffect(() => {
    if (enabled) {
      debouncedSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    if (!enabled || interval <= 0) return;

    intervalRef.current = setInterval(() => {
      if (formData && JSON.stringify(formData) !== JSON.stringify(lastSavedRef.current)) {
        saveToStorage(formData);
      }
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [formData, enabled, interval,saveToStorage]);

  const handleBlur = () => {
    if (!enabled || !formData) return;

    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);

    blurTimeoutRef.current = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(lastSavedRef.current)) {
        saveToStorage(formData);
      }
    }, blurDelayMs);
  };

  const restoreFromBackup = (): boolean => {
    try {
      const backupKey = `${key}_backup`;
      const backup = localStorage.getItem(backupKey);

      if (backup) {
        const parsed = JSON.parse(backup);
        setData(parsed);
        saveToStorage(parsed);
        return true;
      }
    } catch (err) {
      console.error(`❌ Error restoring from backup (${key}):`, err);
    }

    return false;
  };

  const clearSaved = () => {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_last_saved`);
    localStorage.removeItem(`${key}_backup`);

    console.log(`🗑️ Cleared saved data for key: ${key}`);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (
        enabled &&
        formData &&
        JSON.stringify(formData) !== JSON.stringify(lastSavedRef.current)
      ) {
        saveToStorage(formData);
      }
    };
  }, [enabled, formData,saveToStorage]);

  return {
    handleBlur,
    clearSaved,
    restoreFromBackup,
    saveNow: () => {
      if (formData) saveToStorage(formData);
    },
  };
}
