// src/screens/ResultsScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ResultsTable from '../components/ResultsTable';
import { generarPDF } from '../utils/pdfGenerator';

const ResultsScreen = ({ route, navigation }) => {
  const { modelo, datos, resultados } = route.params;
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const handleGenerarPDF = async () => {
    setGenerandoPDF(true);
    
    try {
      const resultado = await generarPDF(modelo, datos, resultados);
      
      if (resultado.success) {
        Alert.alert(
          'PDF Generado',
          'El reporte ha sido generado exitosamente',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          `No se pudo generar el PDF: ${resultado.error}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Ocurrió un error al generar el PDF',
        [{ text: 'OK' }]
      );
    } finally {
      setGenerandoPDF(false);
    }
  };

  const handleNuevoAnalisis = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Resultados del Análisis</Text>
          <View style={styles.modeloBadge}>
            <Text style={styles.modeloTexto}>Modelo: {modelo}</Text>
          </View>
        </View>

        {/* Datos de entrada */}
        <View style={styles.datosContainer}>
          <Text style={styles.sectionTitle}>Parámetros de Entrada</Text>
          <View style={styles.parametroRow}>
            <Text style={styles.parametroLabel}>λ (Tasa de llegada):</Text>
            <Text style={styles.parametroValor}>{datos.lambda}</Text>
          </View>
          <View style={styles.parametroRow}>
            <Text style={styles.parametroLabel}>μ (Tasa de servicio):</Text>
            <Text style={styles.parametroValor}>{datos.mu}</Text>
          </View>
          {datos.s && (
            <View style={styles.parametroRow}>
              <Text style={styles.parametroLabel}>S (Servidores):</Text>
              <Text style={styles.parametroValor}>{datos.s}</Text>
            </View>
          )}
        </View>

        {/* Tabla de resultados */}
        <View style={styles.resultadosContainer}>
          <ResultsTable resultados={resultados} />
        </View>

        {/* Interpretación básica */}
        <View style={styles.interpretacionContainer}>
          <Text style={styles.sectionTitle}>Interpretación Básica</Text>
          <Text style={styles.interpretacionTexto}>
            • El sistema tiene un factor de utilización de {resultados.rho}, lo que indica que 
            {parseFloat(resultados.rho) < 0.7 
              ? ' el sistema está poco congestionado.' 
              : parseFloat(resultados.rho) < 0.9 
              ? ' el sistema tiene una carga moderada.' 
              : ' el sistema está altamente congestionado.'}
          </Text>
          <Text style={styles.interpretacionTexto}>
            • En promedio hay {resultados.L} clientes en el sistema.
          </Text>
          <Text style={styles.interpretacionTexto}>
            • El tiempo promedio de espera en el sistema es de {resultados.W} unidades de tiempo.
          </Text>
          <Text style={styles.interpretacionTexto}>
            • El tiempo promedio de espera en cola es de {resultados.Wq} unidades de tiempo.
          </Text>
          <Text style={styles.interpretacionTexto}>
            • La probabilidad de encontrar el sistema vacío es {resultados.P0}.
          </Text>
        </View>

        {/* Espacio extra para que no se superpongan los botones */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Botones fijos en la parte inferior */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPDF, generandoPDF && styles.buttonDisabled]}
          onPress={handleGenerarPDF}
          disabled={generandoPDF}
          activeOpacity={0.8}
        >
          {generandoPDF ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📄 Generar PDF</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonNuevo]}
          onPress={handleNuevoAnalisis}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>🔄 Nuevo Análisis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modeloBadge: {
    backgroundColor: '#2980b9',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeloTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  datosContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 5,
  },
  parametroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  parametroLabel: {
    fontSize: 15,
    color: '#34495e',
    fontWeight: '500',
  },
  parametroValor: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  resultadosContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  interpretacionContainer: {
    backgroundColor: '#fff3cd',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  interpretacionTexto: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 22,
    marginBottom: 8,
  },
  spacer: {
    height: 180,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonPDF: {
    backgroundColor: '#27ae60',
  },
  buttonNuevo: {
    backgroundColor: '#3498db',
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;