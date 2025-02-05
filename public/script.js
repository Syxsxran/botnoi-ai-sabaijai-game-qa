const LIFF_ID = "2006749493-Z2DAzOAo"; // LIFF ID ของคุณ

async function initLIFF() {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
        liff.login();
    }
    fetchQuestion();
}

async function fetchQuestion() {
    const res = await fetch("/api/question");
    const data = await res.json();
    document.getElementById("question").innerText = data.question;
}

async function sendAnswer(answer) {
    const res = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
    });
    const data = await res.json();
    document.getElementById("question").innerText = data.question;
}

function manualAnswer() {
    document.getElementById("customAnswer").style.display = "block";
    document.querySelector("button[onclick='sendCustomAnswer()']").style.display = "block";
}

async function sendCustomAnswer() {
    const answer = document.getElementById("customAnswer").value;
    sendAnswer(answer);
}

initLIFF();
