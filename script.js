            perfStatus.querySelector('small').textContent = 'Aceleración activada';
        } else {
            perfIcon.style.color = '#feca57';
            perfStatus.querySelector('strong').textContent = 'WebAssembly';
            perfStatus.querySelector('small').textContent = 'Rendimiento estándar';
        }
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