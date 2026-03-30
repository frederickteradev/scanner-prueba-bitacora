const html5QrCode = new Html5Qrcode("reader");
const resultText = document.getElementById('scanned-result');
const resetBtn = document.getElementById('reset-btn');

const qrConfig = { fps: 10, qrbox: { width: 250, height: 150 } };

// Función para iniciar el escáner
function startScanner() {
    html5QrCode.start(
        { facingMode: "environment" }, // Usa la cámara trasera
        qrConfig,
        (decodedText) => {
            // Acción al detectar código
            resultText.innerText = decodedText;
            resultText.style.color = "#27ae60";
            
            // Detener para no saturar
            html5QrCode.stop();
            resetBtn.classList.remove('hidden');
        },
        (errorMessage) => {
            // Error de lectura (silencioso para no molestar)
        }
    ).catch((err) => {
        resultText.innerText = "Error al acceder a la cámara.";
        console.error(err);
    });
}

resetBtn.addEventListener('click', () => {
    resetBtn.classList.add('hidden');
    resultText.innerText = "Esperando lectura...";
    resultText.style.color = "#000";
    startScanner();
});

// Iniciar al cargar
startScanner();