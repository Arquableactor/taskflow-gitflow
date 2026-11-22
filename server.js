// Servidor de desarrollo: sirve los archivos del proyecto por HTTP usando solo modulos nativos
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('.', import.meta.url));
const PUERTO = Number(process.env.PORT) || 3000;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function responder(res, estado, texto) {
  res.writeHead(estado, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(texto);
}

const servidor = createServer(async (req, res) => {
  let ruta;
  try {
    ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return responder(res, 400, 'Ruta invalida');
  }

  const archivo = normalize(join(RAIZ, ruta.endsWith('/') ? ruta + 'index.html' : ruta));

  // Impide leer archivos fuera de la carpeta del proyecto (por ejemplo /../../etc/passwd)
  if (!archivo.startsWith(RAIZ)) {
    return responder(res, 403, 'Acceso denegado');
  }

  try {
    const contenido = await readFile(archivo);
    res.writeHead(200, {
      'Content-Type': TIPOS[extname(archivo)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(contenido);
  } catch {
    responder(res, 404, 'No encontrado');
  }
});

servidor.listen(PUERTO, 'localhost', () => {
  console.log(`TaskFlow disponible en http://localhost:${PUERTO}`);
  console.log('Presiona Ctrl+C para detener el servidor');
});
