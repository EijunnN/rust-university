import type { Module } from '../types'

const module: Module = {
  "id": "m07",
  "slug": "m07_real_projects",
  "order": 7,
  "version": 1,
  "icon": "🛠️",
  "title": "Proyectos Rust reales",
  "description": "Cargo, crates, dependencias, módulos, archivos y privacidad: cómo deja de ser un ejemplo suelto y se vuelve un proyecto mantenible.",
  "lessons": [
    {
      "id": "m07_l01",
      "moduleId": "m07",
      "moduleSlug": "m07_real_projects",
      "order": 1,
      "title": "Cargo, crates y dependencias",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Cargo: repetir el trabajo del proyecto sin depender de memoria humana",
          "problem": "Un proyecto real requiere compilar, probar, descargar dependencias y mantener versiones de forma repetible.",
          "mentalModel": "Cargo es el jefe de obra: no reemplaza a los trabajadores, pero coordina qué se construye, con qué materiales y en qué orden.",
          "concreteExample": "`cargo run` no es sólo ejecutar. Puede resolver dependencias, compilar crates y luego lanzar el binario resultante.",
          "remember": "Cargo convierte “mi código en una carpeta” en un proyecto reproducible."
        },
        {
          "type": "text",
          "body": "## El problema: un programa real no es un solo archivo\r\n\r\nAl inicio puedes escribir todo en `main.rs`. Pero un proyecto real necesita compilar, correr tests, descargar librerías, fijar versiones y repetir comandos sin equivocarte.\r\n\r\n**Cargo** existe para hacer ese trabajo repetible. No es sólo un ejecutor: es el organizador del proyecto."
        },
        {
          "type": "code",
          "language": "toml",
          "code": "[package]\r\nname = \"mi_app\"\r\nversion = \"0.1.0\"\r\nedition = \"2021\"\r\n\r\n[dependencies]\r\nserde = \"1\"",
          "runnable": false
        },
        {
          "type": "text",
          "body": "## Qué es un crate\r\n\r\nUn **crate** es una unidad de compilación en Rust. Puede ser:\r\n\r\n- Un binario: algo que ejecutas.\r\n- Una librería: código que otros pueden usar.\r\n\r\nCuando agregas una dependencia, Cargo descarga otro crate y lo compila con tu proyecto. Por eso `Cargo.toml` es una declaración de qué necesita tu programa para construirse."
        },
        {
          "type": "callout",
          "variant": "warning",
          "body": "No agregues dependencias como solución automática. Cada crate trae código, versiones, superficie de seguridad y decisiones de diseño."
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la función principal de Cargo en un proyecto Rust?",
          "options": [
            {
              "text": "Organizar compilación, dependencias, tests y comandos del proyecto",
              "correct": true
            },
            {
              "text": "Reemplazar al compilador de Rust",
              "correct": false
            },
            {
              "text": "Convertir Rust en JavaScript",
              "correct": false
            }
          ]
        }
      ]
    },
    {
      "id": "m07_l02",
      "moduleId": "m07",
      "moduleSlug": "m07_real_projects",
      "order": 2,
      "title": "Módulos, use, pub y organización",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Módulos: poner paredes sanas dentro del programa",
          "problem": "Cuando todo puede tocar todo, cualquier cambio pequeño puede romper zonas lejanas del código.",
          "mentalModel": "Un módulo es una habitación con puerta. `pub` decide qué sale por la puerta; lo demás queda como detalle interno.",
          "concreteExample": "Puedes exponer `Usuario::nuevo` y mantener privado cómo validas el email. Otros módulos usan la intención, no el mecanismo.",
          "remember": "Organizar código es controlar dependencias, no sólo ordenar archivos."
        },
        {
          "type": "text",
          "body": "## El problema: el código crece\r\n\r\nCuando un programa crece, el problema ya no es sólo “hacer que funcione”. El problema es encontrar cada cosa, evitar nombres mezclados y mostrar sólo lo que otras partes deben usar.\r\n\r\nRust usa **módulos** para dividir el código en espacios con nombre."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "mod pedidos;\r\nmod usuarios;\r\n\r\nuse usuarios::Usuario;\r\n\r\nfn main() {\r\n    let usuario = Usuario::nuevo(\"Ana\");\r\n    println!(\"{}\", usuario.nombre());\r\n}",
          "runnable": false
        },
        {
          "type": "text",
          "body": "## `pub` no es decoración\r\n\r\nPor defecto, Rust es privado. Eso significa: una parte del programa no puede usar detalles internos de otra parte a menos que tú lo permitas con `pub`.\r\n\r\nEsto es diseño. Si todo fuera público, cualquier archivo podría depender de detalles internos y cambiar algo pequeño rompería muchas partes."
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "Buen diseño: haz público lo que representa una intención estable, deja privado lo que es detalle de implementación."
        },
        {
          "type": "quiz",
          "question": "¿Por qué Rust hace privado el código por defecto?",
          "options": [
            {
              "text": "Para proteger límites y evitar dependencias accidentales",
              "correct": true
            },
            {
              "text": "Para que escribir código sea más largo",
              "correct": false
            },
            {
              "text": "Porque los módulos no pueden compartir nada",
              "correct": false
            }
          ]
        }
      ]
    }
  ]
}

export default module
