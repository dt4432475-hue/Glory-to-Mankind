function sanitizarHTML(textoSucio) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(textoSucio, 'text/html');
    
    // Elimina etiquetas de script y atributos peligrosos de ejecución automática
    const elementosPeligrosos = doc.querySelectorAll('script, [onerror], [onload], [onclick]');
    elementosPeligrosos.forEach(el => el.remove());
    
    return doc.body.innerHTML;
}


let downloadUrl = "#"; // Variable global compartida con el HTML

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const aporteId = parseInt(params.get("id"));
    const tipoAporte = params.get("tipo");

    if (!aporteId || !tipoAporte) {
        window.location.href = "index.html";
        return;
    }

    let jsonFile = "";
    if (tipoAporte === "juegos-pc") jsonFile = "juegos-pc.json";
    else if (tipoAporte === "juegos-android") jsonFile = "juegos-android.json";
    else if (tipoAporte === "apps") jsonFile = "apps.json";
    else {
        window.location.href = "index.html";
        return;
    }

    fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
        const aporte = data.find(item => parseInt(item.id) === aporteId);

        if (aporte) {
            // Inyección usando tus IDs originales exactos
            document.getElementById("app-icon").src = aporte.icono;
            document.getElementById("app-title").textContent = aporte.titulo;
            document.getElementById("app-server").innerHTML = `<strong>Servidor:</strong> ${aporte.servidor}`;
            document.getElementById("app-gameplay").src = aporte.gameplay;
           document.getElementById("app-description").innerHTML = sanitizarHTML(aporte.descripcion);
            document.getElementById("app-requirements").innerHTML = sanitizarHTML(aporte.requisitos);

            // Guardamos la URL final del juego para que el script del HTML la use
            downloadUrl = aporte.url;

            // CONFIGURACIÓN DEL CUADRITO DE SEGURIDAD
            const contenedorSeguridad = document.getElementById("contenedor-seguridad");
            const textoSeguridad = document.getElementById("texto-seguridad");

            if (aporte.mensajeSeguridad) {
    textoSeguridad.innerHTML = `${aporte.mensajeSeguridad} <a href="${aporte.enlaceSeguridad || '#'}" target="_blank" style="font-weight: bold; text-decoration: underline; margin-left: 6px;">[Ver Reporte / Antivirus]</a>`;
    
    const enlace = document.getElementById("antivirus-link");


// Normalizamos el texto pasándolo a minúsculas y quitando espacios
const estado = String(aporte.estadoSeguro).trim().toLowerCase();

// 🔵 OPCIÓN 1: Seguro Estándar -> Azul Celeste
if (estado === "seguro") {
    contenedorSeguridad.style.border = "1px solid #38bdf8";
    contenedorSeguridad.style.backgroundColor = "rgba(56, 189, 248, 0.08)";
    textoSeguridad.style.color = "#bae6fd";
    textoSeguridad.textContent = "Verificado: Este archivo es seguro. Ha sido testeado detalladamente y está completamente libre de malware.";
    
    if (enlace) enlace.style.display = "none";
} 
// 🔴 ESTADO ROJO (Advertencia)
else {
    contenedorSeguridad.style.border = "1px solid #ef4444";
    contenedorSeguridad.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
    textoSeguridad.style.color = "#fca5a5";
    textoSeguridad.textContent = "Advertencia: Este archivo puede contener falsos positivos debido a parches o cracks.";
    
    if (enlace) {
        // 🎯 LA CLAVE: Forzamos a que sea un bloque completo para que el margen automático funcione
        enlace.style.display = "block"; 
        enlace.style.color = "#ef4444";
        enlace.style.fontWeight = "bold";
        
        enlace.href = aporte.linkAntivirus || "https://virustotal.com";
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
    }
}

    contenedorSeguridad.style.display = "block";
} else {
    contenedorSeguridad.style.display = "none";
}

        } else {
            window.location.href = "index.html";
        }
    })
    .catch(error => {
        console.error("Error cargando datos:", error);
        window.location.href = "index.html";
    });
});