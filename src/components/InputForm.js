// src/components/InputForm.js

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * Componente de formulario para capturar datos de entrada
 * @param {object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.value - Valor actual del campo
 * @param {function} props.onChangeText - Función para actualizar el valor
 * @param {string} props.placeholder - Texto placeholder
 * @param {string} props.description - Descripción del campo
 */
const InputForm = ({ label, value, onChangeText, placeholder, description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType="numeric"
        returnKeyType="done"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default InputForm;