// src/utils/pdfGenerator.js

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

/**
 * Genera un PDF con los resultados del análisis de colas
 * @param {string} modelo - Tipo de modelo ('M/M/1' o 'M/M/S')
 * @param {object} datos - Datos de entrada (lambda, mu, s)
 * @param {object} resultados - Resultados calculados
 * @returns {Promise<void>}
 */
export const generarPDF = async (modelo, datos, resultados) => {
  try {
    const fechaHora = new Date().toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte Teoría de Colas</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
          }
          h1 {
            color: #2c3e50;
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
          }
          h2 {
            color: #34495e;
            margin-top: 25px;
            border-left: 4px solid #3498db;
            padding-left: 10px;
          }
          .info-section {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .parametro {
            margin: 8px 0;
            font-size: 14px;
          }
          .parametro strong {
            color: #2c3e50;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 10px;
            border: 1px solid #bdc3c7;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .ecuacion {
            font-family: 'Courier New', monospace;
            background-color: #f4f4f4;
            padding: 5px 8px;
            border-radius: 3px;
            font-size: 13px;
          }
          .descripcion {
            font-size: 12px;
            color: #7f8c8d;
            font-style: italic;
            margin-top: 3px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
            border-top: 1px solid #bdc3c7;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <h1>Reporte de Análisis - Teoría de Colas</h1>
        
        <div class="info-section">
          <h2>Información General</h2>
          <div class="parametro"><strong>Modelo seleccionado:</strong> ${modelo}</div>
          <div class="parametro"><strong>Fecha de generación:</strong> ${fechaHora}</div>
        </div>

        <div class="info-section">
          <h2>Parámetros de Entrada</h2>
          <div class="parametro"><strong>λ (Tasa de llegada):</strong> ${datos.lambda} clientes/unidad de tiempo</div>
          <div class="parametro"><strong>μ (Tasa de servicio):</strong> ${datos.mu} clientes/unidad de tiempo</div>
          ${modelo === 'M/M/S' ? `<div class="parametro"><strong>S (Número de servidores):</strong> ${datos.s}</div>` : ''}
        </div>

        <h2>Ecuaciones Utilizadas</h2>
        <table>
          <tr>
            <th>Métrica</th>
            <th>Descripción</th>
            <th>Ecuación</th>
          </tr>
          <tr>
            <td><strong>ρ</strong></td>
            <td>${resultados.descripciones.rho}</td>
            <td><span class="ecuacion">${resultados.ecuaciones.rho}</span></td>
          </tr>
          <tr>
            <td><strong>P₀</strong></td>
            <td>${resultados.descripciones.P0}</td>
            <td><span class="ecuacion">${resultados.ecuaciones.P0}</span></td>
          </tr>
          <tr>
            <td><strong>Lq</strong></td>
            <td>${resultados.descripciones.Lq}</td>
            <td><span class="ecuacion">${resultados.ecuaciones.Lq}</span></td>
          </tr>
          <tr>
            <td><strong>L</strong></td>
            <td>${resultados.descripciones.L}</td>
            <td><span class="ecuacion">${resultados.ecuaciones.L}</span></td>
          </tr>
          <tr>
            <td><strong>Wq</strong></td>
            <td>${resultados.descripciones.Wq}</td>
            <td><span class="ecuacion">${resultados.ecuaciones.Wq}</span></td>
          </tr>
          <tr>
            <td><strong>W</strong></td>
            <td>${resultados.descripciones.W}</td>
            <td><span class="ecuacion">${resultados.ecuaciones.W}</span></td>
          </tr>
        </table>

        <h2>Resultados Obtenidos</h2>
        <table>
          <tr>
            <th>Métrica</th>
            <th>Valor</th>
            <th>Descripción</th>
          </tr>
          <tr>
            <td><strong>ρ</strong></td>
            <td>${resultados.rho}</td>
            <td>${resultados.descripciones.rho}</td>
          </tr>
          <tr>
            <td><strong>P₀</strong></td>
            <td>${resultados.P0}</td>
            <td>${resultados.descripciones.P0}</td>
          </tr>
          <tr>
            <td><strong>Lq</strong></td>
            <td>${resultados.Lq}</td>
            <td>${resultados.descripciones.Lq}</td>
          </tr>
          <tr>
            <td><strong>L</strong></td>
            <td>${resultados.L}</td>
            <td>${resultados.descripciones.L}</td>
          </tr>
          <tr>
            <td><strong>Wq</strong></td>
            <td>${resultados.Wq}</td>
            <td>${resultados.descripciones.Wq}</td>
          </tr>
          <tr>
            <td><strong>W</strong></td>
            <td>${resultados.W}</td>
            <td>${resultados.descripciones.W}</td>
          </tr>
        </table>

        <div class="footer">
          <p>Documento generado automáticamente por la aplicación de Teoría de Colas</p>
          <p>Desarrollado como herramienta de modelación y simulación de sistemas</p>
        </div>
      </body>
      </html>
    `;

    // Generar el PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false
    });

    // Verificar si se puede compartir
    const canShare = await Sharing.isAvailableAsync();
    
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Guardar reporte de Teoría de Colas',
        UTI: 'com.adobe.pdf'
      });
    } else {
      alert('No se puede compartir el PDF en este dispositivo');
    }

    return { success: true };
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return { success: false, error: error.message };
  }
};