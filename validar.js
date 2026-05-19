export default async function handler(req, res) {
    // Solo permitimos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { token } = req.body;
    // Usamos una variable de entorno de Vercel para proteger la clave secreta
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; 

    if (!token) {
        return res.status(400).json({ error: 'Falta el token del captcha' });
    }

    try {
        // Validamos el token directamente con los servidores de Google
        const response = await fetch(`https://google.com{secretKey}&response=${token}`, {
            method: 'POST'
        });
        
        const data = await response.json();

        if (data.success) {
            // ¡Éxito! Aquí puedes devolver el enlace real de descarga de forma segura
            return res.status(200).json({ success: true, message: 'Humano verificado' });
        } else {
            return res.status(400).json({ success: false, error: 'Captcha inválido o expirado' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
