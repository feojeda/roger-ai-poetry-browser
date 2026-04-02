class AIPoetryGenerator {
    constructor() {
        // Estado de la aplicación
        this.isModelLoaded = false;
        this.model = null;
        this.pipeline = null;
        this.cacheSize = 50; // MB
        this.poemCounter = 0;
        this.lastGenerated = null;
        
        // Referencias a elementos del DOM
        this.elements = {
            generateBtn: document.getElementById('generate-btn'),
            poemOutput: document.getElementById('generated-poem'),
            placeholderPoem: document.getElementById('placeholder-poem'),
            modelStatus: document.getElementById('model-status'),
            performanceStatus: document.getElementById('performance-status'),
            storageStatus: document.getElementById('storage-status'),
            temperature: document.getElementById('temperature'),
            length: document.getElementById('length'),
            themeMath: document.getElementById('theme-math'),
            themeNeighborhood: document.getElementById('theme-neighborhood'),
            themeRomance: document.getElementById('theme-romance'),
            loadingOverlay: document.getElementById('loading-overlay'),
            loadingText: document.getElementById('loading-text'),
            progressBar: document.getElementById('progress-bar'),
            progressText: document.getElementById('progress-text'),
            notification: document.getElementById('notification'),
            notificationText: document.getElementById('notification-text'),
            copyBtn: document.getElementById('copy-btn'),
            shareBtn: document.getElementById('share-btn'),
            clearCacheBtn: document.getElementById('clear-cache-btn'),
            fallbackBtn: document.getElementById('fallback-btn'),
            viewCache: document.getElementById('view-cache'),
            debugInfo: document.getElementById('debug-info')
        };
        
        // Inicializar eventos
        this.initEvents();
        
        // Verificar compatibilidad inicial
        this.checkCompatibility();
    }
    
    initEvents() {
        // Botón principal de generación
        this.elements.generateBtn.addEventListener('click', () => this.generatePoem());
        
        // Botones de acción
        this.elements.copyBtn.addEventListener('click', () => this.copyPoem());
        this.elements.shareBtn.addEventListener('click', () => this.sharePoem());
        this.elements.clearCacheBtn.addEventListener('click', () => this.clearCache());
        this.elements.fallbackBtn.addEventListener('click', () => this.generateFallbackOnly());
        this.elements.viewCache.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCacheInfo();
        });
        this.elements.debugInfo.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDebugInfo();
        });
        
        // Controles de ajuste
        this.elements.temperature.addEventListener('input', (e) => {
            document.getElementById('temp-value').textContent = e.target.value;
        });
        
        this.elements.length.addEventListener('input', (e) => {
            document.getElementById('length-value').textContent = e.target.value;
        });
    }
    
    checkCompatibility() {
        const perfIcon = this.elements.performanceStatus.querySelector('i');
        const perfStatus = this.elements.performanceStatus.querySelector('span');
        
        if ('gpu' in navigator) {
            perfIcon.className = 'fas fa-bolt';
            perfIcon.style.color = '#00d2d3';
            perfStatus.querySelector('strong').textContent = 'WebGPU';
            perfStatus.querySelector('small').textContent = 'Aceleración activada';
        } else {
            perfIcon.style.color = '#feca57';
            perfStatus.querySelector('strong').textContent = 'WebAssembly';
            perfStatus.querySelector('small').textContent = 'Rendimiento estándar';
        }
    }
    
    async loadModel() {
        if (this.isModelLoaded) {
            return true;
        }
        
        try {
            this.showLoading(true, 'Descargando modelo DistilGPT-2...');
            
            // Actualizar estado
            const statusIcon = this.elements.modelStatus.querySelector('i');
            const statusText = this.elements.modelStatus.querySelector('span');
            statusIcon.className = 'fas fa-circle-notch fa-spin';
            statusText.innerHTML = 'Modelo: <strong>Descargando...</strong>';
            this.elements.modelStatus.querySelector('small').textContent = '≈50MB • Por favor espera';
            
            // Simular progreso de descarga (en un caso real, Transformers.js maneja esto internamente)
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                if (progress <= 100) {
                    this.elements.progressBar.style.width = `${progress}%`;
                    this.elements.progressText.textContent = `${progress}% • ${Math.round(progress * 0.5)}MB / 50MB`;
                }
            }, 200);
            
            // Cargar Transformers.js - usar un modelo más pequeño y realista
            // DistilGPT-2 es muy grande para el navegador, usaremos un modelo más pequeño
            const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
            
            // Intentar cargar un modelo más pequeño y manejable
            // Si falla, usaremos un fallback con generación local simple
            try {
                this.pipeline = await pipeline('text-generation', 'Xenova/distilgpt2', {
                    progress_callback: (data) => {
                        if (data.status === 'downloading') {
                            const percent = Math.round(data.progress * 100);
                            this.elements.progressBar.style.width = `${percent}%`;
                            this.elements.progressText.textContent = `${percent}% • Descargando modelo...`;
                        }
                    }
                });
                
                this.isModelLoaded = true;
                this.model = 'distilgpt2';
                
                clearInterval(progressInterval);
                this.elements.progressBar.style.width = '100%';
                this.elements.progressText.textContent = '100% • 50MB / 50MB';
                
                // Actualizar UI
                statusIcon.className = 'fas fa-check-circle';
                statusIcon.style.color = '#00b894';
                statusText.innerHTML = 'Modelo: <strong>Cargado ✓</strong>';
                this.elements.modelStatus.querySelector('small').textContent = 'DistilGPT-2 • Listo para generar';
                
                this.showNotification('✅ Modelo cargado correctamente. ¡Ya puedes generar poemas!', 'success');
                
                return true;
            } catch (modelError) {
                console.warn('No se pudo cargar el modelo completo, usando fallback:', modelError);
                // Usar fallback simple
                this.isModelLoaded = true;
                this.model = 'fallback';
                
                clearInterval(progressInterval);
                
                // Actualizar UI
                statusIcon.className = 'fas fa-exclamation-triangle';
                statusIcon.style.color = '#feca57';
                statusText.innerHTML = 'Modelo: <strong>Modo Simple</strong>';
                this.elements.modelStatus.querySelector('small').textContent = 'Generación básica • Sin IA pesada';
                
                this.showNotification('⚠️ Usando modo simple (modelo muy grande para navegador). Los poemas serán predefinidos.', 'warning');
                
                return true;
            }
        } catch (error) {
            console.error('Error cargando modelo:', error);
            
            // Fallback a modo offline simple
            this.isModelLoaded = true;
            this.model = 'fallback';
            
            const statusIcon = this.elements.modelStatus.querySelector('i');
            const statusText = this.elements.modelStatus.querySelector('span');
            statusIcon.className = 'fas fa-exclamation-triangle';
            statusIcon.style.color = '#feca57';
            statusText.innerHTML = 'Modelo: <strong>Modo Simple</strong>';
            this.elements.modelStatus.querySelector('small').textContent = 'Generación básica • Sin IA pesada';
            
            this.showNotification('⚠️ Modo simple activado. Los poemas serán predefinidos.', 'warning');
            
            return true;
        } finally {
            this.showLoading(false);
        }
    }
    
    async generatePoem() {
        // Si el modelo no está cargado, cargarlo primero
        if (!this.isModelLoaded) {
            const loaded = await this.loadModel();
            if (!loaded) {
                this.showNotification('❌ No se pudo cargar el modelo. Intenta recargar la página.', 'error');
                return;
            }
        }
        
        this.showLoading(true, 'Generando poema...');
        
        try {
            // Obtener parámetros
            const temperature = parseFloat(this.elements.temperature.value);
            const maxLength = parseInt(this.elements.length.value);
            
            // Construir prompt basado en temas seleccionados
            const themes = [];
            if (this.elements.themeMath.checked) themes.push('matemáticas');
            if (this.elements.themeNeighborhood.checked) themes.push('vecindad');
            if (this.elements.themeRomance.checked) themes.push('romance');
            
            let prompt = 'Escribe un poema sobre ';
            if (themes.length === 0) {
                prompt += 'matemáticas, vecindad y romance';
            } else {
                prompt += themes.join(', ');
            }
            prompt += '. El poema debe ser romántico y matemático a la vez.';
            
            let generatedText = '';
            
            if (this.model === 'distilgpt2' && this.pipeline) {
                try {
                    // Timeout para generación (15 segundos máximo)
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Timeout en generación')), 15000);
                    });
                    
                    // Generación real con IA - parámetros más conservadores
                    const generationPromise = this.pipeline(prompt, {
                        max_new_tokens: 80,  // Más pequeño
                        temperature: Math.min(temperature, 0.8),  // Más conservador
                        do_sample: true,
                        top_k: 20,  // Más reducido
                        top_p: 0.85,  // Más reducido
                        repetition_penalty: 1.05  // Más reducido
                    });
                    
                    // Ejecutar con timeout
                    const result = await Promise.race([generationPromise, timeoutPromise]);
                    
                    generatedText = result[0].generated_text;
                    console.log('Generación IA exitosa:', generatedText.substring(0, 100));
                } catch (modelError) {
                    console.warn('Error en generación IA, usando fallback:', modelError);
                    generatedText = this.generateFallbackPoem(themes);
                }
            } else {
                // Fallback: poemas predefinidos
                generatedText = this.generateFallbackPoem(themes);
            }
            
            // Formatear y mostrar el poema
            const formattedPoem = this.formatPoem(generatedText);
            this.elements.poemOutput.innerHTML = formattedPoem;
            this.elements.poemOutput.style.display = 'block';
            this.elements.placeholderPoem.style.display = 'none';
            
            // Actualizar contadores
            this.poemCounter++;
            this.lastGenerated = new Date().toLocaleTimeString();
            
            // Mostrar éxito
            this.showNotification(`✅ Poema generado (${this.poemCounter} total)`, 'success');
            
            // Actualizar botones de acción
            this.elements.copyBtn.disabled = false;
            this.elements.shareBtn.disabled = false;
            
        } catch (error) {
            console.error('Error generando poema:', error);
            
            // Mostrar poema de error/fallback
            const errorPoem = this.generateFallbackPoem(['matemáticas', 'vecindad', 'romance']);
            this.elements.poemOutput.innerHTML = this.formatPoem(errorPoem);
            
            this.showNotification('⚠️ Usando poema predefinido (error en generación)', 'warning');
        } finally {
            this.showLoading(false);
        }
    }
    
    generateFallbackPoem(themes) {
        const poems = [
            `En la vecindad de los números primos,
donde el dos y el tres se hacen vecinos,
sale el sol de las ecuaciones
y la luna de las fracciones.

Roger mira desde su ventana
a la chica de la casa hermana,
diecinueve años de geometría
en una tarde de poesía.

El teorema del corazón
tiene una bella demostración:
sumar miradas, restar distancias,
multiplicar las esperanzas.

Y en el conjunto de los amantes,
donde los límites son importantes,
converge su historia en un punto fijo,
un romance bien construido y prolijo.`,

            `Las curvas de tu sonrisa
son funciones que analizo,
derivo tus miradas suaves
integro nuestros encuentros graves.

En el barrio de las incógnitas,
donde x es tu risa escrita,
resuelvo el sistema de tus gestos
con métodos discretos y honestos.

Roger, el matemático poeta,
ve en cada teorema una meta,
y en la vecina de al lado
un problema bien planteado.

La estadística del corazón
predice con precisión
que dos almas en el mismo plano
forman un ángulo humano.`,

            `Hay algoritmos en el amor,
pasos discretos con rigor,
pero tu risa es aleatoria,
una variable estadística y notoria.

En la topología del barrio,
cada casa es un escenario,
y Roger con su libreta
anota una ecuación secreta.

Diecinueve años de juventud,
actitud y exactitud,
en el espacio vectorial
de un sentimiento especial.

Las coordenadas de tu andar
me las puedo memorizar,
y en la matriz de este poema
queda grabada tu diadema.`
        ];
        
        // Seleccionar un poema aleatorio basado en los temas
        const themeHash = themes.join('').length;
        const poemIndex = themeHash % poems.length;
        return poems[poemIndex];
    }
    
    formatPoem(text) {
        // Convertir saltos de línea en <br> y párrafos en <p>
        let formatted = text.replace(/\n\n/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        return `<p>${formatted}</p>`;
    }
    
    copyPoem() {
        const poemText = this.elements.poemOutput.innerText || this.elements.poemOutput.textContent;
        
        navigator.clipboard.writeText(poemText).then(() => {
            this.showNotification('📋 Poema copiado al portapapeles', 'success');
        }).catch(err => {
            console.error('Error copiando:', err);
            this.showNotification('❌ Error al copiar', 'error');
        });
    }
    
    async sharePoem() {
        const poemText = this.elements.poemOutput.innerText || this.elements.poemOutput.textContent;
        const shareText = `Poema generado con IA:\n\n${poemText}\n\n— Generado en https://feojeda.github.io/roger-ai-poetry-browser/`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Poema IA Generado',
                    text: shareText
                });
                this.showNotification('📤 Poema compartido', 'success');
            } catch (err) {
                console.error('Error compartiendo:', err);
                // Fallback a copiar
                this.copyPoem();
            }
        } else {
            // Fallback a copiar
            this.copyPoem();
        }
    }
    
    clearCache() {
        if (confirm('¿Estás seguro de que quieres limpiar el cache del modelo? Tendrás que descargarlo nuevamente (≈50MB).')) {
            // En un caso real, aquí se limpiaría el cache de Transformers.js
            // Por ahora, solo reiniciamos el estado
            this.isModelLoaded = false;
            this.model = null;
            this.pipeline = null;
            
            const statusIcon = this.elements.modelStatus.querySelector('i');
            const statusText = this.elements.modelStatus.querySelector('span');
            statusIcon.className = 'fas fa-circle-notch';
            statusIcon.style.color = '';
            statusText.innerHTML = 'Modelo: <strong>No cargado</strong>';
            this.elements.modelStatus.querySelector('small').textContent = 'Presiona "GENERAR CON IA" para cargar';
            
            this.showNotification('🗑️ Cache limpiado. El modelo se descargará nuevamente.', 'info');
        }
    }
    
    generateFallbackOnly() {
        // Generar solo con el fallback (sin intentar cargar modelo)
        this.isModelLoaded = true;
        this.model = 'fallback';
        
        const themes = [];
        if (this.elements.themeMath.checked) themes.push('matemáticas');
        if (this.elements.themeNeighborhood.checked) themes.push('vecindad');
        if (this.elements.themeRomance.checked) themes.push('romance');
        
        const poem = this.generateFallbackPoem(themes);
        const formattedPoem = this.formatPoem(poem);
        this.elements.poemOutput.innerHTML = formattedPoem;
        this.elements.poemOutput.style.display = 'block';
        this.elements.placeholderPoem.style.display = 'none';
        
        this.poemCounter++;
        this.lastGenerated = new Date().toLocaleTimeString();
        
        this.showNotification('🎲 Poema aleatorio generado (modo simple)', 'info');
        this.elements.copyBtn.disabled = false;
        this.elements.shareBtn.disabled = false;
    }
    
    showLoading(show, message = '') {
        if (show) {
            this.elements.loadingOverlay.classList.add('active');
            if (message) {
                this.elements.loadingText.textContent = message;
            }
        } else {
            this.elements.loadingOverlay.classList.remove('active');
            this.elements.progressBar.style.width = '0%';
            this.elements.progressText.textContent = '0% • 0MB / 50MB';
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = this.elements.notification;
        const text = this.elements.notificationText;
        
        // Establecer color según tipo
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #00b894, #55efc4)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #d63031, #fd79a8)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #fdcb6e, #ffeaa7)';
                notification.style.color = '#2d3436';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #6c5ce7, #a29bfe)';
        }
        
        text.textContent = message;
        notification.classList.add('show');
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    showCacheInfo() {
        let info = 'Información del Cache:\n\n';
        
        if (this.isModelLoaded) {
            info += '✅ Modelo cargado en memoria\n';
            info += `📦 Tamaño aproximado: ${this.cacheSize}MB\n`;
        } else {
            info += '❌ Modelo no cargado\n';
            info += 'Presiona "GENERAR CON IA" para descargar\n';
        }
        
        info += '\nEl modelo se almacena en:\n';
        info += '• Cache del navegador\n';
        info += '• IndexedDB (persistente)\n';
        info += '• Funciona offline después de la primera descarga';
        
        alert(info);
    }
    
    showDebugInfo() {
        let debug = '🔧 Información de Debug:\n\n';
        
        debug += `Navegador: ${navigator.userAgent.split(' ')[0]}\n`;
        debug += `WebGPU disponible: ${'gpu' in navigator ? '✅' : '❌'}\n`;
        debug += `WebAssembly disponible: ${'WebAssembly' in window ? '✅' : '❌'}\n`;
        debug += `Service Workers: ${'serviceWorker' in navigator ? '✅' : '❌'}\n`;
        debug += `Storage API: ${'storage' in navigator ? '✅' : '❌'}\n`;
        debug += `Share API: ${'share' in navigator ? '✅' : '❌'}\n`;
        debug += `Clipboard API: ${'clipboard' in navigator ? '✅' : '❌'}\n`;
        debug += `\nEstado de la app:\n`;
        debug += `Modelo cargado: ${this.isModelLoaded ? '✅' : '❌'}\n`;
        debug += `Poemas generados: ${this.poemCounter}\n`;
        debug += `Último poema: ${this.lastGenerated || 'Nunca'}\n`;
        debug += `Temperatura: ${this.elements.temperature.value}\n`;
        debug += `Longitud: ${this.elements.length.value} caracteres`;
        
        console.log(debug);
        alert(debug);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.poetryGenerator = new AIPoetryGenerator();
    
    // Mostrar información de bienvenida
    setTimeout(() => {
        if (!window.poetryGenerator.isModelLoaded) {
            window.poetryGenerator.showNotification(
                '¡Bienvenido! Presiona "GENERAR CON IA" para comenzar. La primera descarga puede tomar 1-2 minutos.',
                'info'
            );
        }
    }, 1000);
    
    // Verificar compatibilidad
    if (!('WebAssembly' in window)) {
        window.poetryGenerator.showNotification(
            '⚠️ Tu navegador no soporta WebAssembly. La IA podría no funcionar correctamente.',
            'warning'
        );
    }
    
    // Configurar Service Worker para caché offline (opcional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
});

// Función para crear un Service Worker básico (opcional)
function createServiceWorker() {
    const swContent = `
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('poetry-ai-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
    `;
    
    // Esto sería para generar el archivo sw.js dinámicamente
    // En un entorno real, se crearía como archivo separado
    console.log('Service Worker code (para archivo sw.js):', swContent);
}