/**
 * TERADEV | Módulo de Escaneo Profesional
 * Desarrollado por Frederick Rodriguez
 * Configuración: Alta velocidad y Feedback Auditivo Local
 */

// 1. Inicialización del motor de escaneo con soporte de formatos industriales
const html5QrCode = new Html5Qrcode("reader", { 
    formatsToSupport: [ 
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_39
    ] 
});

const resultText = document.getElementById('scanned-result');
const resetBtn = document.getElementById('reset-btn');
const beep = document.getElementById('beep-sound');
const laser = document.querySelector('.laser-line');

// 2. Configuración técnica del visor (Viewport)
const scannerConfig = { 
    fps: 24, // Mayor fluidez para captura rápida
    qrbox: { width: 320, height: 220 }, // Área rectangular para códigos de barras
    aspectRatio: 1.0 // Mantenemos el visor cuadrado grande que pediste
};

function startScanner() {
    // Reset visual del estado de espera
    resultText.style.color = "var(--accent)";
    if(laser) laser.style.opacity = '1';

    html5QrCode.start(
        { facingMode: "environment" }, 
        scannerConfig,
        (decodedText) => {
            // --- GESTIÓN DE AUDIO (BEPP-04.MP3) ---
            if (beep) {
                // Aumentamos la velocidad de reproducción para que sea un "clic" rápido
                beep.playbackRate = 1.6; 
                beep.currentTime = 0; 
                beep.play().catch(err => console.warn("Audio requiere interacción previa del usuario"));
            }
            
            // --- FEEDBACK VISUAL ---
            resultText.innerText = decodedText;
            resultText.style.color = "var(--success)"; // Cambia a verde esmeralda
            
            // --- CIERRE DE CICLO DE HARDWARE ---
            html5QrCode.stop().then(() => {
                // Mostramos el botón de acción para nuevo escaneo
                resetBtn.classList.remove('hidden');
                
                // Efecto visual: apagamos el láser al terminar
                if(laser) laser.style.opacity = '0';
            });
        },
        (errorMessage) => {
            // Buscando... (Callback vacío para no saturar la consola)
        }
    ).catch(err => {
        resultText.innerText = "Error: Acceso a cámara denegado.";
        console.error("Scanner Engine Error:", err);
    });
}

// 3. Controladores de Eventos (Interacciones Humanas)
resetBtn.addEventListener('click', () => {
    resetBtn.classList.add('hidden');
    resultText.innerText = "Esperando entrada...";
    startScanner();
});

// 4. Inicialización al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
    // Renderizamos los iconos de Lucide (si se importaron en el HTML)
    if(window.lucide) {
        lucide.createIcons();
    }
    
    // El navegador suele bloquear el audio automático. 
    // Al tocar el cuerpo de la página, "desbloqueamos" el contexto de audio.
    document.body.addEventListener('click', () => {
        if(beep) beep.load(); 
    }, { once: true });

    startScanner();
});