document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const aporteId = parseInt(params.get("id")); 
    const tipoAporte = params.get("tipo") || "juegos-pc"; 

    if (isNaN(aporteId)) {
        document.getElementById("app-title").innerText = "Aporte no encontrado";
        return;
    }

    let jsonFile = "juegos-pc.json";
    if (tipoAporte === "juegos-android") jsonFile = "juegos-android.json";
    if (tipoAporte === "apps") jsonFile = "apps.json";
    if (tipoAporte === "isos") jsonFile = "isos.json";

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) throw new Error("Error en base de datos");
            return response.json();
        })
        .then(data => {
            // Comparación estricta de números enteros
            const aporte = data.find(item => parseInt(item.id) === aporteId);

            if (aporte) {
                document.getElementById("app-title").innerText = aporte.titulo || aporte.name || "Sin título";
                document.getElementById("app-icon").src = aporte.icono || aporte.image || "https://placeholder.com";
                document.getElementById("app-server").innerHTML = `<i class="fa-solid fa-server"></i> Servidor: ${aporte.servidor || 'Up-4ever (Servidor Gratuito)'}`;
                
                document.getElementById("app-description").innerText = aporte.descripcion || 
                    "Este aporte ha sido verificado y está listo para ser descargado de forma segura e inmediata.";

                document.getElementById("app-requirements").innerHTML = aporte.requisitos ? 
                    aporte.requisitos.replace(/\n/g, "<br>") : 
                    "<strong>Sistema Operativo:</strong> Windows 10/11 (64-bit)<br><strong>Memoria RAM:</strong> 4 GB mínimo<br><strong>Gráficos:</strong> Integrados o Dedicados.";

                if (aporte.gameplay) {
                    document.getElementById("app-gameplay").src = aporte.gameplay;
                } else if (aporte.banner) {
                    document.getElementById("app-gameplay").src = aporte.banner;
                } else {
                    document.getElementById("app-gameplay").src = aporte.icono || aporte.image;
                }

                downloadUrl = aporte.url || aporte.download_link || "#";
            } else {
                document.getElementById("app-title").innerText = "El aporte no existe";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("app-title").innerText = "Error al cargar detalles";
        });
});
