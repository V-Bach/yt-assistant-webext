document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn");

    btn.addEventListener("click", async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes("youtube.com/watch")) {
            alert("Vui lòng mở một video trên YouTube!");
            return;
        }

        chrome.tabs.sendMessage(tab.id, { action: "get_data" }, async (response) => {
            if (!response) {
                alert("Không lấy được dữ liệu. Bạn hãy mở bảng 'Hiện bản ghi lời thoại' (Show Transcript) trên YouTube trước nhé!");
                return;
            }
            document.getElementById("title").innerText = response.title;
            document.getElementById("vid").innerText = response.vid;
            document.getElementById("transcript-box").value = response.transcript;

            const dataToAI = {
                videoId: response.vid,
                title: response.title,
                transcript: response.transcript
            };

            try {
                console.log("🤖 Đang hỏi AI (Python - Port 8000)...");
                const aiRes = await fetch("http://localhost:8000/ai/process", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToAI)
                });

                if (!aiRes.ok) throw new Error("Python Backend không phản hồi!");
                const aiData = await aiRes.json();

                if (aiData.status !== "success") {
                    throw new Error("AI Error: " + aiData.message);
                }

                const summaryResult = aiData.summary; 

                if(!summaryResult) {
                    throw new Error("Ai phản hồi rỗng (Empty Content).");
                }
                console.log("✅ AI đã tóm tắt xong!");

                console.log("💾 Đang lưu vào MySQL (C# - Port 5000)...");
                const dataToSave = {
                    videoId: response.vid,
                    title: response.title,
                    summary: summaryResult 
                };

                const csRes = await fetch("http://localhost:5104/api/video/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToSave)
                });

                if (csRes.ok) {
                    alert("Thành công! AI đã tóm tắt và C# đã lưu vào MySQL.\n\nNội dung: " + summaryResult.substring(0, 100) + "...");
                } else {
                    console.warn("C# không lưu được nhưng AI vẫn chạy xong.");
                    alert("AI đã tóm tắt xong nhưng không lưu được vào MySQL. Kiểm tra lại C# Backend!");
                }

            } catch (err) {
                console.error("🔥 Lỗi hệ thống:", err);
                alert("Lỗi: " + err.message);
            }
        });
    });
});
document.getElementById('btn-dashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:5104/dashboard.html' }); 
});