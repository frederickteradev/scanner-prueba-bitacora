const html5QrCode = new Html5Qrcode("reader", { 
    formatsToSupport: [ 
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8
    ] 
});

const resultText = document.getElementById('scanned-result');
const resetBtn = document.getElementById('reset-btn');
const laser = document.querySelector('.scanner-laser');

function startScanner() {
    laser.style.display = "block";
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 20, qrbox: { width: 300, height: 150 } },
        (decodedText) => {
            resultText.innerText = decodedText;
            resultText.parentElement.style.borderColor = "var(--success)";
            resultText.style.color = "var(--success)";
            
            laser.style.display = "none";
            html5QrCode.stop();
            resetBtn.classList.remove('hidden');
        }
    ).catch(err => console.error("Error:", err));
}

resetBtn.addEventListener('click', () => {
    resetBtn.classList.add('hidden');
    resultText.innerText = "Esperando lectura...";
    resultText.style.color = "inherit";
    startScanner();
});

startScanner();