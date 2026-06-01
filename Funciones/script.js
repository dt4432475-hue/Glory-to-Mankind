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

// ==========================================================================
// CONTROL DE BOTONES PARA LA CASILLA DESTACADA PANORÁMICA
// ==========================================================================
const featSlider = document.getElementById('featuredSlider');
const featPrevBtn = document.getElementById('featPrevBtn');
const featNextBtn = document.getElementById('featNextBtn');

if (featSlider && featPrevBtn && featNextBtn) {
    let featPosition = 0;

    featNextBtn.addEventListener('click', () => {
        const slideWidth = featSlider.clientWidth;
        const maxScroll = featSlider.scrollWidth - slideWidth;

        if (featPosition < maxScroll) {
            featPosition += slideWidth;
        } else {
            featPosition = 0; // Si llega al final, regresa a la primera imagen
        }
        featSlider.scrollTo({ left: featPosition, behavior: 'smooth' });
    });

    featPrevBtn.addEventListener('click', () => {
        const slideWidth = featSlider.clientWidth;
        const maxScroll = featSlider.scrollWidth - slideWidth;

        if (featPosition > 0) {
            featPosition -= slideWidth;
        } else {
            featPosition = maxScroll; // Si está al principio y da atrás, va a la última
        }
        featSlider.scrollTo({ left: featPosition, behavior: 'smooth' });
    });

    // Resetear posición si se cambia el tamaño de la pantalla
    window.addEventListener('resize', () => {
        featPosition = 0;
        featSlider.scrollLeft = 0;
    });
}