chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_data") {
    const title = document.querySelector("h1.ytd-watch-metadata")?.innerText || document.title;
    const vid = new URLSearchParams(window.location.search).get("v");

    const segments = document.querySelectorAll('ytd-transcript-segment-renderer, .cue-group');
    
    let transcriptText = "";
    if (segments.length > 0) {
      transcriptText = Array.from(segments)
        .map(el => el.innerText.replace(/\n/g, " "))
        .join(" ");
    } else {
      transcriptText = "LỖI: Hãy mở bảng Transcript trên YouTube trước (nằm trong phần Description -> nút Show Transcript).";
    }

    sendResponse({ title, vid, transcript: transcriptText });
  }
  return true;
});