const html5QrCode = new Html5Qrcode("reader", { 
    formatsToSupport: [ 
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A
    ] 
});

const resultText = document.getElementById('scanned-result');
const resetBtn = document.getElementById('reset-btn');
const beep = document.getElementById('beep-sound');

function startScanner() {
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 15, qrbox: { width: 300, height: 160 } },
        (decodedText) => {
            // Reproducir sonido de escaneo
            beep.play().catch(e => console.log("Audio interactivo requerido"));
            
            // Mostrar resultado
            resultText.innerText = decodedText;
            
            // Detener y mostrar botón de reinicio
            html5QrCode.stop();
            resetBtn.classList.remove('hidden');
        },
        (errorMessage) => { /* Silencioso para mejor performance */ }
    ).catch(err => {
        resultText.innerText = "Error: Acceso a cámara denegado.";
    });
}

resetBtn.addEventListener('click', () => {
    resetBtn.classList.add('hidden');
    resultText.innerText = "Esperando entrada...";
    startScanner();
});

// Iniciamos la cámara al cargar la web
startScanner();