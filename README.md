# Generador de Poesía IA en el Navegador - Roger

Una aplicación web que genera poemas sobre matemáticas, vecindad y romance usando IA directamente en el navegador. Creada para Roger y su vecina de 19 años.

## 🚀 Características

- **IA 100% en el navegador**: Ejecuta el modelo DistilGPT-2 localmente usando Transformers.js
- **Sin backend**: Todo el procesamiento ocurre en tu dispositivo
- **Privacidad total**: No se envían datos a servidores externos
- **Funciona offline**: Después de la primera descarga, no necesita internet
- **Optimizado para móviles**: Usa WebGPU/WebAssembly para máximo rendimiento
- **Temas específicos**: Genera poemas sobre matemáticas, vecindad, romance y la situación de Roger

## 🛠️ Tecnología

- **Transformers.js**: Framework para ejecutar modelos de IA en el navegador
- **Modelo**: DistilGPT-2 (versión ligera de GPT-2, ~50MB)
- **WebGPU/WebAssembly**: Para aceleración de hardware
- **Vanilla JavaScript**: Sin frameworks pesados
- **CSS Moderno**: Con variables CSS y diseño responsive

## 📋 Requisitos

- Navegador moderno (Chrome 79+, Firefox 70+, Safari 14+, Edge 79+)
- Conexión a internet para la primera descarga del modelo
- ≈50MB de espacio en cache del navegador
- WebAssembly habilitado (activado por defecto en navegadores modernos)

## 🚀 Cómo usar

1. **Abrir la aplicación**: Navega a `https://[usuario].github.io/roger-ai-poetry-browser/`
2. **Primera carga**: Presiona "GENERAR CON IA"
3. **Esperar descarga**: La primera vez descargará el modelo (≈50MB, 1-2 minutos)
4. **Generar poemas**: ¡Listo! Puedes generar poemas ilimitados
5. **Personalizar**: Ajusta creatividad y longitud con los controles deslizantes
6. **Compartir**: Copia o comparte tus poemas favoritos

## ⚙️ Configuración

- **Creatividad (Temperatura)**: Controla la aleatoriedad de la generación
  - Baja (0.5): Más predecible y coherente
  - Alta (1.5): Más creativo y sorprendente
- **Longitud**: Número máximo de caracteres por poema (50-200)

## 🎯 Prompt Engineering

El modelo está configurado para generar poemas sobre estos temas combinados:

1. **Matemáticas**: Integrales, derivadas, ecuaciones, teoremas
2. **Vecindad**: Balcones, paredes compartidas, encuentros casuales
3. **Romance**: Suspiros, miradas, corazones latentes
4. **Roger y su vecina**: Situación específica de Roger y su vecina de 19 años

## 🔧 Desarrollo

### Estructura del proyecto

```
roger-ai-poetry-browser/
├── index.html          # Página principal
├── style.css           # Estilos CSS
├── script.js           # Lógica de la aplicación
├── README.md           # Este archivo
└── .nojekyll           # Para GitHub Pages
```

### Ejecutar localmente

1. Clona el repositorio:
   ```bash
   git clone https://github.com/[usuario]/roger-ai-poetry-browser.git
   cd roger-ai-poetry-browser
   ```

2. Sirve los archivos con un servidor web simple:
   ```bash
   # Con Python
   python3 -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con PHP
   php -S localhost:8000
   ```

3. Abre `http://localhost:8000` en tu navegador

### Personalización

- **Cambiar modelo**: En `script.js`, línea 107, cambia `'Xenova/distilgpt2'` por otro modelo compatible
- **Modificar temas**: Edita el array `prompts` en `script.js` (línea 168)
- **Ajustar versos de fallback**: Modifica el array `fallbackVerses` en `script.js` (línea 19)

## 🌐 Deployment en GitHub Pages

1. Crea un nuevo repositorio en GitHub
2. Sube todos los archivos a la rama `main`
3. Ve a Settings → Pages
4. En "Source", selecciona "Deploy from a branch"
5. En "Branch", selecciona `main` y carpeta `/ (root)`
6. Guarda los cambios
7. Tu sitio estará disponible en `https://[usuario].github.io/roger-ai-poetry-browser/`

**Nota**: Asegúrate de incluir un archivo `.nojekyll` en la raíz para deshabilitar el procesamiento de Jekyll.

## ⚠️ Limitaciones y Consideraciones

- **Primera carga lenta**: La descarga inicial del modelo puede tomar 1-2 minutos
- **Uso de memoria**: El modelo ocupa ≈50MB en cache
- **Rendimiento**: La generación puede ser más lenta en dispositivos móviles antiguos
- **Calidad del texto**: DistilGPT-2 es un modelo pequeño, los resultados pueden variar en calidad
- **Compatibilidad**: Requiere navegadores modernos con soporte para WebAssembly

## 🔄 Fallback System

Si el modelo no carga correctamente, la aplicación usa un sistema de versos aleatorios predefinidos que mantienen la temática de matemáticas, vecindad y romance.

## 📊 Estado de la Aplicación

La aplicación muestra en tiempo real:
- Estado del modelo (cargado/descargando/error)
- Uso de cache
- Rendimiento (WebGPU/WebAssembly)
- Contador de poemas generados
- Hora del último poema

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Créditos

- **Transformers.js**: [Xenova](https://github.com/xenova/transformers.js)
- **Modelo DistilGPT-2**: Hugging Face
- **Diseño inspirado**: Generador de Poesía Vecinal-Matemática original
- **Fuentes**: Google Fonts (Poppins, Playfair Display)
- **Iconos**: Font Awesome

## 📞 Soporte

Para problemas o preguntas:
1. Revisa las [Issues](https://github.com/[usuario]/roger-ai-poetry-browser/issues)
2. Crea una nueva issue si no encuentras solución

---

**✨ Hecho con ❤️ para Roger y su vecina de 19 años ✨**