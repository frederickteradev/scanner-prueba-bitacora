

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
    // Aseguramos que el texto esté en modo espera
    resultText.style.color = "var(--accent)";

    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 20, qrbox: { width: 320, height: 220 } },
        (decodedText) => {
            // 1. REPRODUCCIÓN INSTANTÁNEA (Feedback Humano)
            if (beep) {
                beep.currentTime = 0; // Reinicia el audio por si se solapan
                beep.play().catch(err => console.warn("Interacción requerida para audio"));
            }
            
            // 2. MOSTRAR RESULTADO
            resultText.innerText = decodedText;
            resultText.style.color = "var(--success)"; // Cambia a verde al éxito
            
            // 3. LOGICA DE SISTEMA
            html5QrCode.stop().then(() => {
                resetBtn.classList.remove('hidden');
                // Ocultamos el láser visual
                const laser = document.querySelector('.laser-line');
                if(laser) laser.style.opacity = '0';
            });
        }
    ).catch(err => {
        resultText.innerText = "Error: Cámara bloqueada o no encontrada.";
    });
}

// Reiniciar flujo de trabajo
resetBtn.addEventListener('click', () => {
    resetBtn.classList.add('hidden');
    resultText.innerText = "Esperando entrada...";
    const laser = document.querySelector('.laser-line');
    if(laser) laser.style.opacity = '1';
    startScanner();
});

// Inicialización limpia
window.addEventListener('DOMContentLoaded', () => {
    if(window.lucide) lucide.createIcons();
    startScanner();
});