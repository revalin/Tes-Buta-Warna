```javascript
// ====================================
// 1. PENGATURAN AWAL
// ====================================

document.getElementById("year").textContent =
    new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("show");

    menuToggle.textContent =
        navMenu.classList.contains("show") ? "✕" : "☰";
});

navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navMenu.classList.remove("show");
        menuToggle.textContent = "☰";
    });
});


// ====================================
// 2. DATA SOAL SIMULASI
// ====================================

// Angka dan kunci berikut hanya untuk demonstrasi antarmuka.
// Bukan kumpulan pelat Ishihara klinis yang tervalidasi.

const questions = [
    { number: "12", answer: "12", color: 1 },
    { number: "8",  answer: "8",  color: 2 },
    { number: "6",  answer: "6",  color: 3 },
    { number: "29", answer: "29", color: 4 },
    { number: "5",  answer: "5",  color: 5 },
    { number: "3",  answer: "3",  color: 6 }
];

let currentQuestion = 0;
let currentAnswer = "";
let answers = [];
let finished = false;

const questionTitle = document.getElementById("questionTitle");
const questionCounter = document.getElementById("questionCounter");
const progressBar = document.getElementById("progressBar");
const testNumber = document.getElementById("testNumber");
const testPlate = document.getElementById("testPlate");
const answerDisplay = document.getElementById("answerDisplay");
const feedback = document.getElementById("feedback");
const nextQuestion = document.getElementById("nextQuestion");


// ====================================
// 3. MENAMPILKAN SOAL
// ====================================

function showQuestion() {
    const question = questions[currentQuestion];

    questionTitle.textContent =
        "Pelat Nomor " + (currentQuestion + 1);

    questionCounter.textContent =
        (currentQuestion + 1) + " dari " + questions.length;

    progressBar.style.width =
        ((currentQuestion + 1) / questions.length * 100) + "%";

    testNumber.textContent = question.number;

    // Variasi warna dekoratif untuk ilustrasi simulasi.
    const palettes = [
        ["#bd655b", "#6e9c75", "#dca84c", "#8199bf"],
        ["#c47769", "#729e82", "#e1b75c", "#8198ba"],
        ["#b96860", "#83a66f", "#d6a24c", "#8b9bc0"],
        ["#c17a67", "#709879", "#dfb15a", "#829dc0"],
        ["#bb6b61", "#7aa17b", "#d8a74d", "#8295b8"],
        ["#c77b6c", "#779d80", "#e0b85f", "#879fc2"]
    ];

    const colors = palettes[question.color - 1];

    testPlate.style.backgroundImage = `
        radial-gradient(circle, ${colors[0]} 2px, transparent 3px),
        radial-gradient(circle, ${colors[1]} 2px, transparent 3px),
        radial-gradient(circle, ${colors[2]} 2px, transparent 3px),
        radial-gradient(circle, ${colors[3]} 2px, transparent 3px)
    `;

    currentAnswer = "";
    answerDisplay.textContent = "_";
    feedback.textContent = "Silakan masukkan angka yang terlihat.";
    feedback.style.color = "#748197";

    nextQuestion.textContent =
        currentQuestion === questions.length - 1
            ? "Selesaikan Tes ✓"
            : "Kirim Jawaban →";
}


// ====================================
// 4. INPUT KEYPAD VIRTUAL
// ====================================

function handleKey(key) {
    if (finished) {
        feedback.textContent =
            "Tes selesai. Tekan Ulangi Tes untuk memulai kembali.";
        return;
    }

    if (key === "clear") {
        currentAnswer = "";
        answerDisplay.textContent = "_";
        feedback.textContent = "Jawaban dihapus.";
        return;
    }

    if (key === "submit") {
        submitAnswer();
        return;
    }

    // Maksimal dua digit untuk contoh soal.
    if (currentAnswer.length < 2) {
        currentAnswer += key;
        answerDisplay.textContent = currentAnswer;
        feedback.textContent = "Periksa jawabanmu sebelum mengirim.";
    }
}

document.querySelectorAll("#keypad button").forEach(function (button) {
    button.addEventListener("click", function () {
        handleKey(button.dataset.key);
    });
});

document.getElementById("clearAnswer").addEventListener("click", function () {
    handleKey("clear");
});


// ====================================
// 5. MENCATAT JAWABAN
// ====================================

function submitAnswer() {
    if (!currentAnswer) {
        feedback.textContent = "Masukkan angka terlebih dahulu.";
        feedback.style.color = "#c65c5c";
        return;
    }

    answers[currentQuestion] = currentAnswer;

    feedback.style.color = "#16845a";
    feedback.textContent = "Jawaban simulasi tercatat.";

    updateResultPreview();

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;

        setTimeout(function () {
            showQuestion();
        }, 450);
    } else {
        finishTest();
    }
}

nextQuestion.addEventListener("click", submitAnswer);


// ====================================
// 6. MEMPERBARUI RINGKASAN
// ====================================

function updateResultPreview() {
    const answered = answers.filter(function (answer) {
        return answer !== undefined && answer !== "";
    }).length;

    let correct = 0;

    answers.forEach(function (answer, index) {
        if (answer === questions[index].answer) {
            correct++;
        }
    });

    document.getElementById("resultAnswered").textContent =
        answered + " / " + questions.length;

    document.getElementById("resultCorrect").textContent = correct;
}


// ====================================
// 7. MENYELESAIKAN SIMULASI
// ====================================

function finishTest() {
    finished = true;

    const correct = answers.filter(function (answer, index) {
        return answer === questions[index].answer;
    }).length;

    document.getElementById("resultTitle").textContent =
        "Simulasi pemeriksaan selesai";

    document.getElementById("resultMessage").textContent =
        "Kamu telah menyelesaikan seluruh soal simulasi. " +
        "Jumlah jawaban yang sesuai dengan kunci contoh: " +
        correct + " dari " + questions.length + ". " +
        "Angka ini hanya menunjukkan kecocokan dengan kunci simulasi, " +
        "bukan hasil diagnosis buta warna.";

    document.getElementById("resultTime").textContent =
        new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        });

    feedback.textContent = "Simulasi selesai. Lihat ringkasan di bawah.";
    feedback.style.color = "#16845a";

    nextQuestion.disabled = true;
    nextQuestion.textContent = "Tes Selesai";
    nextQuestion.style.opacity = "0.6";

    document.getElementById("hasil").scrollIntoView({
        behavior: "smooth"
    });
}


// ====================================
// 8. MENGULANGI TES
// ====================================

function resetTest() {
    currentQuestion = 0;
    currentAnswer = "";
    answers = [];
    finished = false;

    nextQuestion.disabled = false;
    nextQuestion.style.opacity = "1";

    document.getElementById("resultTitle").textContent =
        "Belum ada pemeriksaan selesai";

    document.getElementById("resultMessage").textContent =
        "Selesaikan simulasi untuk melihat ringkasan jawaban.";

    document.getElementById("resultAnswered").textContent =
        "0 / " + questions.length;

    document.getElementById("resultCorrect").textContent = "0";
    document.getElementById("resultTime").textContent = "—";

    showQuestion();
}

document.getElementById("resetTest").addEventListener("click", resetTest);
document.getElementById("restartFromResult").addEventListener("click", function () {
    resetTest();

    document.getElementById("tes").scrollIntoView({
        behavior: "smooth"
    });
});


// ====================================
// 9. MENJALANKAN SIMULASI
// ====================================

showQuestion();

console.log("IshiTest: rancangan simulasi berhasil dijalankan.");
```