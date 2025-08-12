import axiosAuth from "@/lib/axiosAuth";

// export async function loginUser(userName: string, password: string) {
//   try {
//     const res = await axiosAuth.post("/auth/login", { userName, password });
//     console.log("Axios response:", res);
//     return res.data;
//   } catch (err) {
//     console.error("Axios error:", err);
//     throw err; // Rethrow to handle in the component
//   }
// }
// authApis.ts
// In your authApis.ts
export async function loginUser(userName: string, password: string) {
  try {
    const res = await axiosAuth.post("/auth/login", { userName, password });
    console.log("Axios response:", res); // logs the full Axios response object
    return res.data; // returns only the data part
  } catch (err) {
    console.error("Axios error:", err);
    return undefined;
  }
}
