import type { Module } from '../types'

const module: Module = {
  "id": "m10",
  "slug": "m10_real_world_io",
  "order": 10,
  "version": 1,
  "icon": "🌐",
  "title": "I/O, CLI y datos",
  "description": "Cómo los programas hablan con archivos, terminal, argumentos y formatos como JSON usando Serde.",
  "lessons": [
    {
      "id": "m10_l01",
      "moduleId": "m10",
      "moduleSlug": "m10_real_world_io",
      "order": 1,
      "title": "I/O y programas de terminal",
      "blocks": [
        {
          "type": "first-principles",
          "title": "I/O: hablar con el mundo tiene costo y puede fallar",
          "problem": "Un programa útil rara vez vive aislado. Necesita leer entrada, escribir salida y pedir servicios al sistema operativo.",
          "mentalModel": "I/O es una conversación con el exterior. A diferencia de sumar dos números, puede tardar, bloquearse o fallar.",
          "concreteExample": "Leer argumentos de terminal es recibir instrucciones del usuario antes de que tu programa decida qué camino tomar.",
          "remember": "Cada operación fuera de tu proceso debe tratarse como algo que puede tardar o fallar."
        },
        {
          "type": "text",
          "body": "## El problema: un programa necesita hablar con el mundo\r\n\r\nHasta ahora muchos ejemplos viven dentro del programa. Pero un programa real lee archivos, recibe argumentos, imprime resultados y falla cuando el sistema operativo no puede darle algo.\r\n\r\nEso se llama **I/O**: input/output, entrada y salida."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::env;\r\n\r\nfn main() {\r\n    let argumentos: Vec<String> = env::args().collect();\r\n    println!(\"Argumentos: {:?}\", argumentos);\r\n}",
          "runnable": false
        },
        {
          "type": "text",
          "body": "## CLI: una interfaz simple y poderosa\r\n\r\nUna app de terminal recibe texto y devuelve texto. Parece básica, pero es una forma excelente de aprender porque ves claramente:\r\n\r\n- qué entra;\r\n- qué transformación haces;\r\n- qué sale;\r\n- qué errores pueden aparecer.\r\n\r\nMuchas herramientas profesionales son CLI porque se pueden automatizar, combinar y ejecutar en servidores."
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "Cuando hagas una CLI, piensa primero en contrato: argumentos de entrada, salida esperada y errores posibles."
        }
      ]
    },
    {
      "id": "m10_l02",
      "moduleId": "m10",
      "moduleSlug": "m10_real_world_io",
      "order": 2,
      "title": "Serde, JSON y datos externos",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Serde: traducir entre el mundo textual y tus tipos",
          "problem": "Los sistemas intercambian texto, pero tu programa necesita estructuras confiables para trabajar bien.",
          "mentalModel": "Serde es un traductor con contrato: convierte JSON, TOML u otros formatos en structs y enums de Rust.",
          "concreteExample": "Si una API devuelve un usuario sin `edad`, deserializar a `Usuario { nombre, edad }` puede fallar de forma explícita.",
          "remember": "Los datos externos siempre deben cruzar una frontera de validación."
        },
        {
          "type": "text",
          "body": "## El problema: los datos llegan con forma de texto\r\n\r\nAPIs, archivos de configuración y mensajes entre sistemas suelen viajar como JSON, TOML o YAML. Tu programa necesita convertir ese texto en tipos de Rust y luego volver a convertir tipos en texto.\r\n\r\nEse proceso se llama **serialización** y **deserialización**."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use serde::{Deserialize, Serialize};\r\n\r\n#[derive(Serialize, Deserialize, Debug)]\r\nstruct Usuario {\r\n    nombre: String,\r\n    edad: u8,\r\n}\r\n\r\n// JSON: {\"nombre\":\"Ana\",\"edad\":30}\r\n// Rust: Usuario { nombre: \"Ana\", edad: 30 }",
          "runnable": false
        },
        {
          "type": "text",
          "body": "## Por qué esto importa\r\n\r\nSin tipos, un JSON es sólo texto. Con Serde, puedes decir: “espero un `Usuario` con `nombre` y `edad`”. Si falta algo o llega con el tipo incorrecto, obtienes un error.\r\n\r\nEsto conecta muy bien con `Result`: leer datos externos casi siempre puede fallar."
        },
        {
          "type": "quiz",
          "question": "¿Qué problema resuelve Serde?",
          "options": [
            {
              "text": "Convertir entre formatos externos y tipos de Rust",
              "correct": true
            },
            {
              "text": "Crear threads automáticamente",
              "correct": false
            },
            {
              "text": "Evitar que los programas tengan errores",
              "correct": false
            }
          ]
        }
      ]
    }
  ]
}

export default module
