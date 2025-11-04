// src/components/ResultsTable.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * Componente que muestra los resultados calculados en formato tabla
 * @param {object} props - Propiedades del componente
 * @param {object} props.resultados - Objeto con los resultados calculados
 */
const ResultsTable = ({ resultados }) => {
  const metricas = [
    {
      simbolo: 'ρ',
      nombre: 'Factor de utilización',
      descripcion: resultados.descripciones.rho,
      valor: resultados.rho,
      ecuacion: resultados.ecuaciones.rho,
    },
    {
      simbolo: 'P₀',
      nombre: 'Probabilidad sistema vacío',
      descripcion: resultados.descripciones.P0,
      valor: resultados.P0,
      ecuacion: resultados.ecuaciones.P0,
    },
    {
      simbolo: 'Lq',
      nombre: 'Clientes en cola',
      descripcion: resultados.descripciones.Lq,
      valor: resultados.Lq,
      ecuacion: resultados.ecuaciones.Lq,
    },
    {
      simbolo: 'L',
      nombre: 'Clientes en sistema',
      descripcion: resultados.descripciones.L,
      valor: resultados.L,
      ecuacion: resultados.ecuaciones.L,
    },
    {
      simbolo: 'Wq',
      nombre: 'Tiempo en cola',
      descripcion: resultados.descripciones.Wq,
      valor: resultados.Wq,
      ecuacion: resultados.ecuaciones.Wq,
    },
    {
      simbolo: 'W',
      nombre: 'Tiempo en sistema',
      descripcion: resultados.descripciones.W,
      valor: resultados.W,
      ecuacion: resultados.ecuaciones.W,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Ecuaciones Utilizadas y Resultados</Text>
      
      {metricas.map((metrica, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.simbolo}>{metrica.simbolo}</Text>
            <View style={styles.nombreContainer}>
              <Text style={styles.nombre}>{metrica.nombre}</Text>
              <Text style={styles.descripcion}>{metrica.descripcion}</Text>
            </View>
          </View>
          
          <View style={styles.ecuacionContainer}>
            <Text style={styles.ecuacionLabel}>Ecuación:</Text>
            <Text style={styles.ecuacion}>{metrica.ecuacion}</Text>
          </View>
          
          <View style={styles.resultadoContainer}>
            <Text style={styles.resultadoLabel}>Resultado:</Text>
            <Text style={styles.resultado}>{metrica.valor}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 8,
  },
  simbolo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginRight: 10,
    width: 40,
  },
  nombreContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 3,
  },
  descripcion: {
    fontSize: 13,
    color: '#7f8c8d',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  ecuacionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  ecuacionLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
    fontWeight: '600',
  },
  ecuacion: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#2c3e50',
  },
  resultadoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
  },
  resultadoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
  },
  resultado: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});

export default ResultsTable;