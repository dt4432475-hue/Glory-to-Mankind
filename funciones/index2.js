let downloadUrl = "#"; // Variable global compartida con el HTML

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const aporteId = parseInt(params.get("id"));
    const tipoAporte = params.get("tipo");

    //if (!aporteId || !tipoAporte) {
     //   window.location.href = "index.html";
       // return;
   // }

    let jsonFile = "";
    if (tipoAporte === "juegos-pc") jsonFile = "secciones/juegos-pc.json";
    else if (tipoAporte === "juegos-android") jsonFile = "secciones/juegos-android.json";
    else if (tipoAporte === "apps-android") jsonFile = "secciones/apps-android.json";
    else if (tipoAporte === "isos-herramientas") jsonFile = "secciones/isos-herramientas.json";
   else {
        console.log("El tipo de aporte recibido no coincide con ninguno: ", tipoAporte);
        return;
    }

    fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
        const aporte = data.find(item => parseInt(item.id) === aporteId);

        if (aporte) {
            const descEl = document.getElementById("app-description");
            const reqEl = document.getElementById("app-requirements");

            // Inyección básica de elementos
            document.getElementById("app-icon").src = aporte.icono || aporte.image || "";
            document.getElementById("app-title").textContent = aporte.titulo || aporte.name || "Sin título";
            document.getElementById("app-gameplay").src = aporte.gameplay || "";
            document.getElementById("app-gameplay2").src = aporte.gameplay2 || aporte.gameplay || "";

            // Inyección de la Descripción
            if (descEl) {
                descEl.innerHTML = aporte.descripcion || "No hay descripción disponible.";
            }

            // Inyección de los Requisitos
            if (reqEl) {
                reqEl.innerHTML = aporte.requisitos || "No se especifican requisitos.";
            }

            // Enlace de descarga (.url o .link)
            downloadUrl = aporte.url || aporte.link || "#";

        } else {
            window.location.href = "index.html";
        }
    })
    .catch(error => {
        console.error("Error cargando datos:", error);
        window.location.href = "index.html";
    });
});