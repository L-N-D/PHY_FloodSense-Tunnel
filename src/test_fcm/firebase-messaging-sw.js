// firebase-messaging-sw.js

// Import Firebase SDK cho service worker
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// TODO: THAY BẰNG CẤU HÌNH CỦA BẠN (y như trong index.html)
firebase.initializeApp({
		apiKey: "AIzaSyC5eewUE6fIsGK8eJ8oTFilLnWvZ6JnXe0",
  		authDomain: "basement-monitor-87754.firebaseapp.com",
  		projectId: "basement-monitor-87754",
  		storageBucket: "basement-monitor-87754.firebasestorage.app",
 		messagingSenderId: "814151626842",
  		appId: "1:814151626842:web:36366a28925ec5b4ac6863",
  		measurementId: "G-3D31XKP6N2"
});

// Khởi tạo messaging trong SW
const messaging = firebase.messaging();

// (Không bắt buộc) – log thử khi nhận được message background
messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  // Bạn có thể custom notification ở đây nếu muốn
});
