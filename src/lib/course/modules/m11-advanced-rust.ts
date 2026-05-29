import type { Module } from '../types'

const module: Module = {
  "id": "m11",
  "slug": "m11_advanced_rust",
  "order": 11,
  "version": 1,
  "icon": "⚙️",
  "title": "Rust avanzado con criterio",
  "description": "Smart pointers, concurrencia, async, performance y unsafe desde el problema que intentan resolver.",
  "lessons": [
    {
      "id": "m11_l01",
      "moduleId": "m11",
      "moduleSlug": "m11_advanced_rust",
      "order": 1,
      "title": "Smart pointers, concurrencia y async",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Avanzado no significa mágico: significa que el problema cambió",
          "problem": "Un solo owner no basta para todos los diseños: a veces compartes datos, proteges estado entre threads o esperas muchas operaciones.",
          "mentalModel": "Smart pointers, threads y async son herramientas para formas específicas de propiedad, compartición y espera.",
          "concreteExample": "`Arc<Mutex<T>>` aparece cuando varios threads necesitan compartir y modificar un valor sin pisarse.",
          "remember": "No uses herramientas avanzadas por estatus; úsalas porque el problema las exige."
        },
        {
          "type": "text",
          "body": "## El problema: ownership simple no cubre todos los casos\r\n\r\nOwnership con un solo dueño es ideal para muchos programas. Pero a veces necesitas:\r\n\r\n- poner un valor grande en el heap con `Box`;\r\n- compartir lectura entre varias partes con `Rc` o `Arc`;\r\n- proteger datos compartidos entre threads con `Mutex`;\r\n- hacer muchas tareas que esperan I/O sin bloquear un thread completo con `async`.\r\n\r\nEstas herramientas existen porque el mundo real tiene formas de compartir y esperar."
        },
        {
          "type": "text",
          "body": "## Concurrencia vs async\r\n\r\n**Concurrencia** significa lidiar con varias tareas en progreso. No siempre significa que todas corren exactamente al mismo tiempo.\r\n\r\n**Threads** sirven cuando quieres ejecutar trabajo en paralelo o aprovechar varios núcleos.\r\n\r\n**Async** sirve muy bien cuando muchas tareas pasan tiempo esperando: red, disco, base de datos. En vez de bloquear un thread esperando, el runtime puede avanzar otra tarea."
        },
        {
          "type": "callout",
          "variant": "warning",
          "body": "No uses `Arc<Mutex<T>>` o `async` porque suenan avanzados. Úsalos cuando el problema real sea compartir estado o esperar muchas operaciones."
        },
        {
          "type": "quiz",
          "question": "¿Cuándo suele brillar async?",
          "options": [
            {
              "text": "Cuando hay muchas tareas esperando I/O",
              "correct": true
            },
            {
              "text": "Cuando quieres sumar dos números",
              "correct": false
            },
            {
              "text": "Cuando quieres evitar entender errores",
              "correct": false
            }
          ]
        }
      ]
    },
    {
      "id": "m11_l02",
      "moduleId": "m11",
      "moduleSlug": "m11_advanced_rust",
      "order": 2,
      "title": "Performance, arquitectura y unsafe",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Performance y unsafe: poder con responsabilidad",
          "problem": "Optimizar sin medir puede empeorar el diseño. Usar `unsafe` sin encapsular puede romper garantías centrales.",
          "mentalModel": "Performance es investigación: encuentras el cuello de botella. `unsafe` es levantar una barrera de seguridad bajo tu responsabilidad.",
          "concreteExample": "Si el problema es esperar una base de datos, cambiar strings por referencias no resolverá el cuello de botella principal.",
          "remember": "Primero entiende y mide; después optimiza o baja de nivel sólo donde tiene sentido."
        },
        {
          "type": "text",
          "body": "## Performance: medir antes de adivinar\r\n\r\nUn programa puede ser lento por muchas razones:\r\n\r\n- demasiadas asignaciones en heap;\r\n- copiar datos grandes;\r\n- bloquear esperando red o disco;\r\n- algoritmos que hacen trabajo repetido;\r\n- locks que obligan a muchas tareas a esperar;\r\n- serializar o parsear datos demasiado seguido.\r\n\r\nLa primera pregunta no es “¿qué optimizo?”, sino “¿dónde se va el tiempo?”."
        },
        {
          "type": "text",
          "body": "## Arquitectura: separar decisiones\r\n\r\nUna arquitectura sana separa:\r\n\r\n- reglas del dominio;\r\n- entrada/salida;\r\n- manejo de errores;\r\n- almacenamiento;\r\n- presentación.\r\n\r\nEsto permite probar la lógica sin depender de archivos, red o UI. Rust ayuda porque los tipos hacen visibles los contratos."
        },
        {
          "type": "text",
          "body": "## Unsafe\r\n\r\n`unsafe` no significa “código malo”. Significa: “el compilador ya no puede verificar ciertas garantías; tú eres responsable”.\r\n\r\nSe usa para casos especiales: interoperar con C, trabajar con memoria muy manual, crear abstracciones de bajo nivel. La regla sana es: encapsular `unsafe` detrás de una API segura y pequeña."
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la primera pregunta sensata ante un problema de performance?",
          "options": [
            {
              "text": "Dónde se va el tiempo y qué recurso se satura",
              "correct": true
            },
            {
              "text": "Cómo usar unsafe en todas partes",
              "correct": false
            },
            {
              "text": "Cómo cambiar todo sin medir",
              "correct": false
            }
          ]
        }
      ]
    }
  ]
}

export default module
