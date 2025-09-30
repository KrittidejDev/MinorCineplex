import { useState, useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface UseLocationPermissionReturn {
  location: Location | null;
  loading: boolean;
  permissionDenied: boolean;
  error: string | null;
  showModal: boolean;
  allowSession: () => void;
  allowOnce: () => void;
  neverAllow: () => void;
  closeModal: () => void; // ✅ เพิ่ม onClose
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

  const getLocation = () => {
    const storedPermission = localStorage.getItem(STORAGE_KEYS.PERMISSION);
    if (storedPermission === "never") {
      setPermissionDenied(true);
      setLoading(false);
      return;
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
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const storedPermission = localStorage.getItem(STORAGE_KEYS.PERMISSION);
    const sessionPermission = sessionStorage.getItem(STORAGE_KEYS.PERMISSION);
    const neverTimestamp = localStorage.getItem(STORAGE_KEYS.NEVER_TIMESTAMP);

    // ตรวจสอบถ้ามี never และยังไม่ครบ 1 วัน
    if (storedPermission === "never" && neverTimestamp) {
      const lastNever = parseInt(neverTimestamp, 10);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (now - lastNever < oneDay) {
        setPermissionDenied(true);
        setLoading(false);
        return;
      } else {
        // ครบ 1 วันแล้ว ลบค่าออก
        localStorage.removeItem(STORAGE_KEYS.PERMISSION);
        localStorage.removeItem(STORAGE_KEYS.NEVER_TIMESTAMP);
      }
    }

    if (storedPermission === "allow" || sessionPermission === "allow") {
      getLocation();
      return;
    }

    // ยังไม่เคยเลือก → แสดง modal
    setShowModal(true);
    setLoading(false);
  }, []);

  const allowSession = () => {
    sessionStorage.setItem(STORAGE_KEYS.PERMISSION, "allow");
    setShowModal(false);
    getLocation();
  };

  const allowOnce = () => {
    setShowModal(false);
    getLocation();
  };

  const neverAllow = () => {
    localStorage.setItem(STORAGE_KEYS.PERMISSION, "never");
    localStorage.setItem(STORAGE_KEYS.NEVER_TIMESTAMP, Date.now().toString()); // ✅ บันทึกเวลา
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
