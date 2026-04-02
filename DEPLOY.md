# 🚀 Deployment en GitHub Pages

Esta guía te ayudará a desplegar el Generador de Poesía IA en GitHub Pages.

## 📋 Prerrequisitos

1. Una cuenta de GitHub
2. Git instalado en tu computadora
3. Conexión a internet

## 🛠️ Pasos para el Deployment

### Paso 1: Crear un nuevo repositorio

1. Ve a [GitHub](https://github.com)
2. Haz clic en el botón "+" en la esquina superior derecha
3. Selecciona "New repository"
4. Configura el repositorio:
   - **Repository name**: `roger-ai-poetry-browser`
   - **Description**: `Generador de Poesía IA en el Navegador para Roger`
   - **Public** (recomendado)
   - No inicialices con README, .gitignore o license
5. Haz clic en "Create repository"

### Paso 2: Subir los archivos

**Opción A: Usando la línea de comandos**

```bash
# Navega a la carpeta del proyecto
cd roger-ai-poetry-browser

# Inicializa git
git init

# Agrega todos los archivos
git add .

# Haz commit
git commit -m "Initial commit: Generador de Poesía IA"

# Agrega el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/roger-ai-poetry-browser.git

# Sube los archivos
git push -u origin main
```

**Opción B: Usando la interfaz web de GitHub**

1. En la página de tu nuevo repositorio, busca la sección "…or push an existing repository from the command line"
2. Sigue las instrucciones que aparecen allí

**Opción C: Arrastrar y soltar**

1. En la página de tu repositorio, haz clic en "Add file" → "Upload files"
2. Arrastra y suelta todos los archivos de la carpeta `roger-ai-poetry-browser`
3. Haz clic en "Commit changes"

### Paso 3: Configurar GitHub Pages

1. En tu repositorio, ve a **Settings** (pestaña superior derecha)
2. En el menú lateral izquierdo, haz clic en **Pages**
3. En la sección "Build and deployment":
   - **Source**: Selecciona "Deploy from a branch"
   - **Branch**: Selecciona `main` y carpeta `/ (root)`
4. Haz clic en **Save**

### Paso 4: Esperar el deployment

- GitHub Pages comenzará a construir tu sitio
- Esto puede tomar 1-2 minutos
- Una vez completado, verás un mensaje como "Your site is published at https://TU_USUARIO.github.io/roger-ai-poetry-browser/"

### Paso 5: Verificar el sitio

1. Visita: `https://TU_USUARIO.github.io/roger-ai-poetry-browser/`
2. Prueba la aplicación:
   - Haz clic en "GENERAR CON IA"
   - Espera la descarga del modelo (1-2 minutos la primera vez)
   - Genera algunos poemas
   - Prueba los controles de creatividad y longitud

## 🔧 Solución de Problemas

### ❌ El sitio no se carga

1. **Espera unos minutos**: El deployment puede tardar
2. **Verifica la URL**: Asegúrate de usar la URL correcta
3. **Revisa los archivos**: Verifica que todos los archivos estén en la raíz del repositorio

### ❌ La IA no funciona

1. **Primera carga lenta**: La descarga inicial del modelo (50MB) puede tomar 1-2 minutos
2. **Navegador compatible**: Usa Chrome, Firefox, Safari o Edge actualizados
3. **Consola de desarrollador**: Presiona F12 y revisa la pestaña "Console" para errores

### ❌ Error 404 en GitHub Pages

1. **Verifica el branch**: Asegúrate de que GitHub Pages está configurado para el branch `main`
2. **Archivo .nojekyll**: Asegúrate de que el archivo `.nojekyll` esté presente
3. **Estructura de archivos**: Los archivos deben estar en la raíz, no en subcarpetas

### ❌ El modelo no se descarga

1. **Conexión a internet**: Necesitas internet para la primera descarga
2. **Tamaño del modelo**: Asegúrate de tener suficiente espacio (≈50MB)
3. **Permisos del navegador**: Algunos navegadores pueden bloquear descargas grandes

## 🌐 Dominio Personalizado (Opcional)

Si quieres usar un dominio personalizado:

1. Compra un dominio (ejemplo: `poesia-ia-roger.com`)
2. En GitHub Pages Settings, agrega tu dominio en "Custom domain"
3. Configura los registros DNS con tu proveedor de dominio:
   - **Tipo A**: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - O **CNAME**: `TU_USUARIO.github.io`

## 📱 Acceso Móvil

La aplicación está optimizada para móviles:
- Diseño responsive
- Touch-friendly
- WebAssembly optimizado para móviles

**Nota**: En móviles, la descarga del modelo puede ser más lenta dependiendo de la conexión.

## 🔄 Actualizaciones

Para actualizar la aplicación:

```bash
# Haz tus cambios en los archivos
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

GitHub Pages se actualizará automáticamente en 1-2 minutos.

## 📊 Estadísticas

Puedes monitorear el tráfico de tu sitio:
1. Ve a Settings → Pages
2. Busca "GitHub Pages site build history and usage"
3. Haz clic en "View analytics"

## 🛡️ Seguridad

- **HTTPS automático**: GitHub Pages usa HTTPS por defecto
- **Sin datos personales**: La aplicación no recopila datos
- **IA local**: Todo el procesamiento ocurre en el navegador

## 🆘 Soporte

Si tienes problemas:
1. Revisa la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages)
2. Busca en [GitHub Community](https://github.com/orgs/community/discussions)
3. Crea un issue en tu repositorio

---

**🎉 ¡Felicidades! Tu Generador de Poesía IA está ahora en línea.**

**URL de tu sitio:** `https://TU_USUARIO.github.io/roger-ai-poetry-browser/`

Comparte el enlace con Roger y disfruten de los poemas generados por IA. ✨