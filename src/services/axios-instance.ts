import axios from 'axios';

// const url = "http://localhost:8000/api"
const url = "https://medsync-backend-production.up.railway.app/api"

const api = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // إذا التوكن منتهي ولم نحاول الريفريش بعد
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem("refresh_token");
//         const res = await axios.post("http://localhost:3001/auth/refresh", {
//           refresh_token: refreshToken,
//         });

//         const newAccessToken = res.data.access_token;
//         localStorage.setItem("access_token", newAccessToken);

//         // أعد إرسال الطلب الأصلي مع التوكن الجديد
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // لو الريفريش فشل → تسجيل خروج
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;