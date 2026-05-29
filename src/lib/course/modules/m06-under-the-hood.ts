import type { Module } from '../types'

const module: Module = {
  "id": "m06",
  "slug": "m06_under_the_hood",
  "order": 6,
  "version": 1,
  "icon": "🧠",
  "title": "Cómo funciona un programa por debajo",
  "description": "CPU, memoria, procesos, compilación, stack y heap explicados desde cero para entender por qué Rust toma sus decisiones.",
  "lessons": [
    {
      "id": "m06_l01",
      "moduleId": "m06",
      "moduleSlug": "m06_under_the_hood",
      "order": 1,
      "title": "CPU, RAM y procesos",
      "blocks": [
        {
          "type": "first-principles",
          "title": "CPU, RAM y procesos: el suelo donde pisa tu código",
          "problem": "Antes de hablar de lenguajes, hay que entender que cada programa compite por recursos físicos: tiempo de CPU, memoria, disco y red.",
          "mentalModel": "Un proceso es como un taller alquilado dentro del sistema operativo. Tiene herramientas, espacio de trabajo y turnos para usar la CPU.",
          "concreteExample": "Una request web no “entra a la app” de forma abstracta: llegan bytes, el sistema operativo los entrega, el servidor los interpreta y tu código decide qué respuesta construir.",
          "remember": "Cuando algo escala mal, pregunta primero qué trabajo hace cada unidad y qué recurso se está agotando."
        },
        {
          "type": "text",
          "body": "## Antes de Rust: qué hace una computadora\r\n\r\nUna computadora no entiende “usuarios”, “botones” o “apps”. Entiende instrucciones simples: mover datos, sumar, comparar, saltar a otra instrucción, leer memoria y escribir memoria.\r\n\r\nLa **CPU** ejecuta instrucciones. La **RAM** guarda datos temporales. El **disco** guarda datos duraderos. El **sistema operativo** reparte recursos entre programas para que cada uno crea que tiene su propio espacio."
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "Primer principio: un programa lento casi siempre está haciendo demasiado trabajo, moviendo demasiados datos, esperando demasiado I/O, o compitiendo con demasiadas tareas al mismo tiempo."
        },
        {
          "type": "text",
          "body": "## Qué es un proceso\r\n\r\nCuando ejecutas un programa, el sistema operativo crea un **proceso**. Un proceso es una instancia viva del programa: tiene memoria propia, permisos, archivos abiertos y tiempo de CPU asignado.\r\n\r\nSi abres dos veces la misma app, normalmente tienes dos procesos o varias partes coordinadas. El archivo del programa puede ser el mismo, pero cada ejecución necesita su propio estado."
        },
        {
          "type": "text",
          "body": "## Ejemplo: una request web\r\n\r\nImagina que llega una request a un servidor:\r\n\r\n1. La tarjeta de red recibe bytes.\r\n2. El sistema operativo entrega esos bytes al proceso del servidor.\r\n3. El servidor parsea HTTP: método, ruta, headers, body.\r\n4. Tu código decide qué hacer.\r\n5. Tal vez consulta una base de datos o lee un archivo.\r\n6. Construye una respuesta.\r\n7. El sistema operativo envía bytes de vuelta.\r\n\r\nSi llegan miles al mismo tiempo, no aparece magia. Hay miles de trabajos compitiendo por CPU, RAM, red y base de datos."
        },
        {
          "type": "quiz",
          "question": "Si un servidor se vuelve lento al recibir muchas requests, ¿qué pregunta viene primero?",
          "options": [
            {
              "text": "Cuánto trabajo hace cada request y qué recurso se satura",
              "correct": true
            },
            {
              "text": "Cuántos colores tiene la interfaz",
              "correct": false
            },
            {
              "text": "Cómo agregar servidores sin medir nada",
              "correct": false
            }
          ]
        }
      ]
    },
    {
      "id": "m06_l02",
      "moduleId": "m06",
      "moduleSlug": "m06_under_the_hood",
      "order": 2,
      "title": "Compilación, binarios, stack y heap",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Compilar es traducir intención a instrucciones reales",
          "problem": "El código fuente es texto para humanos, pero la máquina necesita instrucciones concretas y memoria organizada.",
          "mentalModel": "Compilar es pasar de un plano arquitectónico a una casa construida. El binario ya contiene decisiones concretas que la máquina puede ejecutar.",
          "concreteExample": "Un número pequeño puede vivir en el stack. Un texto que crece necesita heap. Esa diferencia explica por qué Rust se preocupa tanto por ownership.",
          "remember": "Stack y heap no son detalles académicos: son parte de por qué Rust existe."
        },
        {
          "type": "text",
          "body": "## De texto a programa real\r\n\r\nTu archivo `.rs` es texto. La CPU no ejecuta texto. Rust necesita convertir ese texto en un **binario**, un archivo con instrucciones de máquina que tu sistema operativo puede cargar y ejecutar.\r\n\r\nEse proceso se llama **compilación**. Por eso Rust puede encontrar tantos errores antes de correr: mira el programa completo, revisa tipos, ownership, lifetimes y luego genera código máquina."
        },
        {
          "type": "text",
          "body": "## Stack y heap\r\n\r\nLa memoria no es una bolsa desordenada. Para entender Rust necesitas dos ideas:\r\n\r\n- **Stack**: rápido, ordenado, ideal para datos de tamaño conocido. Funciona como una pila de platos: lo último que entra suele ser lo primero que sale.\r\n- **Heap**: más flexible, permite datos que crecen o cuyo tamaño no sabemos de antemano. Usarlo implica reservar y liberar memoria.\r\n\r\nUn `i32` suele vivir cómodamente en el stack. Un `String` guarda metadatos en el stack, pero su texto puede vivir en el heap porque puede crecer."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let edad: i32 = 30;                 // dato pequeno, tamaño fijo\r\n    let nombre = String::from(\"Ana\");   // texto que puede crecer\r\n\r\n    println!(\"{} tiene {}\", nombre, edad);\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "Cuando Rust habla de ownership, move y drop, está protegiendo especialmente los datos que reservan recursos como memoria en el heap."
        },
        {
          "type": "quiz",
          "question": "¿Por qué un `String` necesita reglas de ownership más estrictas que un número pequeño?",
          "options": [
            {
              "text": "Porque puede poseer memoria dinámica que debe liberarse exactamente una vez",
              "correct": true
            },
            {
              "text": "Porque Rust odia los textos",
              "correct": false
            },
            {
              "text": "Porque los números no usan memoria",
              "correct": false
            }
          ]
        }
      ]
    }
  ]
}

export default module
