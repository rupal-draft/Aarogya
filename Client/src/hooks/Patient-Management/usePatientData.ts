import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { ApiResponse } from "../../types/patientManagement";

export const usePatientData = (patientId: string) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/v1/patient/management/${patientId}`,
        {
          withCredentials: true,
        }
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch patient data");
      console.error("Error fetching patient data:", err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId, fetchPatientData]);

  return { data, loading, error, refetch: fetchPatientData };
};
