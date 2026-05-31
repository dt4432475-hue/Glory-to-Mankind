const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentPosition = 0;

// Función para obtener cuánto mediría el desplazamiento actual (ancho tarjeta + espacio)
function getScrollAmount() {
    const firstCard = track.querySelector('.game-card');
    if (!firstCard) return 270; // Valor por defecto si no encuentra la tarjeta
    
    // Suma el ancho de la tarjeta + los 20px de espacio (gap)
    return firstCard.clientWidth + 20; 
}

// Botón Derecho
nextBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
    
    if (currentPosition < maxScroll) {
        currentPosition += scrollAmount;
        if (currentPosition > maxScroll) currentPosition = maxScroll;
        track.style.transform = `translateX(-${currentPosition}px)`;
    }
});

// Botón Izquierdo
prevBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    
    if (currentPosition > 0) {
        currentPosition -= scrollAmount;
        if (currentPosition < 0) currentPosition = 0;
        track.style.transform = `translateX(-${currentPosition}px)`;
    }
});

// Resetear la posición si el usuario voltea el celular o cambia el tamaño del navegador
window.addEventListener('resize', () => {
    currentPosition = 0;
    track.style.transform = `translateX(0px)`;
});

