import type { Module } from '../types'

const module: Module = {
  "id": "m08",
  "slug": "m08_traits_generics",
  "order": 8,
  "version": 1,
  "icon": "🧩",
  "title": "Traits y Generics",
  "description": "Cómo Rust expresa comportamiento compartido y código reutilizable sin perder tipos ni rendimiento.",
  "lessons": [
    {
      "id": "m08_l01",
      "moduleId": "m08",
      "moduleSlug": "m08_traits_generics",
      "order": 1,
      "title": "Traits: comportamiento con nombre",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Traits: nombrar capacidades en vez de forzar parentescos",
          "problem": "Tipos diferentes pueden compartir una habilidad sin ser la misma cosa ni pertenecer a una jerarquía rígida.",
          "mentalModel": "Un trait es una promesa: “si implemento esto, sé hacer estas operaciones”.",
          "concreteExample": "Un `String`, un archivo y un buffer pueden permitir escribir datos aunque internamente funcionen distinto.",
          "remember": "Traits son la base de gran parte del diseño idiomático en Rust."
        },
        {
          "type": "text",
          "body": "## El problema: tipos distintos, misma capacidad\r\n\r\nUn archivo, una conexión de red y un buffer en memoria son cosas distintas. Pero quizá todas pueden “escribir bytes”. Queremos expresar esa capacidad sin decir que todas son el mismo tipo.\r\n\r\nUn **trait** nombra un comportamiento. Dice: “cualquier tipo que prometa estos métodos puede participar”."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "trait Describible {\r\n    fn describir(&self) -> String;\r\n}\r\n\r\nstruct Usuario {\r\n    nombre: String,\r\n}\r\n\r\nimpl Describible for Usuario {\r\n    fn describir(&self) -> String {\r\n        format!(\"Usuario: {}\", self.nombre)\r\n    }\r\n}\r\n\r\nfn imprimir(item: &impl Describible) {\r\n    println!(\"{}\", item.describir());\r\n}\r\n\r\nfn main() {\r\n    let ana = Usuario { nombre: String::from(\"Ana\") };\r\n    imprimir(&ana);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Traits comunes\r\n\r\nYa has visto traits aunque no los hayas nombrado:\r\n\r\n- `Debug`: permite imprimir con `{:?}`.\r\n- `Clone`: permite crear copias explícitas.\r\n- `Iterator`: permite producir valores uno por uno.\r\n- `Display`: permite mostrar algo con `{}`.\r\n\r\nRust construye muchas abstracciones sobre traits, no sobre herencia clásica."
        },
        {
          "type": "quiz",
          "question": "¿Qué expresa mejor un trait?",
          "options": [
            {
              "text": "Un comportamiento que varios tipos pueden implementar",
              "correct": true
            },
            {
              "text": "Una variable mutable",
              "correct": false
            },
            {
              "text": "Un archivo TOML",
              "correct": false
            }
          ]
        }
      ]
    },
    {
      "id": "m08_l02",
      "moduleId": "m08",
      "moduleSlug": "m08_traits_generics",
      "order": 2,
      "title": "Generics: código flexible y tipado",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Generics: una idea, muchos tipos, seguridad intacta",
          "problem": "Repetir la misma función para cada tipo produce código duplicado y más superficie para errores.",
          "mentalModel": "Un generic es una plantilla tipada: deja un espacio para el tipo, pero conserva reglas claras sobre lo que se puede hacer.",
          "concreteExample": "`primero<T>(&[T])` funciona con listas de números, textos o usuarios porque sólo necesita mirar el primer elemento, no conocer su contenido.",
          "remember": "Generics dan reutilización sin abandonar el chequeo del compilador."
        },
        {
          "type": "text",
          "body": "## El problema: no repetir la misma idea para cada tipo\r\n\r\nSi sabes obtener el primer elemento de una lista, esa idea sirve para números, textos o usuarios. No queremos escribir una función por cada tipo.\r\n\r\nLos **generics** permiten escribir código con un tipo por definir, pero sin abandonar la seguridad de tipos."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn primero<T>(items: &[T]) -> Option<&T> {\r\n    items.first()\r\n}\r\n\r\nfn main() {\r\n    let numeros = vec![10, 20, 30];\r\n    let nombres = vec![\"Ana\", \"Luis\"];\r\n\r\n    println!(\"{:?}\", primero(&numeros));\r\n    println!(\"{:?}\", primero(&nombres));\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Generics con límites\r\n\r\nA veces no basta con decir “cualquier tipo”. Necesitas decir “cualquier tipo que se pueda mostrar”, o “cualquier tipo que se pueda comparar”.\r\n\r\nEso se hace con **trait bounds**: generics + traits."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::fmt::Display;\r\n\r\nfn mostrar<T: Display>(valor: T) {\r\n    println!(\"Valor: {}\", valor);\r\n}\r\n\r\nfn main() {\r\n    mostrar(42);\r\n    mostrar(\"hola\");\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "Rust suele convertir generics en código especializado durante compilación. Muchas veces obtienes flexibilidad sin pagar una abstracción costosa en runtime."
        }
      ]
    }
  ]
}

export default module
