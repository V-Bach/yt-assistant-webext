document.addEventListener("DOMContentLoaded", () => {
    // Lấy nút bấm chính
    const btn = document.getElementById("btn");

    btn.addEventListener("click", async () => {
        // 1. Tìm Tab YouTube đang hoạt động
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes("youtube.com/watch")) {
            alert("Vui lòng mở một video trên YouTube!");
            return;
        }

        // 2. Gửi tín hiệu sang Content Script để lấy dữ liệu (Title, ID, Transcript)
        chrome.tabs.sendMessage(tab.id, { action: "get_data" }, (response) => {
            if (response) {
                // Hiển thị dữ liệu lấy được lên giao diện Popup
                document.getElementById("title").innerText = response.title;
                document.getElementById("vid").innerText = response.vid;
                document.getElementById("transcript-box").value = response.transcript;

                const dataToSend = {
                    videoId: response.vid,
                    title: response.title,
                    transcript: response.transcript
                };

                console.log("Đang gửi dữ liệu sang Backend...", dataToSend);

                // 3. Gọi API Backend (Không cần Header Authorization nữa)
                fetch("https://localhost:7022/api/video/analyze", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(dataToSend)
                })
                .then(res => {
                    if (!res.ok) throw new Error("Lỗi Server Backend: " + res.status);
                    return res.json();
                })
                .then(data => {
                    // Hiển thị kết quả tóm tắt từ Server
                    alert("Gửi thành công!\n\nTóm tắt: " + data.summary);
                })
                .catch(err => {
                    console.error("Lỗi kết nối:", err);
                    alert("Không thể kết nối tới Backend. Hãy chắc chắn bạn đã chạy dự án Web API!");
                });

            } else {
                // Trường hợp người dùng chưa mở bảng Transcript
                alert("Không lấy được dữ liệu. Bạn hãy mở bảng 'Hiện bản ghi lời thoại' (Show Transcript) trên YouTube trước nhé!");
            }
        });
    });
});

document.getElementById('btn-dashboard').addEventListener('click', () => {
    // URL dẫn tới file dashboard.html mà Backend C# đang phục vụ
    chrome.tabs.create({ url: 'https://localhost:7022/dashboard.html' }); 
    // Lưu ý: Sửa port 7022 thành port thật của bạn
});