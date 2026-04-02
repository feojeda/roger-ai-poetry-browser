// Test básico para verificar que los archivos existen y tienen contenido
const fs = require('fs');
const path = require('path');

console.log('=== Test Básico del Generador de Poesía IA ===\n');

const filesToCheck = [
  'index.html',
  'style.css', 
  'script.js',
  'README.md',
  'playwright.config.js',
  'tests/poetry-generator.spec.js',
  '.github/workflows/playwright.yml',
  'package.json'
];

let allPassed = true;

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.length > 0) {
        console.log(`✅ ${file} - OK (${stats.size} bytes)`);
        
        // Verificaciones específicas por archivo
        if (file === 'index.html') {
          if (content.includes('Transformers.js') && content.includes('DistilGPT-2')) {
            console.log('   ✓ Incluye Transformers.js y DistilGPT-2');
          } else {
            console.log('   ✗ Faltan referencias a Transformers.js/DistilGPT-2');
            allPassed = false;
          }
        }
        
        if (file === 'script.js') {
          if (content.includes('class AIPoetryGenerator') && content.includes('generatePoem()')) {
            console.log('   ✓ Clase AIPoetryGenerator con método generatePoem()');
          } else {
            console.log('   ✗ Faltan elementos clave en script.js');
            allPassed = false;
          }
        }
        
        if (file === 'tests/poetry-generator.spec.js') {
          if (content.includes('test.describe') && content.includes('Generador de Poesía IA')) {
            console.log('   ✓ Tests de Playwright configurados');
          } else {
            console.log('   ✗ Tests mal configurados');
            allPassed = false;
          }
        }
        
      } else {
        console.log(`❌ ${file} - VACÍO`);
        allPassed = false;
      }
    } else {
      console.log(`❌ ${file} - NO ES ARCHIVO`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ ${file} - NO ENCONTRADO: ${error.message}`);
    allPassed = false;
  }
});

// Verificar estructura del proyecto
console.log('\n=== Verificación de Estructura ===');
const dirsToCheck = ['.github/workflows', 'tests/screenshots'];
dirsToCheck.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  try {
    fs.accessSync(dirPath, fs.constants.F_OK);
    console.log(`✅ Directorio ${dir}/ - EXISTE`);
  } catch (error) {
    console.log(`❌ Directorio ${dir}/ - NO EXISTE`);
    allPassed = false;
  }
});

// Verificar que index.html referencia script.js y style.css
console.log('\n=== Verificación de Dependencias HTML ===');
try {
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  
  const checks = [
    { name: 'Referencia a style.css', check: htmlContent.includes('style.css') },
    { name: 'Referencia a script.js', check: htmlContent.includes('script.js') },
    { name: 'Referencia a Transformers.js CDN', check: htmlContent.includes('cdn.jsdelivr.net/npm/@xenova/transformers') },
    { name: 'Botón GENERAR CON IA', check: htmlContent.includes('GENERAR CON IA') || htmlContent.includes('generate-btn') },
    { name: 'Área de salida de poema', check: htmlContent.includes('generated-poem') }
  ];
  
  checks.forEach(({ name, check }) => {
    if (check) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name}`);
      allPassed = false;
    }
  });
} catch (error) {
  console.log(`❌ Error leyendo index.html: ${error.message}`);
  allPassed = false;
}

// Verificar package.json tiene scripts de test
console.log('\n=== Verificación de package.json ===');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.test) {
    console.log('✅ Script "test" definido');
  } else {
    console.log('❌ Script "test" no definido');
    allPassed = false;
  }
  
  if (packageJson.devDependencies && packageJson.devDependencies['@playwright/test']) {
    console.log('✅ Playwright como devDependency');
  } else {
    console.log('❌ Playwright no en devDependencies');
    allPassed = false;
  }
} catch (error) {
  console.log(`❌ Error leyendo package.json: ${error.message}`);
  allPassed = false;
}

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('El proyecto está listo para commit y push.');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('Revisa los errores arriba.');
}
console.log('='.repeat(50));