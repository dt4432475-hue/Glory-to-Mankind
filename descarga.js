document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el ID de la URL
    const params = new URLSearchParams(window.location.search);
    const juegoId = params.get('id');

    // 2. Intentar cargar los 4 JSONs de forma segura
    Promise.all([
        fetch('juegos-pc.json').then(res => res.json()).catch(() => []),
        fetch('juegos-android.json').then(res => res.json()).catch(() => []),
        fetch('apps.json').then(res => res.json()).catch(() => []),
        fetch('isos.json').then(res => res.json()).catch(() => [])
    ])
    .then(resultados => {
        const todosLosAportes = [].concat(...resultados);
        
        // Buscar coincidencia limpando el texto
        const juegoEncontrado = todosLosAportes.find(item => {
            return item.titulo && generateSlug(item.titulo) === juegoId;
        });

        if (juegoEncontrado) {
            inyectarDatosJuego(juegoEncontrado);
            iniciarContador(juegoEncontrado.url);
        } else {
            // SALVAVIDAS: Si el JSON no cargó en tu PC local, genera un aporte de prueba dinámico
            inyectarDatosJuego({
                titulo: "Glory to Mankind (Base)",
                tag: "PC Gamer",
                status: "Online",
                imagen: "https://unsplash.com",
                url: "https://mediafire.com"
            });
            iniciarContador("https://mediafire.com");
        }
    })
    .catch(() => {
        // Segundo respaldo por si colapsa la lectura de red
        iniciarContador("https://mediafire.com");
    });

    function generateSlug(text) {
        if (!text) return '';
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function inyectarDatosJuego(juego) {
        document.getElementById('game-title').textContent = juego.titulo || "Aporte Desconocido";
        document.getElementById('game-img').src = juego.imagen || 'https://unsplash.com';
        document.getElementById('game-server').textContent = `Servidor: ${juego.tag || 'Global'} | ${juego.status || 'Online'}`;
        
        if (juego.peso) {
            document.getElementById('game-server').innerHTML += ` | <i class="fa-solid fa-file-zipper"></i> ${juego.peso}`;
        }
    }
function iniciarContador(finalUrl) {
    let tiempo = 5;
    const timerNum = document.getElementById('timer-num');
    const contenedorContador = document.getElementById('step-countdown');
    const contenedorCaptcha = document.getElementById('step-captcha');
    const btnContinuar = document.getElementById('btn-continue');
    const contenedorLinks = document.getElementById('step-links');
    const linkFinal = document.getElementById('final-download-url');

    if (!timerNum) return;

    const reloj = setInterval(() => {
        tiempo--;
        timerNum.textContent = tiempo;
        if (tiempo <= 0) {
            clearInterval(reloj);
            contenedorContador.classList.add('hidden');
            contenedorCaptcha.classList.remove('hidden');
        }
    }, 1000);

    // Funciones globales para reCAPTCHA
    window.captchaCompletado = function() {
        btnContinuar.removeAttribute('disabled');
        btnContinuar.classList.add('active-btn');
    };

    window.captchaExpirado = function() {
        btnContinuar.setAttribute('disabled', 'true');
        btnContinuar.classList.remove('active-btn');
    };

    // Validación segura en Vercel al presionar Continuar
    btnContinuar.addEventListener('click', async () => {
        const token = grecaptcha.getResponse();

        if (!token) {
            alert("Por favor, completa la casilla 'No soy un robot'.");
            return;
        }

        btnContinuar.innerText = "Verificando...";
        btnContinuar.setAttribute('disabled', 'true');

        try {
            const respuesta = await fetch('/api/validar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token })
            });

            const resultado = await respuesta.json();

            if (resultado.success) {
                contenedorCaptcha.classList.add('hidden');
                contenedorLinks.classList.remove('hidden');
                linkFinal.href = finalUrl || "#";
            } else {
                alert("Error: " + (resultado.error || "Verificación incorrecta. Inténtalo de nuevo."));
                grecaptcha.reset();
                window.captchaExpirado();
                btnContinuar.innerText = "Continuar";
            }
        } catch (error) {
            console.error("Error al conectar con la API de Vercel:", error);
            alert("Error de red al procesar la seguridad.");
            btnContinuar.innerText = "Continuar";
        }
    });
} // Cierre de iniciarContador

}); // Cierre definitivo de DOMContentLoaded (última línea del archivo)
