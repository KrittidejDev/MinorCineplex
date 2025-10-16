import { useState, useEffect, useCallback } from "react";

export interface Location {
  lat: number;
  lng: number;
}

export interface UseLocationPermissionReturn {
  location: Location | null;
  loading: boolean;
  permissionDenied: boolean;
  error: string | null;
  showModal: boolean;
  openModal: () => void;
  allowSession: () => Promise<void>;
  allowOnce: () => Promise<void>;
  neverAllow: () => void;
  closeModal: () => void;
}

const STORAGE_KEYS = {
  PERMISSION: "geo_permission",
  NEVER_TIMESTAMP: "geo_never_timestamp",
} as const;

export const useLocationPermission = (): UseLocationPermissionReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fallback: IP-based location
  const fallbackLocation = useCallback(async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      setLocation({ lat: data.latitude, lng: data.longitude });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Cannot get location from IP fallback");
      setLoading(false);
    }
  }, []);

  // Get current geolocation
  const getLocation = useCallback((): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        setLoading(false);
        return reject(new Error("Geolocation not supported"));
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
          resolve();
        },
        async (err) => {
          console.error("Geolocation error:", err);
          setLoading(false);

          localStorage.removeItem(STORAGE_KEYS.PERMISSION);
          localStorage.removeItem(STORAGE_KEYS.NEVER_TIMESTAMP);
          sessionStorage.removeItem(STORAGE_KEYS.PERMISSION);

          switch (err.code) {
            case 1:
              setPermissionDenied(true);
              setError("User denied geolocation");
              break;
            case 2:
              setError(
                "Position unavailable. Using approximate location from IP."
              );
              await fallbackLocation();
              break;
            case 3:
              setError(
                "Geolocation timeout. Using approximate location from IP."
              );
              await fallbackLocation();
              break;
            default:
              setError(err.message || "Unknown geolocation error");
              await fallbackLocation();
          }

          reject(err);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
      );
    });
  }, [fallbackLocation]);

  // Check permission on mount
  useEffect(() => {
    const storedPermission = localStorage.getItem(STORAGE_KEYS.PERMISSION);
    const sessionPermission = sessionStorage.getItem(STORAGE_KEYS.PERMISSION);
    const neverTimestamp = localStorage.getItem(STORAGE_KEYS.NEVER_TIMESTAMP);

    if (storedPermission === "never" && neverTimestamp) {
      const lastNever = parseInt(neverTimestamp, 10);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (now - lastNever < oneDay) {
        setPermissionDenied(true);
        setLoading(false);
        return;
      } else {
        localStorage.removeItem(STORAGE_KEYS.PERMISSION);
        localStorage.removeItem(STORAGE_KEYS.NEVER_TIMESTAMP);
      }
    }

    if (storedPermission === "allow" || sessionPermission === "allow") {
      getLocation().catch(() => {});
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getLocation().catch(() => {});
        } else if (result.state === "denied") {
          setPermissionDenied(true);
          setLoading(false);
        } else {
          setShowModal(true);
          setLoading(false);
        }
      });
    } else {
      setShowModal(true);
      setLoading(false);
    }
  }, [getLocation]);

  const openModal = () => setShowModal(true);

  const allowSession = async () => {
    sessionStorage.setItem(STORAGE_KEYS.PERMISSION, "allow");
    setShowModal(false);
    try {
      await getLocation();
    } catch {}
  };

  const allowOnce = async () => {
    sessionStorage.setItem(STORAGE_KEYS.PERMISSION, "allow");
    setShowModal(false);
    try {
      await getLocation();
    } catch {}
  };

  const neverAllow = () => {
    localStorage.setItem(STORAGE_KEYS.PERMISSION, "never");
    localStorage.setItem(STORAGE_KEYS.NEVER_TIMESTAMP, Date.now().toString());
    setShowModal(false);
    setPermissionDenied(true);
  };

  const closeModal = () => setShowModal(false);

  return {
    location,
    loading,
    permissionDenied,
    error,
    showModal,
    openModal,
    allowSession,
    allowOnce,
    neverAllow,
    closeModal,
  };
};
