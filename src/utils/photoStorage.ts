// Utility to persist user wedding photos locally using IndexedDB (with localStorage fallback)

const DB_NAME = 'wedding_photos_db';
const STORE_NAME = 'user_photos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadStoredPhotos(): Promise<string[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('wedding_gallery');

      request.onsuccess = () => {
        if (request.result && Array.isArray(request.result.photos)) {
          resolve(request.result.photos);
        } else {
          // Fallback check in localStorage
          try {
            const local = localStorage.getItem('wedding_gallery_user_photos');
            if (local) {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed)) {
                resolve(parsed);
                return;
              }
            }
          } catch {
            // ignore
          }
          resolve([]);
        }
      };

      request.onerror = () => {
        resolve([]);
      };
    });
  } catch {
    // If IndexedDB fails, try localStorage
    try {
      const local = localStorage.getItem('wedding_gallery_user_photos');
      if (local) {
        return JSON.parse(local);
      }
    } catch {
      // ignore
    }
    return [];
  }
}

export async function savePhotosToStorage(photos: string[]): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id: 'wedding_gallery', photos, updatedAt: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not save photos to IndexedDB, falling back to localStorage:', err);
    try {
      localStorage.setItem('wedding_gallery_user_photos', JSON.stringify(photos));
    } catch (localErr) {
      console.error('Storage quota exceeded:', localErr);
    }
  }
}

export async function clearStoredPhotos(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete('wedding_gallery');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem('wedding_gallery_user_photos');
  } catch {
    // ignore
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
