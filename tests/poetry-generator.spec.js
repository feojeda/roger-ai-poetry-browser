import { test, expect } from '@playwright/test';

test.describe('Generador de Poesía IA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('la página carga correctamente', async ({ page }) => {
    // Verificar título
    await expect(page).toHaveTitle('Generador de Poesía IA en el Navegador - Roger');
    
    // Verificar elementos principales
    await expect(page.locator('h1')).toContainText('Poesía IA en el Navegador');
    await expect(page.locator('#generate-btn')).toBeVisible();
    await expect(page.locator('#poem-output')).toBeVisible();
    
    // Verificar temas
    await expect(page.locator('#theme-math')).toBeVisible();
    await expect(page.locator('#theme-neighborhood')).toBeVisible();
    await expect(page.locator('#theme-romance')).toBeVisible();
    
    // Tomar screenshot
    await page.screenshot({ path: 'tests/screenshots/homepage-loaded.png', fullPage: true });
  });

  test('el botón "GENERAR CON IA" funciona', async ({ page }) => {
    // Hacer clic en el botón de generar
    const generateBtn = page.locator('#generate-btn');
    await generateBtn.click();
    
    // Verificar que se muestra el overlay de carga
    const loadingOverlay = page.locator('#loading-overlay');
    await expect(loadingOverlay).toBeVisible({ timeout: 5000 });
    
    // Verificar que el texto de carga aparece
    const loadingText = page.locator('#loading-text');
    await expect(loadingText).toContainText(/Descargando|Generando/);
    
    // Esperar a que termine la generación (máximo 30 segundos)
    await expect(loadingOverlay).toBeHidden({ timeout: 30000 });
    
    // Verificar que se generó un poema
    const poemOutput = page.locator('#generated-poem');
    await expect(poemOutput).toBeVisible({ timeout: 10000 });
    await expect(poemOutput).not.toBeEmpty({ timeout: 10000 });
    
    // Tomar screenshot del resultado
    await page.screenshot({ path: 'tests/screenshots/poem-generated.png', fullPage: true });
    
    // Verificar que los botones de acción están habilitados
    await expect(page.locator('#copy-btn')).not.toBeDisabled();
    await expect(page.locator('#share-btn')).not.toBeDisabled();
  });

  test('el modelo se carga (o al menos intenta cargar)', async ({ page }) => {
    // Verificar estado inicial del modelo
    const modelStatus = page.locator('#model-status');
    await expect(modelStatus).toContainText(/Modelo:/);
    
    // Hacer clic para cargar el modelo
    await page.locator('#generate-btn').click();
    
    // Esperar a que el estado del modelo cambie
    await expect(modelStatus).toContainText(/Cargado|Modo Simple/, { timeout: 30000 });
    
    // Tomar screenshot del estado del modelo
    await page.screenshot({ path: 'tests/screenshots/model-loaded.png', fullPage: true });
    
    // Verificar que el contador de estado se actualiza
    const statusIcon = modelStatus.locator('i');
    await expect(statusIcon).toHaveClass(/fa-check-circle|fa-exclamation-triangle/);
  });

  test('se generan poemas con diferentes temas', async ({ page }) => {
    // Probar con solo matemáticas
    await page.locator('#theme-neighborhood').uncheck();
    await page.locator('#theme-romance').uncheck();
    
    await page.locator('#generate-btn').click();
    await expect(page.locator('#loading-overlay')).toBeHidden({ timeout: 30000 });
    
    const poem1 = await page.locator('#generated-poem').textContent();
    expect(poem1.length).toBeGreaterThan(50);
    await page.screenshot({ path: 'tests/screenshots/poem-math-only.png', fullPage: true });
    
    // Probar con todos los temas
    await page.locator('#theme-neighborhood').check();
    await page.locator('#theme-romance').check();
    
    await page.locator('#generate-btn').click();
    await expect(page.locator('#loading-overlay')).toBeHidden({ timeout: 30000 });
    
    const poem2 = await page.locator('#generated-poem').textContent();
    expect(poem2.length).toBeGreaterThan(50);
    await page.screenshot({ path: 'tests/screenshots/poem-all-themes.png', fullPage: true });
    
    // Los poemas deberían ser diferentes (aunque en fallback pueden ser similares)
    expect(poem1).not.toBe(poem2);
  });

  test('funcionalidad de copiar y compartir', async ({ page }) => {
    // Primero generar un poema
    await page.locator('#generate-btn').click();
    await expect(page.locator('#loading-overlay')).toBeHidden({ timeout: 30000 });
    
    // Probar botón de copiar
    await page.locator('#copy-btn').click();
    
    // Verificar notificación de copiado
    const notification = page.locator('#notification');
    await expect(notification).toBeVisible({ timeout: 5000 });
    await expect(notification).toContainText(/copiado|Copiado/);
    
    await page.screenshot({ path: 'tests/screenshots/copy-functionality.png', fullPage: true });
    
    // Probar botón de compartir (puede fallar si el navegador no soporta share)
    await page.locator('#share-btn').click();
    
    // Tomar screenshot después de intentar compartir
    await page.screenshot({ path: 'tests/screenshots/share-functionality.png', fullPage: true });
  });

  test('ajustes de temperatura y longitud funcionan', async ({ page }) => {
    // Cambiar temperatura
    const temperatureSlider = page.locator('#temperature');
    await temperatureSlider.fill('0.8');
    
    // Cambiar longitud
    const lengthSlider = page.locator('#length');
    await lengthSlider.fill('300');
    
    // Verificar que los valores se actualizan
    await expect(page.locator('#temp-value')).toContainText('0.8');
    await expect(page.locator('#length-value')).toContainText('300');
    
    // Generar poema con nuevos ajustes
    await page.locator('#generate-btn').click();
    await expect(page.locator('#loading-overlay')).toBeHidden({ timeout: 30000 });
    
    await page.screenshot({ path: 'tests/screenshots/adjustments-working.png', fullPage: true });
  });

  test('compatibilidad cross-browser básica', async ({ page, browserName }) => {
    // Esta prueba verifica que los elementos clave existen en todos los navegadores
    const elements = [
      '#generate-btn',
      '#generated-poem',
      '#model-status',
      '#temperature',
      '#length',
      '#theme-math',
      '#theme-neighborhood',
      '#theme-romance'
    ];
    
    for (const selector of elements) {
      await expect(page.locator(selector)).toBeVisible();
    }
    
    // Tomar screenshot específico del navegador
    await page.screenshot({ path: `tests/screenshots/cross-browser-${browserName}.png`, fullPage: true });
  });
});