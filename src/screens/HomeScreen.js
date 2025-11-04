// src/screens/HomeScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import InputForm from '../components/InputForm';
import { validarEntradas, calcularMM1, calcularMMS } from '../utils/calculations';

const HomeScreen = ({ navigation }) => {
  const [modelo, setModelo] = useState('MM1');
  const [lambda, setLambda] = useState('');
  const [mu, setMu] = useState('');
  const [s, setS] = useState('');

  const handleCalcular = () => {
    // Convertir valores a números
    const lambdaNum = parseFloat(lambda);
    const muNum = parseFloat(mu);
    const sNum = modelo === 'MMS' ? parseInt(s) : null;

    // Validar entradas
    const validacion = validarEntradas(lambdaNum, muNum, sNum, modelo);
    
    if (!validacion.valido) {
      Alert.alert('Error de validación', validacion.mensaje);
      return;
    }

    // Calcular según el modelo seleccionado
    let resultados;
    let modeloNombre;

    if (modelo === 'MM1') {
      resultados = calcularMM1(lambdaNum, muNum);
      modeloNombre = 'M/M/1';
    } else {
      resultados = calcularMMS(lambdaNum, muNum, sNum);
      modeloNombre = 'M/M/S';
    }

    // Navegar a pantalla de resultados
    navigation.navigate('Results', {
      modelo: modeloNombre,
      datos: {
        lambda: lambdaNum,
        mu: muNum,
        s: sNum,
      },
      resultados: resultados,
    });
  };

  const limpiarCampos = () => {
    setLambda('');
    setMu('');
    setS('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Teoría de Colas</Text>
        <Text style={styles.subtitle}>Análisis de Sistemas de Espera</Text>

        {/* Selector de Modelo */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Seleccione el modelo:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={modelo}
              onValueChange={(itemValue) => {
                setModelo(itemValue);
                limpiarCampos();
              }}
              style={styles.picker}
            >
              <Picker.Item label="M/M/1 - Un servidor" value="MM1" />
              <Picker.Item label="M/M/S - Múltiples servidores" value="MMS" />
            </Picker>
          </View>
        </View>

        {/* Descripción del modelo */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {modelo === 'MM1'
              ? 'Modelo con un único servidor. Las llegadas siguen una distribución de Poisson y los tiempos de servicio una distribución exponencial.'
              : 'Modelo con múltiples servidores en paralelo. Las llegadas siguen una distribución de Poisson y los tiempos de servicio una distribución exponencial.'}
          </Text>
        </View>

        {/* Formulario de entrada */}
        <View style={styles.formContainer}>
          <InputForm
            label="λ (Lambda) - Tasa de llegada"
            value={lambda}
            onChangeText={setLambda}
            placeholder="Ej: 5"
            description="Número promedio de clientes que llegan por unidad de tiempo"
          />

          <InputForm
            label="μ (Mu) - Tasa de servicio"
            value={mu}
            onChangeText={setMu}
            placeholder="Ej: 8"
            description="Número promedio de clientes atendidos por unidad de tiempo"
          />

          {modelo === 'MMS' && (
            <InputForm
              label="S - Número de servidores"
              value={s}
              onChangeText={setS}
              placeholder="Ej: 2"
              description="Cantidad de servidores disponibles en paralelo"
            />
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleCalcular}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonPrimaryText}>Calcular Métricas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={limpiarCampos}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonSecondaryText}>Limpiar Campos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 25,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  buttonSecondaryText: {
    color: '#34495e',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;