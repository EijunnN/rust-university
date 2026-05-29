import type { Module } from '../types'

const module: Module = {
  "id": "m12",
  "slug": "m12_next_steps",
  "order": 12,
  "version": 1,
  "icon": "🧭",
  "title": "Ruta de práctica",
  "description": "Cómo convertir todo lo aprendido en proyectos pequeños, medibles y cada vez más reales.",
  "lessons": [
    {
      "id": "m12_l01",
      "moduleId": "m12",
      "moduleSlug": "m12_next_steps",
      "order": 1,
      "title": "Proyectos para consolidar Rust",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Proyectos: convertir teoría en memoria muscular",
          "problem": "Puedes entender una idea leyendo, pero sólo descubres tus huecos cuando intentas construir algo que funcione.",
          "mentalModel": "Un proyecto pequeño es un laboratorio: una pregunta clara, límites claros y feedback rápido.",
          "concreteExample": "Un contador de palabras practica strings, HashMap, iteradores, errores de archivo y tests sin convertirse en una app enorme.",
          "remember": "El mejor proyecto de aprendizaje es lo bastante pequeño para terminarlo y lo bastante real para equivocarte."
        },
        {
          "type": "text",
          "body": "## El problema: leer no basta\r\n\r\nAprender Rust requiere construir. Pero el proyecto debe tener el tamaño correcto: demasiado simple no enseña, demasiado grande abruma.\r\n\r\nLa ruta sana es hacer proyectos pequeños que obliguen a usar una idea concreta."
        },
        {
          "type": "text",
          "body": "## Proyectos recomendados\r\n\r\n1. **Conversor de unidades**: funciones, tipos, tests.\r\n2. **Agenda CLI**: structs, Vec, Result, archivos.\r\n3. **Contador de palabras**: HashMap, iteradores, strings.\r\n4. **Lector de JSON**: Serde, errores, modelos de datos.\r\n5. **Mini servidor HTTP**: requests, threads, I/O.\r\n6. **Descargador async**: async, await, muchas operaciones de red.\r\n\r\nCada proyecto debe tener una pregunta central: “¿qué concepto quiero practicar aquí?”"
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "Un proyecto pequeño terminado enseña más que un proyecto enorme abandonado."
        },
        {
          "type": "quiz",
          "question": "¿Qué hace que un proyecto sea bueno para aprender?",
          "options": [
            {
              "text": "Tiene un objetivo claro y obliga a practicar un concepto",
              "correct": true
            },
            {
              "text": "Es tan grande que no sabes por dónde empezar",
              "correct": false
            },
            {
              "text": "Evita todos los errores",
              "correct": false
            }
          ]
        }
      ]
    },
    {
      "id": "m12_l02",
      "moduleId": "m12",
      "moduleSlug": "m12_next_steps",
      "order": 2,
      "title": "Cómo seguir aprendiendo sin perderte",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Aprender en capas evita perderse",
          "problem": "Rust tiene muchos temas conectados. Saltar directo a async o unsafe sin bases convierte cada error en niebla.",
          "mentalModel": "Piensa en capas: máquina, sintaxis, ownership, modelado, abstracciones, programas reales y escala.",
          "concreteExample": "Si async confunde, tal vez falta entender threads, I/O y qué significa bloquear un recurso.",
          "remember": "Cuando algo avanzado no entra, vuelve a la capa anterior: casi siempre falta una pieza más básica."
        },
        {
          "type": "text",
          "body": "## El problema: Rust tiene muchas puertas\r\n\r\nDespués de ownership aparecen traits, lifetimes, async, macros, unsafe, crates, arquitectura, performance. Es fácil saltar entre temas y sentir que no avanzas.\r\n\r\nLa solución es aprender en capas."
        },
        {
          "type": "text",
          "body": "## Capas de aprendizaje\r\n\r\n1. **Modelo de máquina**: memoria, CPU, procesos, I/O.\r\n2. **Sintaxis básica**: variables, tipos, funciones, control flow.\r\n3. **Ownership**: move, borrow, slices, lifetimes.\r\n4. **Modelado**: structs, enums, Option, Result.\r\n5. **Reutilización**: traits, generics, módulos.\r\n6. **Programas reales**: archivos, CLI, Serde, tests.\r\n7. **Escala**: concurrencia, async, performance, arquitectura.\r\n\r\nSi un tema avanzado te confunde, vuelve una capa atrás. Casi siempre falta una pieza anterior."
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "No estás aprendiendo sólo Rust. Estás aprendiendo a pensar como alguien que entiende qué hace la máquina, qué promete el tipo y qué costo tiene cada decisión."
        },
        {
          "type": "quiz",
          "question": "Si async te confunde mucho, ¿qué conviene revisar primero?",
          "options": [
            {
              "text": "I/O, threads, qué significa esperar y qué recurso se bloquea",
              "correct": true
            },
            {
              "text": "Cambiar de editor",
              "correct": false
            },
            {
              "text": "Memorizar ejemplos sin entenderlos",
              "correct": false
            }
          ]
        }
      ]
    }
  ]
}

export default module
