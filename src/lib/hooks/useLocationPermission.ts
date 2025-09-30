import { useState, useEffect } from "react";

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

  const getLocation = (): Promise<void> => {
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
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
          resolve();
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLoading(false);

          if (err.code === 1) {
            setPermissionDenied(true);
            setError("User denied geolocation");
          } else if (err.code === 2) {
            setError("Position unavailable");
          } else if (err.code === 3) {
            setError("Geolocation timeout");
          } else {
            setError(err.message);
          }

          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

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
  }, []);

  const allowSession = async () => {
    sessionStorage.setItem(STORAGE_KEYS.PERMISSION, "allow");
    setShowModal(false);
    try {
      await getLocation();
    } catch {}
  };

  const allowOnce = async () => {
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

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    location,
    loading,
    permissionDenied,
    error,
    showModal,
    allowSession,
    allowOnce,
    neverAllow,
    closeModal,
  };
};
