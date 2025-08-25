import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export async function getAllPatients(
  page?: number,
  limit?: number,
  search?: string,
  centerId?: string
): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/patients", {
      params: { page, limit, search, centerId },
    });
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch patients."
      );
    }
    throw err;
  }
}

export async function createPatient(data: any): Promise<any> {
  try {
    const response = await axiosAuth.post("/patients", data);
    return response.data;
  } catch (err) {
    console.error("Failed to create patient:", err);
    throw err;
  }
}

export async function updatePatient(
  patientId: string,
  updateData: Partial<any>
): Promise<any> {
  try {
    const res = await axiosAuth.put<any>(`/patients/${patientId}`, updateData);
    return res.data;
  } catch (error) {
    console.error(`Error updating patient with ID ${patientId}:`, error);
    throw error;
  }
}

export async function getPatientById(patientId: string): Promise<any> {
  try {
    const res = await axiosAuth.get<any>(`/patients/${patientId}`);
    return res;
  } catch (error) {
    console.error(`Error fetching patient with ID ${patientId}:`, error);
    throw error;
  }
}

export async function deletePatient(patientId: string): Promise<void> {
  try {
    await axiosAuth.delete(`/patients/${patientId}`);
  } catch (error) {
    console.error(`Error deleting patient with ID ${patientId}:`, error);
    throw error;
  }
}

export async function getPatientSuggestions(
  contactNo: string,
  centerId?: string,
  skipLoader: boolean = true
): Promise<any[]> {
  try {
    console.log("🔍 Making API call with params:", { contactNo, centerId });

    const res = await axiosAuth.get("/patients/suggestions", {
      params: { contactNo, centerId },
      skipLoading: skipLoader,
    });

    console.log("📡 Raw response object:", res);
    console.log("📊 Response status:", res.status);
    console.log("📦 Response data:", res.data);
    console.log("🔢 Type of response:", typeof res);
    console.log("📋 Is response an array?", Array.isArray(res));

    if (Array.isArray(res)) {
      console.log("✅ Response is directly an array");
      console.log(`📝 Array length: ${res.length}`);
      if (res.length > 0) {
        console.log("👤 First patient:", res[0]);
      }
      return res;
    }

    // Check standard axios response.data
    if (res.data) {
      console.log("✅ Response.data exists");
      if (Array.isArray(res.data)) {
        console.log("✅ Response.data is an array");
        console.log(`📝 Array length: ${res.data.length}`);
        if (res.data.length > 0) {
          console.log("👤 First patient:", res.data[0]);
        }
        return res.data;
      } else {
        console.log(
          "❌ Response.data is not an array, checking nested properties..."
        );
        console.log("🔍 Response.data type:", typeof res.data);
        console.log("🔍 Response.data value:", res.data);

        if (res.data && typeof res.data === "object") {
          console.log("🔍 All keys in response.data:", Object.keys(res.data));

          // Try different possible nested structures
          if (res.data.data && Array.isArray(res.data.data)) {
            console.log("✅ Found array at res.data.data");
            return res.data.data;
          } else if (res.data.patients && Array.isArray(res.data.patients)) {
            console.log("✅ Found array at res.data.patients");
            return res.data.patients;
          }
        }

        console.log("❌ Could not find array in any expected location");
        return [];
      }
    } else {
      console.log(
        "❌ No response.data, checking if response has other properties"
      );
      console.log("🔍 Response keys:", Object.keys(res));
      return [];
    }
  } catch (err: unknown) {
    console.error("🚨 API Error:", err);
    if (axios.isAxiosError(err)) {
      console.error("📥 Error response:", err.response);
      console.error("📊 Error status:", err.response?.status);
      console.error("📦 Error data:", err.response?.data);
      throw new Error(
        err.response?.data?.message || "Failed to fetch patient suggestions."
      );
    }
    throw err;
  }
}
