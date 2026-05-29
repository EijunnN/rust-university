import type { Module } from '../types'

const module: Module = {
  "id": "m09",
  "slug": "m09_errors_testing",
  "order": 9,
  "version": 1,
  "icon": "🧪",
  "title": "Errores y calidad",
  "description": "Manejo de errores con `?`, diseño de fallos y tests para ganar confianza antes de cambiar código.",
  "lessons": [
    {
      "id": "m09_l01",
      "moduleId": "m09",
      "moduleSlug": "m09_errors_testing",
      "order": 1,
      "title": "Errores profundos: Result y ?",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Errores: diseñar el camino cuando el mundo no coopera",
          "problem": "Archivos faltan, redes caen, usuarios escriben mal y permisos fallan. Fingir éxito constante produce programas frágiles.",
          "mentalModel": "`Result` es un cruce con dos caminos explícitos: valor o error. `?` toma el camino feliz o devuelve el error hacia arriba.",
          "concreteExample": "Leer una configuración puede fallar porque el archivo no existe. Rust te obliga a decidir si lo manejas ahí o lo propagas.",
          "remember": "Manejar errores bien es modelar la realidad, no llenar el código de pesimismo."
        },
        {
          "type": "text",
          "body": "## El problema: fallar también es parte del programa\r\n\r\nLeer un archivo puede fallar. Conectarse a internet puede fallar. Parsear JSON puede fallar. Si ignoras eso, tu programa vive en una fantasía.\r\n\r\nRust usa `Result<T, E>` para decir: “esto puede dar un valor `T` o un error `E`”."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::fs;\r\n\r\nfn leer_config() -> Result<String, std::io::Error> {\r\n    let texto = fs::read_to_string(\"config.toml\")?;\r\n    Ok(texto)\r\n}",
          "runnable": false
        },
        {
          "type": "text",
          "body": "## Qué hace `?`\r\n\r\nEl operador `?` significa:\r\n\r\n- Si salió bien, dame el valor y sigue.\r\n- Si salió mal, devuelve el error desde esta función.\r\n\r\nNo es magia. Es una forma corta de propagar errores sin escribir el mismo `match` una y otra vez."
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "Diseñar errores es decidir dónde puedes recuperarte y dónde debes informar el problema a una capa superior."
        },
        {
          "type": "quiz",
          "question": "¿Qué representa `Result<T, E>`?",
          "options": [
            {
              "text": "Una operación que puede producir un valor o un error",
              "correct": true
            },
            {
              "text": "Una lista mutable",
              "correct": false
            },
            {
              "text": "Una forma de evitar tipos",
              "correct": false
            }
          ]
        }
      ]
    },
    {
      "id": "m09_l02",
      "moduleId": "m09",
      "moduleSlug": "m09_errors_testing",
      "order": 2,
      "title": "Testing: probar ideas, no sólo líneas",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Tests: guardar conocimiento sobre el comportamiento esperado",
          "problem": "Tu memoria no alcanza para verificar manualmente todo cada vez que cambias el programa.",
          "mentalModel": "Un test es una alarma: si una regla importante deja de cumplirse, te avisa temprano.",
          "concreteExample": "Si una función calcula impuestos, un test con casos normales y casos borde protege esa regla cuando refactorizas.",
          "remember": "Los tests no demuestran perfección; aumentan confianza sobre comportamientos importantes."
        },
        {
          "type": "text",
          "body": "## El problema: el código cambia\r\n\r\nUn programa que funciona hoy puede romperse mañana cuando agregas una regla nueva. Los tests son una red de seguridad: describen comportamientos que quieres conservar.\r\n\r\nUn buen test no dice “ejecuté una línea”. Dice: “si entra esto, debe salir aquello”."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn sumar(a: i32, b: i32) -> i32 {\r\n    a + b\r\n}\r\n\r\n#[test]\r\nfn suma_dos_numeros() {\r\n    assert_eq!(sumar(2, 3), 5);\r\n}",
          "runnable": false
        },
        {
          "type": "text",
          "body": "## Casos borde\r\n\r\nLos errores aparecen en bordes:\r\n\r\n- lista vacía;\r\n- número cero;\r\n- texto con acentos;\r\n- archivo que no existe;\r\n- usuario sin permisos;\r\n- datos enormes.\r\n\r\nPensar tests es preguntar: “¿qué pasaría si el mundo no es tan ordenado como mi ejemplo feliz?”"
        },
        {
          "type": "quiz",
          "question": "¿Qué debería proteger un buen test?",
          "options": [
            {
              "text": "Un comportamiento importante del programa",
              "correct": true
            },
            {
              "text": "El color exacto del editor",
              "correct": false
            },
            {
              "text": "Que nunca cambies el código",
              "correct": false
            }
          ]
        }
      ]
    }
  ]
}

export default module
