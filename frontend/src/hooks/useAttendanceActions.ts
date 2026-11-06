import { useState, useCallback } from 'react';
import type Webcam from 'react-webcam';
import api from '../api/axios.js';
import {
  compareFaceWithReference,
  type FaceComparisonResult,
} from '../utils/faceComparison.js';
import { useLivenessChallenge } from './useLivenessChallenge.js';

interface UseAttendanceActionsProps {
  webcamRef: React.RefObject<Webcam | null>;
  masterPhotoUrl?: string | null;
  onSuccess: () => Promise<void>;
}

export function useAttendanceActions({
  webcamRef,
  masterPhotoUrl,
  onSuccess,
}: UseAttendanceActionsProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricResult, setBiometricResult] = useState<FaceComparisonResult | null>(null);

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const processBiometricSnapshot = useCallback(
    async (snapshotUrl: string, passedLiveness: boolean) => {
      setCapturedImage(snapshotUrl);
      setError(null);
      setBiometricResult(null);

      if (!masterPhotoUrl) return;

      setIsVerifying(true);
      try {
        const result = await compareFaceWithReference(
          snapshotUrl,
          masterPhotoUrl,
          75.0,
          [],
          passedLiveness,
          65.0,
        );
        setBiometricResult(result);
        if (!result.isMatch) {
          setError(
            result.message ||
              `Peringatan Biometrik: Kontur wajah (${result.details.featureScore}% < 65%) belum memenuhi standar minimal.`,
          );
        }
      } catch (err: any) {
        console.error('Biometric verification error:', err);
      } finally {
        setIsVerifying(false);
      }
    },
    [masterPhotoUrl],
  );

  const liveness = useLivenessChallenge({
    webcamRef,
    onChallengeComplete: (snapshot) => processBiometricSnapshot(snapshot, true),
  });

  const handleCapture = useCallback(() => {
    // Start interactive 3D head-turn liveness challenge
    liveness.startChallenge();
  }, [liveness]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImage) {
      setError('Harap lakukan verifikasi foto selfie terlebih dahulu.');
      return;
    }

    if (biometricResult?.antiSpoof && !biometricResult.antiSpoof.isReal) {
      setError('Presensi DITOLAK! Uji liveness keaslian wajah gagal.');
      return;
    }

    if (masterPhotoUrl && biometricResult && !biometricResult.isMatch) {
      setError('Presensi DITOLAK! Wajah Anda tidak sesuai dengan foto master HRD.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const blob = dataURLtoBlob(capturedImage);
      const formData = new FormData();
      formData.append('photo', blob, `wfh_${Date.now()}.jpg`);
      if (notes.trim()) {
        formData.append('notes', notes.trim());
      }

      const res = await api.post('/attendance/check-in', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg(res.data.message || 'Presensi WFH berhasil dicatat!');
      setCapturedImage(null);
      setBiometricResult(null);
      setNotes('');
      await onSuccess();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Gagal mencatat absensi. Silakan coba lagi.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setBiometricResult(null);
    setError(null);
    liveness.resetChallenge();
  };

  return {
    capturedImage,
    notes,
    setNotes,
    loading,
    error,
    setError,
    successMsg,
    isVerifying,
    biometricResult,
    liveness,
    handleCapture,
    handleRetake,
    handleSubmit,
  };
}
