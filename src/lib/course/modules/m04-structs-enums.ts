import type { Module } from "../types";

const module: Module = {
	id: "m04",
	slug: "m04_structs_enums",
	order: 4,
	version: 1,
	icon: "🧱",
	title: "Structs, Enums y Pattern Matching",
	description:
		"Crea tipos de datos personalizados con structs y enums. Domina el pattern matching y descubre Option y Result.",
	lessons: [
		{
			id: "m04_l01",
			moduleId: "m04",
			moduleSlug: "m04_structs_enums",
			order: 1,
			title: "Structs: tus propios tipos",
			blocks: [
				{
					type: "first-principles",
					title: "Structs: agrupar datos que pertenecen a una misma idea",
					problem:
						"Un programa real no trabaja sólo con números sueltos. Trabaja con usuarios, pedidos, puntos, libros, vuelos. Necesitas representar cosas del mundo con varios datos relacionados.",
					mentalModel:
						"Un struct es una ficha con campos. En vez de cargar nombre, edad y email por separado, dices: todo esto junto representa un `Usuario`.",
					concreteExample:
						"Para un viaje puedes tener `Vuelo { origen, destino, hora }`. Es más claro que pasar tres strings sueltos por todo el programa y esperar no mezclarlos.",
					remember:
						"Un struct convierte datos dispersos en una idea con nombre.",
				},
				{
					type: "challenge",
					conceptId: "m04-struct-build",
					title: "Antes de leer: agrupa datos con nombre",
					prompt:
						"**Tu reto:** necesitas representar un usuario con un `nombre` (texto) y una `edad` (número). Define un struct `Usuario` con esos dos campos, y escribe `crear(nombre: String, edad: u32) -> Usuario` que construya uno.\n\nInténtalo y dale a Verificar — aunque no conozcas aún la sintaxis de `struct`.",
					starterCode:
						"struct Usuario {\n    // ¿qué campos necesita?\n}\n\nfn crear(nombre: String, edad: u32) -> Usuario {\n    // construye y devuelve un Usuario\n}",
					tests:
						'fn main() {\n    let u = crear(String::from("Ana"), 30);\n    assert_eq!(u.nombre, "Ana");\n    assert_eq!(u.edad, 30);\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Un struct agrupa varios datos bajo un nombre. Se define listando cada campo con su tipo: aquí necesitas un campo de tipo `String` y otro de tipo `u32`, separados por coma.",
						"La sintaxis es `struct Usuario { nombre: String, edad: u32 }`. Para construir una instancia: `Usuario { nombre: valor, edad: valor }`.",
						"Dentro de `crear`, la última expresión (sin `;`) es lo que se devuelve. Y como los parámetros se llaman igual que los campos, basta `Usuario { nombre, edad }` — no hace falta repetir `nombre: nombre`.",
					],
					solution:
						"struct Usuario {\n    nombre: String,\n    edad: u32,\n}\n\nfn crear(nombre: String, edad: u32) -> Usuario {\n    Usuario { nombre, edad }\n}",
					reveal:
						"Un **struct** agrupa varios datos relacionados bajo un nombre y un tipo propio:\n\n```rust\nstruct Usuario {\n    nombre: String,\n    edad: u32,\n}\n\nfn crear(nombre: String, edad: u32) -> Usuario {\n    Usuario { nombre, edad }\n}\n```\n\nEn vez de andar pasando `nombre` y `edad` sueltos por todos lados, ahora tienes un `Usuario` que los lleva juntos. Cuando los nombres de las variables coinciden con los campos, puedes escribir `Usuario { nombre, edad }` en vez de `Usuario { nombre: nombre, edad: edad }`. Eso es lo que verás ahora en detalle. 👇",
				},
				{
					type: "text",
					body: "## El Problema: datos relacionados sin estructura\r\n\r\nCuando tienes datos que pertenecen juntos (el nombre de un usuario, su email, su edad), usar variables separadas es fragil y propenso a errores:",
				},
				{
					type: "code",
					language: "rust",
					code: '// MAL: datos relacionados sueltos\r\nfn main() {\r\n    let nombre1 = "Ana";\r\n    let email1 = "ana@email.com";\r\n    let edad1 = 28;\r\n\r\n    let nombre2 = "Carlos";\r\n    let email2 = "carlos@email.com";\r\n    let edad2 = 35;\r\n\r\n    // Facil confundir: que pasa si mezclo nombre1 con edad2?\r\n    println!("{} tiene {} anos", nombre1, edad2); // Bug silencioso!\r\n}',
					runnable: false,
				},
				{
					type: "text",
					body: "## La solución: Structs\r\n\r\nUn **struct** es un tipo personalizado que agrupa datos relacionados bajo un solo nombre. Cada dato se llama **campo** (field):",
				},
				{
					type: "code",
					language: "rust",
					code: '// Definicion del struct\r\nstruct Usuario {\r\n    nombre: String,\r\n    email: String,\r\n    edad: u32,\r\n    activo: bool,\r\n}\r\n\r\nfn main() {\r\n    // Crear una instancia\r\n    let usuario1 = Usuario {\r\n        nombre: String::from("Ana"),\r\n        email: String::from("ana@email.com"),\r\n        edad: 28,\r\n        activo: true,\r\n    };\r\n\r\n    println!("Nombre: {}", usuario1.nombre);\r\n    println!("Email: {}", usuario1.email);\r\n    println!("Edad: {}", usuario1.edad);\r\n    println!("Activo: {}", usuario1.activo);\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Structs mutables\r\n\r\nPara modificar un struct, **toda la instancia** debe ser mutable. Rust no permite que solo algunos campos sean mutables:",
				},
				{
					type: "code",
					language: "rust",
					code: 'struct Punto {\r\n    x: f64,\r\n    y: f64,\r\n}\r\n\r\nfn main() {\r\n    let mut p = Punto { x: 1.0, y: 2.0 };\r\n    println!("Antes: ({}, {})", p.x, p.y);\r\n\r\n    p.x = 5.0;  // OK porque p es mut\r\n    p.y = 10.0;\r\n    println!("Despues: ({}, {})", p.x, p.y);\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Funciones constructoras y Field Init Shorthand\r\n\r\nEs común crear funciones que construyen un struct. Rust tiene un atajo: si el parámetro tiene el mismo nombre que el campo, puedes omitir la repeticion:",
				},
				{
					type: "code",
					language: "rust",
					code: 'struct Color {\r\n    r: u8,\r\n    g: u8,\r\n    b: u8,\r\n}\r\n\r\n// Field init shorthand: si variable == campo, no repitas\r\nfn nuevo_color(r: u8, g: u8, b: u8) -> Color {\r\n    Color { r, g, b }  // En lugar de Color { r: r, g: g, b: b }\r\n}\r\n\r\nfn main() {\r\n    let rojo = nuevo_color(255, 0, 0);\r\n    let verde = Color { r: 0, g: 255, b: 0 };\r\n\r\n    println!("Rojo: rgb({}, {}, {})", rojo.r, rojo.g, rojo.b);\r\n    println!("Verde: rgb({}, {}, {})", verde.r, verde.g, verde.b);\r\n\r\n    // Struct update syntax: crear un struct basado en otro\r\n    let rojo_oscuro = Color { r: 139, ..rojo };  // g y b vienen de rojo\r\n    println!("Rojo oscuro: rgb({}, {}, {})", rojo_oscuro.r, rojo_oscuro.g, rojo_oscuro.b);\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Tuple Structs y Unit Structs\r\n\r\nRust tiene dos variantes adicionales de structs:\r\n\r\n- **Tuple struct**: como una tupla con nombre. Útil para crear tipos distintos sobre el mismo dato.\r\n- **Unit struct**: sin campos. Útil como marcador o para implementar traits.",
				},
				{
					type: "code",
					language: "rust",
					code: '// Tuple structs - dan tipo distinto al mismo dato\r\nstruct Metros(f64);\r\nstruct Kilometros(f64);\r\n\r\nfn main() {\r\n    let distancia = Metros(100.0);\r\n    let largo_viaje = Kilometros(42.195);\r\n\r\n    // No puedes mezclarlos accidentalmente!\r\n    // let suma = distancia.0 + largo_viaje.0; // Conceptualmente incorrecto\r\n    // Pero el compilador no lo impide aqui porque ambos .0 son f64.\r\n    // La ventaja es en las funciones: puedes exigir el tipo correcto.\r\n\r\n    println!("Distancia: {} metros", distancia.0);\r\n    println!("Maraton: {} km", largo_viaje.0);\r\n\r\n    // Conversion explicita\r\n    let en_km = Kilometros(distancia.0 / 1000.0);\r\n    println!("{} metros = {} km", distancia.0, en_km.0);\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Imprimir structs con Debug\r\n\r\nPor defecto, no puedes imprimir un struct con `println!`. Necesitas derivar el trait `Debug`:",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]  // Permite imprimir con {:?} y {:#?}\r\nstruct Rectangulo {\r\n    ancho: f64,\r\n    alto: f64,\r\n}\r\n\r\nfn main() {\r\n    let rect = Rectangulo { ancho: 30.0, alto: 50.0 };\r\n\r\n    // {:?} - formato compacto\r\n    println!("Rectangulo: {:?}", rect);\r\n\r\n    // {:#?} - formato bonito (pretty-print)\r\n    println!("Detalle: {:#?}", rect);\r\n\r\n    let area = rect.ancho * rect.alto;\r\n    println!("Area: {}", area);\r\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Traits derivables comunes:**\r\n- `#[derive(Debug)]` — permite imprimir con `{:?}` para depuración\r\n- `#[derive(Clone)]` — permite crear copias con `.clone()`\r\n- `#[derive(PartialEq)]` — permite comparar con `==` y `!=`\r\n- Puedes combinarlos: `#[derive(Debug, Clone, PartialEq)]`",
				},
				{
					type: "quiz",
					question:
						"Para modificar un campo de un struct, ¿qué necesitas hacer?",
					options: [
						{
							text: "Declarar solo ese campo como mutable",
							correct: false,
						},
						{
							text: "Declarar toda la instancia del struct como `let mut`",
							correct: true,
						},
						{
							text: "Los structs no se pueden modificar en Rust",
							correct: false,
						},
						{
							text: "Usar la palabra clave `mutable` en la definición del struct",
							correct: false,
						},
					],
					explanation:
						"En Rust la mutabilidad es una propiedad de la **variable completa** (`let mut`), no de campos individuales: si la instancia es `mut`, puedes modificar cualquier campo; si no, ninguno. No existe mutabilidad por campo ni una palabra clave `mutable` en la definición del struct.",
				},
				{
					type: "quiz",
					question: "Qué hace `#[derive(Debug)]` en un struct?",
					options: [
						{
							text: "Hace que el struct sea más rápido",
							correct: false,
						},
						{
							text: "Permite imprimir el struct con `{:?}` para depuración",
							correct: true,
						},
						{
							text: "Agrega un campo de debug al struct",
							correct: false,
						},
						{
							text: "Activa el modo debug del compilador",
							correct: false,
						},
					],
					explanation:
						"`#[derive(Debug)]` genera automáticamente la implementación del trait `Debug`, que es lo que `{:?}` y `{:#?}` necesitan para formatear el struct al imprimirlo. No afecta al rendimiento ni añade campos: solo código de formateo para depuración.",
				},
				{
					type: "exercise",
					title: "Modelar un User con struct",
					language: "rust",
					prompt:
						"Estás escribiendo un servicio que recibe datos de usuarios. Actualmente pasas todo como tupla `(String, String, u32, bool)` — frágil y difícil de leer. Si alguien cambia el orden, todo se rompe silenciosamente.\n\nTu tarea: define un struct `User` que reúna esos cuatro campos con nombres claros. Después, en `main`, crea dos usuarios y un constructor `User::nuevo` que reciba sólo `email`, `nombre` y `edad` (los nuevos usuarios siempre arrancan con `verified: false`).\n\nCampos:\n- `email`: String\n- `nombre`: String\n- `edad`: u32\n- `verified`: bool",
					starterCode:
						'// TODO: definir el struct User aquí\n// TODO: definir el constructor User::nuevo(...)\n\nfn imprimir_usuario(u: &User) {\n    println!(\n        "{} <{}> · {} años · {}",\n        u.nombre,\n        u.email,\n        u.edad,\n        if u.verified { "verificado" } else { "sin verificar" }\n    );\n}\n\nfn main() {\n    let ana = User::nuevo(\n        String::from("ana@empresa.co"),\n        String::from("Ana"),\n        28,\n    );\n    imprimir_usuario(&ana);\n}',
					solution:
						'struct User {\n    email: String,\n    nombre: String,\n    edad: u32,\n    verified: bool,\n}\n\nimpl User {\n    fn nuevo(email: String, nombre: String, edad: u32) -> Self {\n        Self { email, nombre, edad, verified: false }\n    }\n}\n\nfn imprimir_usuario(u: &User) {\n    println!(\n        "{} <{}> · {} años · {}",\n        u.nombre,\n        u.email,\n        u.edad,\n        if u.verified { "verificado" } else { "sin verificar" }\n    );\n}\n\nfn main() {\n    let ana = User::nuevo(\n        String::from("ana@empresa.co"),\n        String::from("Ana"),\n        28,\n    );\n    imprimir_usuario(&ana);\n}',
					hints: [
						"Para definir un struct se usa `struct Nombre { campo: Tipo, ... }`. Los campos van separados por coma.",
						"Para añadir un constructor (o cualquier método) usa un bloque `impl Nombre { ... }` con la función dentro. Por convención el constructor se llama `nuevo` (o `new` en inglés).",
						"`Self` (con S mayúscula) dentro de `impl User` es un alias para `User`. Y la sintaxis `Self { email, nombre, ... }` aprovecha la *field init shorthand*: si la variable se llama igual que el campo no escribes `email: email`.",
					],
					explanation:
						"**Por qué esto es mejor que una tupla:**\n\n1. **Nombres explícitos.** `u.email` es autodocumentado. `tupla.0` no dice nada.\n2. **El compilador valida invariantes.** Si añades un campo nuevo al struct, todos los lugares que crean `User` necesitan actualizarse — el compilador te avisa.\n3. **Constructor con invariantes.** `User::nuevo` garantiza que los usuarios siempre arrancan no verificados. Imposible olvidarlo.\n\n**Patrón a recordar:** las tuplas son útiles para retornos efímeros (`(min, max)`). Cuando vayas a pasar el dato a varias funciones o guardarlo, **usa struct**. La regla práctica: si tienes 3+ campos o el dato vive más de una función, struct.",
				},
				{
					type: "exercise",
					title: "🟡 Aplica · Precio con IVA: un constructor que calcula",
					language: "rust",
					prompt:
						"En la mayoría de tiendas online, el precio que ves ya trae el IVA sumado. En el sistema interno conviene guardar el desglose: cuánto vale el producto sin impuestos, cuánto IVA se le añadió y cuál es el precio final que paga el cliente. Así, si más adelante necesitas la factura, no tienes que recalcular nada: el dato ya vive en la ficha del producto.\n\nVas a modelar esa ficha con un struct y un **constructor** (función asociada `Producto::new`) que reciba el precio base y el porcentaje de IVA, calcule el resto, y devuelva el `Producto` ya completo.\n\nTu tarea:\n\n1. Define el struct `Producto` con estos campos:\n   - `nombre`: `String`\n   - `precio_base`: `f64` (precio sin IVA)\n   - `iva`: `f64` (importe del IVA en dinero, no el porcentaje)\n   - `precio_final`: `f64` (`precio_base + iva`)\n2. En un bloque `impl Producto`, escribe la función asociada `new(nombre: String, precio_base: f64, porcentaje_iva: f64) -> Self`. Dentro:\n   - calcula el importe del IVA: `precio_base * porcentaje_iva / 100.0`,\n   - calcula `precio_final = precio_base + iva`,\n   - construye y devuelve el `Producto` con los cuatro campos rellenos.\n\nFíjate: `new` recibe un *porcentaje* (21.0 significa 21 %), pero el campo `iva` guarda el *importe en dinero*. El constructor es justo el lugar donde se hace esa conversión una sola vez.",
					starterCode:
						'// TODO: define el struct Producto con sus 4 campos\n\nimpl Producto {\n    // TODO: fn new(nombre: String, precio_base: f64, porcentaje_iva: f64) -> Self\n    // calcula iva y precio_final, y devuelve el Producto completo\n}\n\nfn main() {\n    let teclado = Producto::new(String::from("Teclado"), 100.0, 21.0);\n    println!(\n        "{}: base ${:.2} + IVA ${:.2} = ${:.2}",\n        teclado.nombre, teclado.precio_base, teclado.iva, teclado.precio_final\n    );\n\n    let libro = Producto::new(String::from("Libro"), 50.0, 4.0);\n    println!(\n        "{}: base ${:.2} + IVA ${:.2} = ${:.2}",\n        libro.nombre, libro.precio_base, libro.iva, libro.precio_final\n    );\n}',
					solution:
						'struct Producto {\n    nombre: String,\n    precio_base: f64,\n    iva: f64,\n    precio_final: f64,\n}\n\nimpl Producto {\n    fn new(nombre: String, precio_base: f64, porcentaje_iva: f64) -> Self {\n        let iva = precio_base * porcentaje_iva / 100.0;\n        let precio_final = precio_base + iva;\n        Self {\n            nombre,\n            precio_base,\n            iva,\n            precio_final,\n        }\n    }\n}\n\nfn main() {\n    let teclado = Producto::new(String::from("Teclado"), 100.0, 21.0);\n    println!(\n        "{}: base ${:.2} + IVA ${:.2} = ${:.2}",\n        teclado.nombre, teclado.precio_base, teclado.iva, teclado.precio_final\n    );\n\n    let libro = Producto::new(String::from("Libro"), 50.0, 4.0);\n    println!(\n        "{}: base ${:.2} + IVA ${:.2} = ${:.2}",\n        libro.nombre, libro.precio_base, libro.iva, libro.precio_final\n    );\n}',
					hints: [
						"Empieza por la ficha de datos: `struct Producto { nombre: String, precio_base: f64, iva: f64, precio_final: f64 }`. Son cuatro campos separados por coma.",
						"El constructor va dentro de `impl Producto { ... }`. Como no opera sobre una instancia ya existente (la está creando), es una *función asociada*: NO recibe `&self`, y por eso se llama con `Producto::new(...)`, igual que `User::nuevo` de antes.",
						"Antes de construir el struct puedes guardar los cálculos en variables locales: `let iva = precio_base * porcentaje_iva / 100.0;` y `let precio_final = precio_base + iva;`. Ojo con escribir `/ 100.0` (con punto): si pones `/ 100` mezclas `f64` con un entero y Rust no compila.",
						"Al final, devuelve `Self { ... }`. Como las variables `nombre`, `precio_base`, `iva` y `precio_final` se llaman igual que los campos, usa la *field init shorthand*: `Self { nombre, precio_base, iva, precio_final }` sin repetir `campo: campo`.",
					],
					explanation:
						"**Por qué un constructor que calcula es un patrón real:**\n\n1. **El cálculo vive en un solo sitio.** La regla \"el IVA es base × porcentaje ÷ 100\" se escribe una vez, dentro de `new`. Cualquiera que cree un `Producto` obtiene el desglose correcto sin tener que conocer la fórmula.\n2. **Imposible construir un producto incoherente.** Como el único camino para crear un `Producto` pasa por `new`, nunca tendrás un `precio_final` que no cuadre con `precio_base + iva`. El constructor *protege la invariante* del tipo.\n3. **Función asociada, no método.** `new` no recibe `&self` porque cuando la llamas todavía no existe ninguna instancia: la está fabricando. Por eso se invoca con `::` sobre el tipo (`Producto::new`), exactamente como `String::from` que ya usas todo el tiempo.\n\n**Conexión con lo anterior:** esto es la versión 'con lógica' del `User::nuevo` que escribiste antes. Allí el constructor solo rellenaba un valor por defecto (`verified: false`); aquí, además, *deriva* campos a partir de los argumentos. Es el mismo patrón creciendo: el constructor es el guardián de cómo nace un valor de tu tipo.\n\n**Nota sobre `f64`:** los `f64` son cómodos para aprender, pero en dinero real (producción) se suele trabajar con enteros de centavos o un tipo decimal exacto, porque `0.1 + 0.2` en coma flotante no da exactamente `0.3`. Aquí los números están elegidos para que el resultado sea exacto.",
				},
			],
		},
		{
			id: "m04_l02",
			moduleId: "m04",
			moduleSlug: "m04_structs_enums",
			order: 2,
			title: "Métodos e Implementaciones",
			blocks: [
				{
					type: "first-principles",
					title: "Métodos: poner comportamiento cerca de los datos que usa",
					problem:
						"Si los datos están en un lugar y las funciones que los manipulan en otro, es fácil perder el contexto. Queremos que el comportamiento natural de un tipo viva cerca del tipo.",
					mentalModel:
						"Un método es una acción que pertenece a una cosa. Un `Rectangulo` sabe calcular su área porque tiene ancho y alto.",
					concreteExample:
						"`usuario.nombre_completo()` se lee mejor que `nombre_completo(usuario)`, porque comunica que esa operación pertenece al concepto `Usuario`.",
					remember:
						"`impl` es el lugar donde enseñas a tus tipos qué pueden hacer.",
				},
				{
					type: "faded-exercise",
					conceptId: "m04-struct-method",
					title: "Práctica guiada: un tipo con comportamiento",
					intro:
						"Vamos a darle a un struct un método propio. Primero observa un ejemplo resuelto, luego completa los huecos, luego créalo desde cero.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** `Circulo` guarda su `radio` y sabe calcular su propia `area()`. El método recibe `&self` (una referencia a sí mismo) y lee sus campos con `self.campo`.",
							code: "struct Circulo {\n    radio: f64,\n}\n\nimpl Circulo {\n    fn area(&self) -> f64 {\n        3.14159 * self.radio * self.radio\n    }\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** A `Rectangulo` le falta el cuerpo de `area`. Rellena los `___` para que multiplique sus dos campos.",
							code: "struct Rectangulo {\n    ancho: u32,\n    alto: u32,\n}\n\nimpl Rectangulo {\n    fn area(&self) -> u32 {\n        self.___ * self.___\n    }\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Define `Rectangulo` con `ancho: u32` y `alto: u32`, y su método `area(&self) -> u32`.",
							code: "struct Rectangulo {\n    // campos aquí\n}\n\nimpl Rectangulo {\n    // método area aquí\n}",
						},
					],
					tests:
						'fn main() {\n    let r = Rectangulo { ancho: 3, alto: 4 };\n    assert_eq!(r.area(), 12, "area de 3x4 deberia ser 12");\n    let c = Rectangulo { ancho: 5, alto: 5 };\n    assert_eq!(c.area(), 25, "area de 5x5 deberia ser 25");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"struct Rectangulo {\n    ancho: u32,\n    alto: u32,\n}\n\nimpl Rectangulo {\n    fn area(&self) -> u32 {\n        self.ancho * self.alto\n    }\n}",
				},
				{
					type: "text",
					body: "## El Problema: funciones sueltas operando sobre datos\r\n\r\nSin métodos, necesitas pasar el struct a cada función. El código se vuelve verboso y es difícil saber que funciones van con que datos:",
				},
				{
					type: "code",
					language: "rust",
					code: "struct Rectangulo {\r\n    ancho: f64,\r\n    alto: f64,\r\n}\r\n\r\n// Funciones sueltas - no esta claro que pertenecen a Rectangulo\r\nfn area(rect: &Rectangulo) -> f64 {\r\n    rect.ancho * rect.alto\r\n}\r\n\r\nfn perimetro(rect: &Rectangulo) -> f64 {\r\n    2.0 * (rect.ancho + rect.alto)\r\n}\r\n\r\nfn es_cuadrado(rect: &Rectangulo) -> bool {\r\n    rect.ancho == rect.alto\r\n}",
					runnable: false,
				},
				{
					type: "text",
					body: "## La solución: bloques `impl`\r\n\r\nLos bloques `impl` (implementation) asocian funciones directamente con un tipo. Las funciones dentro de `impl` pueden ser **métodos** (reciben `&self`) o **funciones asociadas** (no reciben self):",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]\r\nstruct Rectangulo {\r\n    ancho: f64,\r\n    alto: f64,\r\n}\r\n\r\nimpl Rectangulo {\r\n    // Funcion asociada (como un constructor) - se llama con ::\r\n    fn nuevo(ancho: f64, alto: f64) -> Rectangulo {\r\n        Rectangulo { ancho, alto }\r\n    }\r\n\r\n    // Funcion asociada: cuadrado (constructor alternativo)\r\n    fn cuadrado(lado: f64) -> Rectangulo {\r\n        Rectangulo { ancho: lado, alto: lado }\r\n    }\r\n\r\n    // Metodo: recibe &self (referencia inmutable a la instancia)\r\n    fn area(&self) -> f64 {\r\n        self.ancho * self.alto\r\n    }\r\n\r\n    // Metodo: referencia inmutable\r\n    fn perimetro(&self) -> f64 {\r\n        2.0 * (self.ancho + self.alto)\r\n    }\r\n\r\n    // Metodo: devuelve bool\r\n    fn es_cuadrado(&self) -> bool {\r\n        self.ancho == self.alto\r\n    }\r\n\r\n    // Metodo: recibe &mut self (puede modificar la instancia)\r\n    fn escalar(&mut self, factor: f64) {\r\n        self.ancho *= factor;\r\n        self.alto *= factor;\r\n    }\r\n\r\n    // Metodo: toma ownership (consume self) - raro pero util\r\n    fn describir(self) -> String {\r\n        format!("Rectangulo {}x{}", self.ancho, self.alto)\r\n    }\r\n}\r\n\r\nfn main() {\r\n    // Funciones asociadas se llaman con ::\r\n    let mut rect = Rectangulo::nuevo(10.0, 5.0);\r\n    let cuad = Rectangulo::cuadrado(7.0);\r\n\r\n    // Metodos se llaman con .\r\n    println!("Rectangulo: {:?}", rect);\r\n    println!("Area: {}", rect.area());\r\n    println!("Perimetro: {}", rect.perimetro());\r\n    println!("Es cuadrado? {}", rect.es_cuadrado());\r\n\r\n    println!("\\nCuadrado: {:?}", cuad);\r\n    println!("Area cuadrado: {}", cuad.area());\r\n    println!("Es cuadrado? {}", cuad.es_cuadrado());\r\n\r\n    // Metodo mutable\r\n    rect.escalar(2.0);\r\n    println!("\\nDespues de escalar x2: {:?}", rect);\r\n    println!("Nueva area: {}", rect.area());\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Los tres tipos de self\r\n\r\nEl primer parámetro de un método determina como accede a la instancia:\r\n\r\n| Parámetro | Significado | Uso típico |\r\n|-----------|-------------|------------|\r\n| `&self` | Referencia inmutable | Leer datos (la mayoria de métodos) |\r\n| `&mut self` | Referencia mutable | Modificar datos |\r\n| `self` | Toma ownership | Transformar o consumir la instancia |\r\n\r\nLa regla es simple: usa `&self` por defecto. Solo usa `&mut self` si necesitas modificar, y `self` si necesitas consumir la instancia (raro).",
				},
				{
					type: "text",
					body: "## Ejemplo completo: una cuenta bancaria",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]\r\nstruct CuentaBancaria {\r\n    titular: String,\r\n    saldo: f64,\r\n}\r\n\r\nimpl CuentaBancaria {\r\n    fn nueva(titular: &str, saldo_inicial: f64) -> CuentaBancaria {\r\n        CuentaBancaria {\r\n            titular: String::from(titular),\r\n            saldo: saldo_inicial,\r\n        }\r\n    }\r\n\r\n    fn saldo(&self) -> f64 {\r\n        self.saldo\r\n    }\r\n\r\n    fn depositar(&mut self, cantidad: f64) {\r\n        if cantidad > 0.0 {\r\n            self.saldo += cantidad;\r\n            println!("  + Deposito: ${:.2}", cantidad);\r\n        }\r\n    }\r\n\r\n    fn retirar(&mut self, cantidad: f64) -> bool {\r\n        if cantidad > 0.0 && cantidad <= self.saldo {\r\n            self.saldo -= cantidad;\r\n            println!("  - Retiro: ${:.2}", cantidad);\r\n            true\r\n        } else {\r\n            println!("  ! Fondos insuficientes para ${:.2}", cantidad);\r\n            false\r\n        }\r\n    }\r\n\r\n    fn resumen(&self) {\r\n        println!("Cuenta de {}: ${:.2}", self.titular, self.saldo);\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let mut cuenta = CuentaBancaria::nueva("Ferris", 1000.0);\r\n    cuenta.resumen();\r\n\r\n    cuenta.depositar(500.0);\r\n    cuenta.retirar(200.0);\r\n    cuenta.retirar(2000.0);  // Fondos insuficientes\r\n\r\n    println!();\r\n    cuenta.resumen();\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Multiples bloques impl\r\n\r\nPuedes tener varios bloques `impl` para el mismo tipo. Esto es útil para organizar el código:",
				},
				{
					type: "code",
					language: "rust",
					code: 'struct Circulo {\r\n    radio: f64,\r\n}\r\n\r\n// Constructores\r\nimpl Circulo {\r\n    fn nuevo(radio: f64) -> Circulo {\r\n        Circulo { radio }\r\n    }\r\n}\r\n\r\n// Calculos\r\nimpl Circulo {\r\n    fn area(&self) -> f64 {\r\n        std::f64::consts::PI * self.radio * self.radio\r\n    }\r\n\r\n    fn circunferencia(&self) -> f64 {\r\n        2.0 * std::f64::consts::PI * self.radio\r\n    }\r\n\r\n    fn contiene_punto(&self, x: f64, y: f64) -> bool {\r\n        (x * x + y * y).sqrt() <= self.radio\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let c = Circulo::nuevo(5.0);\r\n    println!("Radio: {}", c.radio);\r\n    println!("Area: {:.2}", c.area());\r\n    println!("Circunferencia: {:.2}", c.circunferencia());\r\n    println!("Contiene (3,4)? {}", c.contiene_punto(3.0, 4.0));\r\n    println!("Contiene (4,4)? {}", c.contiene_punto(4.0, 4.0));\r\n}',
					runnable: true,
				},
				{
					type: "quiz",
					question:
						"¿Cuál es la diferencia entre una función asociada y un método en un bloque `impl`?",
					options: [
						{
							text: "No hay diferencia",
							correct: false,
						},
						{
							text: "Los métodos reciben `self` (o &self, &mut self) como primer parámetro; las funciones asociadas no",
							correct: true,
						},
						{
							text: "Las funciones asociadas son privadas",
							correct: false,
						},
						{
							text: "Los métodos son más rápidos",
							correct: false,
						},
					],
					explanation:
						"La diferencia está en el primer parámetro: un método recibe `self` (o `&self`, `&mut self`) y opera sobre una instancia concreta; una función asociada no recibe `self` y se llama sobre el tipo, como `Rectangulo::nuevo(...)`. Por eso los constructores son funciones asociadas: cuando los llamas, todavía no existe ninguna instancia.",
				},
				{
					type: "quiz",
					question:
						"¿Cómo se llama a una función asociada como `Rectangulo::nuevo(10.0, 5.0)`?",
					options: [
						{
							text: "Con el operador punto: `rect.nuevo(10.0, 5.0)`",
							correct: false,
						},
						{
							text: "Con doble dos puntos: `Rectangulo::nuevo(10.0, 5.0)`",
							correct: true,
						},
						{
							text: "Con la palabra clave `new`: `new Rectangulo(10.0, 5.0)`",
							correct: false,
						},
						{
							text: "Con parentesis directos: `Rectangulo(10.0, 5.0)`",
							correct: false,
						},
					],
					explanation:
						"Las funciones asociadas pertenecen al **tipo**, no a una instancia, así que se llaman con `Tipo::funcion(...)`. El operador punto (`rect.area()`) es para métodos, que necesitan una instancia ya existente. La palabra clave `new` como operador es de Java/JavaScript — en Rust `new` es solo un nombre de función por convención.",
				},
				{
					type: "exercise",
					title: "Rate limiter: métodos sobre un struct con estado mutable",
					language: "rust",
					prompt:
						"Estás construyendo un mini rate limiter (limitador de peticiones) para una API. Quieres que cada cliente tenga su propio contador.\n\nTu tarea: implementa el struct `RateLimiter` con:\n\n- Un campo `max_requests: u32` (cuota máxima)\n- Un campo `current: u32` (peticiones consumidas)\n- Método asociado `new(max: u32) -> Self` que arranca con `current: 0`\n- Método `try_request(&mut self) -> bool`: si quedan peticiones, incrementa `current` y devuelve `true`. Si ya excedió, devuelve `false` sin incrementar.\n- Método `remaining(&self) -> u32`: peticiones restantes.",
					starterCode:
						'struct RateLimiter {\n    // TODO: campos\n}\n\nimpl RateLimiter {\n    // TODO: new, try_request, remaining\n}\n\nfn main() {\n    let mut limiter = RateLimiter::new(3);\n\n    for i in 1..=5 {\n        if limiter.try_request() {\n            println!("Petición {} permitida (quedan {})", i, limiter.remaining());\n        } else {\n            println!("Petición {} RECHAZADA", i);\n        }\n    }\n}',
					solution:
						'struct RateLimiter {\n    max_requests: u32,\n    current: u32,\n}\n\nimpl RateLimiter {\n    fn new(max: u32) -> Self {\n        Self { max_requests: max, current: 0 }\n    }\n\n    fn try_request(&mut self) -> bool {\n        if self.current < self.max_requests {\n            self.current += 1;\n            true\n        } else {\n            false\n        }\n    }\n\n    fn remaining(&self) -> u32 {\n        self.max_requests - self.current\n    }\n}\n\nfn main() {\n    let mut limiter = RateLimiter::new(3);\n\n    for i in 1..=5 {\n        if limiter.try_request() {\n            println!("Petición {} permitida (quedan {})", i, limiter.remaining());\n        } else {\n            println!("Petición {} RECHAZADA", i);\n        }\n    }\n}',
					hints: [
						"`new` es un método asociado: no recibe `&self`. Devuelve `Self`. Por convención en Rust se llama `new` (no `nuevo`) porque es el constructor estándar.",
						"`try_request` necesita **modificar** `current`, así que recibe `&mut self`. Sin el `mut`, no puedes incrementar.",
						"`remaining` solo **lee** el estado, así que recibe `&self` (referencia inmutable). Esto comunica al usuario: 'esta llamada no cambia nada'.",
					],
					explanation:
						"**Lo que aprendiste sobre `self`:**\n\n| Forma | Cuándo usarla | Qué transmite |\n|---|---|---|\n| `self` | El método consume el struct (raro) | 'Después de esto, ya no podrás usar el limitador' |\n| `&self` | Solo lee estado | 'Lectura segura, no afecta a nadie' |\n| `&mut self` | Modifica estado | 'Cambio el estado, solo una llamada a la vez' |\n\n**Patrón a recordar:** estructurar tipos con estado interno + métodos `&mut self` es Rust idiomático. En código real verás `HashMap::insert(&mut self, k, v)`, `Vec::push(&mut self, x)`, `TcpStream::write(&mut self, bytes)` siguiendo este patrón.\n\n**Ojo:** `current < max` previene el caso donde restar (`max - current`) podría hacer underflow si pasaras `u32`. Es un detalle que el compilador no te avisa pero que importa en producción.",
				},
			],
		},
		{
			id: "m04_l03",
			moduleId: "m04",
			moduleSlug: "m04_structs_enums",
			order: 3,
			title: "Enums y Pattern Matching",
			blocks: [
				{
					type: "first-principles",
					title:
						"Enums: modelar opciones reales sin inventar estados imposibles",
					problem:
						"Muchas cosas pueden estar en un conjunto limitado de estados: pendiente, pagado, cancelado. Si usas strings sueltos, puedes escribir valores inválidos por accidente.",
					mentalModel:
						"Un enum es una lista cerrada de posibilidades. Rust obliga a considerar esas posibilidades al tomar decisiones.",
					concreteExample:
						'Un pago no debería ser `"pagaddo"` por un error de tipeo. Con `enum EstadoPago { Pendiente, Pagado, Cancelado }`, ese estado imposible no compila.',
					remember:
						"Los enums hacen que estados inválidos sean difíciles o imposibles de representar.",
				},
				{
					type: "challenge",
					conceptId: "m04-enum-match",
					title: "Antes de leer: decide según la variante",
					prompt:
						"Ya tienes definido un enum `Luz { Roja, Amarilla, Verde }`. **Tu reto:** escribe `segundos(luz: &Luz) -> u32` que devuelva cuántos segundos dura cada luz: `Roja` → 30, `Amarilla` → 5, `Verde` → 25.\n\nIntenta resolverlo y dale a Verificar. Si no conoces `match` todavía, no importa — pelearte con esto hará que la explicación encaje sola.",
					starterCode:
						"enum Luz {\n    Roja,\n    Amarilla,\n    Verde,\n}\n\nfn segundos(luz: &Luz) -> u32 {\n    // ¿cómo devuelves un número distinto según la variante?\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(segundos(&Luz::Roja), 30);\n    assert_eq!(segundos(&Luz::Amarilla), 5);\n    assert_eq!(segundos(&Luz::Verde), 25);\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Necesitas devolver un número distinto según **cuál variante** del enum recibes. La herramienta de Rust para decidir entre variantes es `match`: compara el valor contra cada posibilidad.",
						"La sintaxis es `match luz { Luz::Roja => 30, ... }`. Cada rama es `patrón => valor`, separadas por comas, y el `match` entero es una expresión que se devuelve.",
						"El `match` debe cubrir las tres variantes: `Luz::Roja`, `Luz::Amarilla` y `Luz::Verde`. Si falta una, el compilador rechaza el código — esa exhaustividad es justamente la gracia de `match`.",
					],
					solution:
						"enum Luz {\n    Roja,\n    Amarilla,\n    Verde,\n}\n\nfn segundos(luz: &Luz) -> u32 {\n    match luz {\n        Luz::Roja => 30,\n        Luz::Amarilla => 5,\n        Luz::Verde => 25,\n    }\n}",
					reveal:
						"La herramienta para esto es `match`: compara un valor contra cada variante posible y elige una rama.\n\n```rust\nfn segundos(luz: &Luz) -> u32 {\n    match luz {\n        Luz::Roja => 30,\n        Luz::Amarilla => 5,\n        Luz::Verde => 25,\n    }\n}\n```\n\nLo poderoso: `match` es **exhaustivo**. Si te olvidas de una variante (por ejemplo `Verde`), Rust **no compila** y te avisa. Es imposible olvidar un caso por accidente — justo lo contrario a una cadena de `if` donde es fácil dejar un hueco. Eso es lo que veremos en detalle. 👇",
				},
				{
					type: "text",
					body: "## El Problema: representar estados con strings o números\r\n\r\nEn muchos lenguajes, los estados se representan con strings o números magicos. Esto crea bugs porque nada te impide usar un valor invalido:",
				},
				{
					type: "code",
					language: "python",
					code: '# Python - estados como strings (peligroso)\r\nstatus = "pendiente"\r\n\r\n# Typo silencioso que nunca falla... hasta que explota\r\nif status == "pendiemte":  # Bug! Typo nunca detectado\r\n    print("Procesando...")\r\n\r\n# O peor: un estado que no existe\r\nstatus = "cancelando_parcialmente"  # Inventado, nadie lo maneja',
					runnable: false,
				},
				{
					type: "text",
					body: "## La solución: Enums\r\n\r\nUn **enum** (enumeracion) define un tipo que puede ser **una de varias variantes** posibles. El compilador verifica que siempre uses variantes válidas y que manejes todas:",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]\r\nenum EstadoPedido {\r\n    Pendiente,\r\n    Procesando,\r\n    Enviado,\r\n    Entregado,\r\n    Cancelado,\r\n}\r\n\r\nfn describir_estado(estado: &EstadoPedido) -> &str {\r\n    match estado {\r\n        EstadoPedido::Pendiente => "Esperando confirmacion",\r\n        EstadoPedido::Procesando => "En preparacion",\r\n        EstadoPedido::Enviado => "En camino",\r\n        EstadoPedido::Entregado => "Recibido por el cliente",\r\n        EstadoPedido::Cancelado => "Cancelado",\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let mi_pedido = EstadoPedido::Enviado;\r\n    println!("Estado: {:?}", mi_pedido);\r\n    println!("Descripcion: {}", describir_estado(&mi_pedido));\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Enums con datos\r\n\r\nLo que hace a los enums de Rust realmente poderosos es que cada variante puede **contener datos**. Es como si cada variante fuera un struct diferente:",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]\r\nenum Mensaje {\r\n    Texto(String),                    // Contiene un String\r\n    Numero(i32),                      // Contiene un entero\r\n    Coordenada { x: f64, y: f64 },   // Contiene campos nombrados\r\n    Salir,                            // Sin datos\r\n}\r\n\r\nfn procesar(msg: &Mensaje) {\r\n    match msg {\r\n        Mensaje::Texto(t) => println!("Texto: {}", t),\r\n        Mensaje::Numero(n) => println!("Numero: {}", n),\r\n        Mensaje::Coordenada { x, y } => println!("Posicion: ({}, {})", x, y),\r\n        Mensaje::Salir => println!("Adios!"),\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let mensajes = vec![\r\n        Mensaje::Texto(String::from("hola")),\r\n        Mensaje::Numero(42),\r\n        Mensaje::Coordenada { x: 3.0, y: 7.5 },\r\n        Mensaje::Salir,\r\n    ];\r\n\r\n    for msg in &mensajes {\r\n        procesar(msg);\r\n    }\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Pattern Matching avanzado con match\r\n\r\n`match` es mucho más que un switch. Puedes destructurar los datos de cada variante, usar guardas, y combinar patrones:",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]\r\nenum Moneda {\r\n    Centavo,\r\n    Diez,\r\n    Veinticinco,\r\n    Dolar,\r\n    Personalizada(u32),  // Valor personalizado en centavos\r\n}\r\n\r\nfn valor_en_centavos(moneda: &Moneda) -> u32 {\r\n    match moneda {\r\n        Moneda::Centavo => 1,\r\n        Moneda::Diez => 10,\r\n        Moneda::Veinticinco => 25,\r\n        Moneda::Dolar => 100,\r\n        Moneda::Personalizada(valor) => *valor,\r\n    }\r\n}\r\n\r\nfn clasificar_moneda(moneda: &Moneda) {\r\n    match moneda {\r\n        // Combinar variantes con |\r\n        Moneda::Centavo | Moneda::Diez => {\r\n            println!("{:?}: moneda pequena", moneda);\r\n        }\r\n        // Guardia con if\r\n        Moneda::Personalizada(v) if *v > 100 => {\r\n            println!("Personalizada de {} centavos: valor alto!", v);\r\n        }\r\n        // Resto\r\n        _ => {\r\n            println!("{:?}: {} centavos", moneda, valor_en_centavos(moneda));\r\n        }\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let monedas = vec![\r\n        Moneda::Centavo,\r\n        Moneda::Veinticinco,\r\n        Moneda::Dolar,\r\n        Moneda::Personalizada(50),\r\n        Moneda::Personalizada(200),\r\n    ];\r\n\r\n    let mut total = 0;\r\n    for moneda in &monedas {\r\n        clasificar_moneda(moneda);\r\n        total += valor_en_centavos(moneda);\r\n    }\r\n    println!("\\nTotal: {} centavos (${:.2})", total, total as f64 / 100.0);\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## if let: match simplificado\r\n\r\nCuando solo te interesa **una variante** y quieres ignorar el resto, `if let` es más conciso que `match`:",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]\r\nenum Configuracion {\r\n    Valor(i32),\r\n    Texto(String),\r\n    Nada,\r\n}\r\n\r\nfn main() {\r\n    let config = Configuracion::Valor(42);\r\n\r\n    // Con match (verboso para un solo caso)\r\n    match &config {\r\n        Configuracion::Valor(v) => println!("match: valor = {}", v),\r\n        _ => {}  // Ignorar el resto\r\n    }\r\n\r\n    // Con if let (conciso y claro)\r\n    if let Configuracion::Valor(v) = &config {\r\n        println!("if let: valor = {}", v);\r\n    }\r\n\r\n    // if let con else\r\n    let otra = Configuracion::Nada;\r\n    if let Configuracion::Valor(v) = &otra {\r\n        println!("Tiene valor: {}", v);\r\n    } else {\r\n        println!("No tiene valor numerico");\r\n    }\r\n\r\n    // while let - iterar mientras un patron coincida\r\n    let mut pila = vec![1, 2, 3];\r\n    print!("Desapilando: ");\r\n    while let Some(tope) = pila.pop() {\r\n        print!("{} ", tope);\r\n    }\r\n    println!();\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Enums con métodos\r\n\r\nAl igual que los structs, los enums pueden tener bloques `impl` con métodos:",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]\r\nenum Semaforo {\r\n    Rojo,\r\n    Amarillo,\r\n    Verde,\r\n}\r\n\r\nimpl Semaforo {\r\n    fn siguiente(&self) -> Semaforo {\r\n        match self {\r\n            Semaforo::Rojo => Semaforo::Verde,\r\n            Semaforo::Verde => Semaforo::Amarillo,\r\n            Semaforo::Amarillo => Semaforo::Rojo,\r\n        }\r\n    }\r\n\r\n    fn duracion_segundos(&self) -> u32 {\r\n        match self {\r\n            Semaforo::Rojo => 60,\r\n            Semaforo::Amarillo => 5,\r\n            Semaforo::Verde => 45,\r\n        }\r\n    }\r\n\r\n    fn puede_avanzar(&self) -> bool {\r\n        matches!(self, Semaforo::Verde)\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let mut luz = Semaforo::Rojo;\r\n    for _ in 0..6 {\r\n        println!("{:?}: {} segundos, avanzar: {}",\r\n            luz, luz.duracion_segundos(), luz.puede_avanzar());\r\n        luz = luz.siguiente();\r\n    }\r\n}',
					runnable: true,
				},
				{
					type: "quiz",
					question:
						"Qué ventaja tienen los enums de Rust sobre usar strings para representar estados?",
					options: [
						{
							text: "Los enums son más rápidos",
							correct: false,
						},
						{
							text: "El compilador verifica que uses variantes válidas y manejes todos los casos",
							correct: true,
						},
						{
							text: "Los enums usan menos memoria",
							correct: false,
						},
						{
							text: "Los strings no existen en Rust",
							correct: false,
						},
					],
					explanation:
						'Con un enum, una variante con typo (como `"pagaddo"`) ni siquiera compila, y `match` te obliga a manejar **todas** las variantes. Con strings, cualquier valor inválido pasa silenciosamente y el bug aparece en runtime. La ventaja es corrección verificada por el compilador — la velocidad o la memoria son secundarias aquí.',
				},
				{
					type: "quiz",
					question: "Qué hace `if let` en Rust?",
					options: [
						{
							text: "Crea una variable condicional",
							correct: false,
						},
						{
							text: "Es un match simplificado que solo comprueba un patron, ignorando el resto",
							correct: true,
						},
						{
							text: "Declara una variable si la condición es verdadera",
							correct: false,
						},
						{
							text: "Es lo mismo que un if normal",
							correct: false,
						},
					],
					explanation:
						"`if let Patron = valor { ... }` es azúcar sintáctica para un `match` donde solo te interesa **una** variante y el resto se ignora. No es un `if` booleano normal: compara el valor contra un patrón y, si encaja, destructura sus datos — igual que una rama de `match`.",
				},
				{
					type: "faded-exercise",
					conceptId: "m04-enum-match-notif",
					title: "🟢 Guiado: enrutar notificaciones con match exhaustivo",
					intro:
						'Toda app con notificaciones (un chat, una red social, tu banco) necesita decidir **qué texto mostrar** según el tipo de aviso. Modelarlo con strings es frágil: un typo como "mencionn" pasa silencioso. Con un enum, `match` te obliga a cubrir TODOS los tipos.\n\nVas a construir el enrutador de mensajes de notificación de una app, en tres pasos: primero observas uno resuelto, luego rellenas huecos, luego lo escribes tú solo.',
					stages: [
						{
							kind: "worked",
							instructions:
								'**Paso 1 — observa.** Este enum `Evento` de un editor de texto sabe traducirse a un mensaje legible. Fíjate en el patrón: `match self` con UNA rama por variante, y cada rama devuelve un `&str` (una porción de texto prestada del literal `"..."`, que vive todo el programa). El `match` es la última expresión del método, así que es lo que se devuelve. Y como cubre las 3 variantes, no necesita `_`.',
							code: 'enum Evento {\n    Guardado,\n    Editado,\n    Cerrado,\n}\n\nimpl Evento {\n    fn mensaje(&self) -> &str {\n        match self {\n            Evento::Guardado => "Documento guardado",\n            Evento::Editado => "Cambios sin guardar",\n            Evento::Cerrado => "Documento cerrado",\n        }\n    }\n}',
						},
						{
							kind: "faded",
							instructions:
								'**Paso 2 — completa.** Aquí está el enum real de la app: `TipoNotificacion`. El método `texto` ya tiene las primeras ramas; faltan dos. Rellena los `___`: la variante que falta a la izquierda del `=>` y el texto que devuelve a la derecha. Pista: `Sistema` debe devolver `"Aviso del sistema"` y `Promocion` debe devolver `"Oferta disponible"`.',
							code: 'enum TipoNotificacion {\n    Mensaje,\n    Mencion,\n    Sistema,\n    Promocion,\n}\n\nimpl TipoNotificacion {\n    fn texto(&self) -> &str {\n        match self {\n            TipoNotificacion::Mensaje => "Tienes un nuevo mensaje",\n            TipoNotificacion::Mencion => "Te han mencionado",\n            TipoNotificacion::___ => "Aviso del sistema",\n            TipoNotificacion::Promocion => ___,\n        }\n    }\n}',
						},
						{
							kind: "solo",
							instructions:
								'**Paso 3 — tú solo.** Escribe el enum completo y AMBOS métodos. Define `TipoNotificacion` con las 4 variantes (`Mensaje`, `Mencion`, `Sistema`, `Promocion`) y dale dos métodos con `match` exhaustivo:\n\n- `texto(&self) -> &str`: `Mensaje` → `"Tienes un nuevo mensaje"`, `Mencion` → `"Te han mencionado"`, `Sistema` → `"Aviso del sistema"`, `Promocion` → `"Oferta disponible"`.\n- `prioridad(&self) -> u8`: cuánto urge mostrarla. `Mencion` → 3, `Mensaje` → 2, `Sistema` → 1, `Promocion` → 0.\n\nNo uses `_` comodín: queremos que si mañana añades un tipo nuevo, el compilador te obligue a decidir su texto y su prioridad.',
							code: "enum TipoNotificacion {\n    // las 4 variantes aquí\n}\n\nimpl TipoNotificacion {\n    // método texto(&self) -> &str\n\n    // método prioridad(&self) -> u8\n}",
						},
					],
					tests:
						'fn main() {\n    let m = TipoNotificacion::Mensaje;\n    let men = TipoNotificacion::Mencion;\n    let s = TipoNotificacion::Sistema;\n    let p = TipoNotificacion::Promocion;\n\n    assert_eq!(m.texto(), "Tienes un nuevo mensaje", "Mensaje deberia mostrar \'Tienes un nuevo mensaje\'");\n    assert_eq!(men.texto(), "Te han mencionado", "Mencion deberia mostrar \'Te han mencionado\'");\n    assert_eq!(s.texto(), "Aviso del sistema", "Sistema deberia mostrar \'Aviso del sistema\'");\n    assert_eq!(p.texto(), "Oferta disponible", "Promocion deberia mostrar \'Oferta disponible\'");\n\n    assert_eq!(men.prioridad(), 3, "Mencion es la mas urgente: prioridad 3");\n    assert_eq!(m.prioridad(), 2, "Mensaje: prioridad 2");\n    assert_eq!(s.prioridad(), 1, "Sistema: prioridad 1");\n    assert_eq!(p.prioridad(), 0, "Promocion: prioridad 0");\n\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'enum TipoNotificacion {\n    Mensaje,\n    Mencion,\n    Sistema,\n    Promocion,\n}\n\nimpl TipoNotificacion {\n    fn texto(&self) -> &str {\n        match self {\n            TipoNotificacion::Mensaje => "Tienes un nuevo mensaje",\n            TipoNotificacion::Mencion => "Te han mencionado",\n            TipoNotificacion::Sistema => "Aviso del sistema",\n            TipoNotificacion::Promocion => "Oferta disponible",\n        }\n    }\n\n    fn prioridad(&self) -> u8 {\n        match self {\n            TipoNotificacion::Mencion => 3,\n            TipoNotificacion::Mensaje => 2,\n            TipoNotificacion::Sistema => 1,\n            TipoNotificacion::Promocion => 0,\n        }\n    }\n}',
				},
				{
					type: "exercise",
					title: "Estado de un pedido: máquina de estados con enum",
					language: "rust",
					prompt:
						'Estás modelando el ciclo de vida de un pedido en un e-commerce. Un pedido puede estar:\n\n- `Pendiente` (recién creado, sin información extra)\n- `Pagado` con el método de pago (`String`: "Tarjeta", "Transferencia", etc.)\n- `Enviado` con número de tracking (`String`)\n- `Entregado` con timestamp de entrega (`u64`, segundos UNIX)\n- `Cancelado` con razón (`String`)\n\nTu tarea:\n\n1. Define el enum `EstadoPedido` con esas 5 variantes.\n2. Implementa `descripcion(&self) -> String` que devuelva un mensaje legible por estado (ej: `"Pagado con Tarjeta"`, `"Enviado, tracking: ABC123"`).\n3. Implementa `esta_finalizado(&self) -> bool` que devuelva `true` solo para `Entregado` o `Cancelado`.\n\nUsa `match` exhaustivo. No uses `_` comodín — queremos que el compilador te avise si añades una variante nueva.',
					starterCode:
						'// TODO: definir enum EstadoPedido\n\nimpl EstadoPedido {\n    fn descripcion(&self) -> String {\n        // TODO\n        todo!()\n    }\n\n    fn esta_finalizado(&self) -> bool {\n        // TODO\n        todo!()\n    }\n}\n\nfn main() {\n    let pedidos = vec![\n        EstadoPedido::Pendiente,\n        EstadoPedido::Pagado(String::from("Tarjeta")),\n        EstadoPedido::Enviado(String::from("ABC123")),\n        EstadoPedido::Entregado(1_700_000_000),\n        EstadoPedido::Cancelado(String::from("Stock agotado")),\n    ];\n\n    for p in &pedidos {\n        println!("{} → finalizado: {}", p.descripcion(), p.esta_finalizado());\n    }\n}',
					solution:
						'enum EstadoPedido {\n    Pendiente,\n    Pagado(String),\n    Enviado(String),\n    Entregado(u64),\n    Cancelado(String),\n}\n\nimpl EstadoPedido {\n    fn descripcion(&self) -> String {\n        match self {\n            EstadoPedido::Pendiente => String::from("Pendiente"),\n            EstadoPedido::Pagado(metodo) => format!("Pagado con {}", metodo),\n            EstadoPedido::Enviado(tracking) => format!("Enviado, tracking: {}", tracking),\n            EstadoPedido::Entregado(ts) => format!("Entregado en t={}", ts),\n            EstadoPedido::Cancelado(razon) => format!("Cancelado: {}", razon),\n        }\n    }\n\n    fn esta_finalizado(&self) -> bool {\n        match self {\n            EstadoPedido::Pendiente => false,\n            EstadoPedido::Pagado(_) => false,\n            EstadoPedido::Enviado(_) => false,\n            EstadoPedido::Entregado(_) => true,\n            EstadoPedido::Cancelado(_) => true,\n        }\n    }\n}\n\nfn main() {\n    let pedidos = vec![\n        EstadoPedido::Pendiente,\n        EstadoPedido::Pagado(String::from("Tarjeta")),\n        EstadoPedido::Enviado(String::from("ABC123")),\n        EstadoPedido::Entregado(1_700_000_000),\n        EstadoPedido::Cancelado(String::from("Stock agotado")),\n    ];\n\n    for p in &pedidos {\n        println!("{} → finalizado: {}", p.descripcion(), p.esta_finalizado());\n    }\n}',
					hints: [
						"Una variante de enum puede contener datos: `Variante(Tipo)` (con paréntesis) o `Variante { campo: Tipo }` (campos nombrados). Aquí elegimos la forma con paréntesis para simplicidad.",
						"Dentro del `match`, para extraer el dato de una variante usas el mismo patrón: `EstadoPedido::Pagado(metodo) => ...`. La variable `metodo` ya tiene el valor del `String`.",
						"Cuando no necesitas el dato (en `esta_finalizado`), usa `_` para descartar el contenido: `EstadoPedido::Pagado(_)`.",
					],
					explanation:
						"**Por qué esto es más seguro que strings o constantes:**\n\n- Si mañana añades `EstadoPedido::Devuelto`, el compilador **te obligará** a actualizar ambos métodos. Con strings hubieras tenido bugs silenciosos: el código antiguo no sabría qué hacer con el estado nuevo.\n- Cada variante **lleva su dato consigo**. No necesitas un campo `tracking_number` opcional al lado: solo existe cuando el pedido está `Enviado`.\n\n**Patrón a recordar (sum types):** los enums con datos en Rust son **uniones discriminadas** (lo que en TypeScript es `type X = A | B | C`). Te permiten modelar estados donde *cada estado tiene su propia información*. Es la herramienta más poderosa de modelado de Rust.\n\n**Esto es lo que diferencia Rust de muchos lenguajes:** en Python o Java terminarías con `status: str` + 5 campos nullables (`tracking: Optional[str]`, `paid_method: Optional[str]`, etc.). Aquí, imposible — el tipo te lo impide.",
				},
			],
		},
		{
			id: "m04_l04",
			moduleId: "m04",
			moduleSlug: "m04_structs_enums",
			order: 4,
			title: "Option: la ausencia explícita",
			blocks: [
				{
					type: "first-principles",
					title: "Option: la ausencia de valor como parte del diseño",
					problem:
						"A veces simplemente no hay valor: el usuario no existe, la lista está vacía, la búsqueda no encontró nada. Si fingimos que siempre hay algo, el error aparece tarde y lejos de su causa.",
					mentalModel:
						"`Option` dice “puede haber algo o nada”: `Some(valor)` cuando hay, `None` cuando no. Rust te obliga a mirar ambos caminos antes de usar el valor.",
					concreteExample:
						"Buscar un usuario por id puede no encontrar nada: `buscar(999)` devuelve `None`, y el compilador no te deja usarlo como si fuera un usuario real.",
					remember:
						"Rust no tiene `null`. La ausencia es explícita en el tipo, y el compilador te obliga a manejarla.",
				},
				{
					type: "challenge",
					conceptId: "m04-option",
					title: "Antes de leer: ¿y si no hay resultado?",
					prompt:
						'Dividir entre cero no tiene sentido. **Tu reto:** escribe `dividir(a: f64, b: f64) -> Option<f64>` que devuelva el resultado de `a / b`, pero que represente "no hay resultado válido" cuando `b` es 0.\n\nInténtalo y dale a Verificar. Después la idea de `Option`, `Some` y `None` te va a parecer obvia.',
					starterCode:
						'fn dividir(a: f64, b: f64) -> Option<f64> {\n    // ¿cómo dices "sí hay valor" o "no hay valor"?\n    \n}',
					tests:
						'fn main() {\n    assert_eq!(dividir(10.0, 2.0), Some(5.0));\n    assert_eq!(dividir(1.0, 0.0), None);\n    assert_eq!(dividir(9.0, 3.0), Some(3.0));\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"`Option<f64>` es un enum con dos variantes: `Some(valor)` cuando sí hay resultado y `None` cuando no. Tu función debe devolver una u otra según el caso.",
						'Usa un `if`: cuando `b == 0.0` devuelve `None`; en el resto de casos devuelve el resultado de la división **envuelto** en `Some(...)` — el valor nunca va "desnudo".',
					],
					solution:
						"fn dividir(a: f64, b: f64) -> Option<f64> {\n    if b == 0.0 {\n        None\n    } else {\n        Some(a / b)\n    }\n}",
					reveal:
						'`Option<f64>` es un tipo que dice: *"aquí puede haber un `f64`... o puede no haber nada"*. Tiene dos variantes:\n\n- `Some(valor)` → sí hay un valor (envuelto dentro)\n- `None` → no hay valor\n\n```rust\nfn dividir(a: f64, b: f64) -> Option<f64> {\n    if b == 0.0 {\n        None\n    } else {\n        Some(a / b)\n    }\n}\n```\n\nLo importante: quien llame a `dividir` **está obligado por el compilador** a manejar el caso `None`. No puede usar el resultado como si siempre hubiera un número. Así Rust elimina toda una categoría de errores (el famoso *null pointer* de otros lenguajes) desde el diseño. 👇',
				},
				{
					type: "text",
					body: '## El Problema: null, el error del billon de dolares\r\n\r\nTony Hoare, creador del concepto de `null`, lo llamo "mi error del billon de dolares". En lenguajes con null, cualquier variable puede ser null en cualquier momento, y olvidar verificarlo causa crashes:',
				},
				{
					type: "code",
					language: "javascript",
					code: "// JavaScript - null puede aparecer en cualquier lugar\r\nfunction getUser(id) {\r\n    // Podria devolver null si el usuario no existe\r\n    return database.find(id);\r\n}\r\n\r\nlet user = getUser(999);\r\nconsole.log(user.name); // TypeError: Cannot read property 'name' of null\r\n// El programa explota en produccion a las 3am",
					runnable: false,
				},
				{
					type: "text",
					body: '## La solución de Rust: Option<T>\r\n\r\nRust **no tiene null**. En su lugar, tiene el enum `Option<T>` que representa explícitamente "podría haber un valor o no":\r\n\r\n```\r\nenum Option<T> {\r\n    Some(T),    // Hay un valor de tipo T\r\n    None,       // No hay valor\r\n}\r\n```\r\n\r\n`Option` esta tan integrado en Rust que puedes usar `Some` y `None` directamente sin prefijo.',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn buscar_usuario(id: u32) -> Option<String> {\r\n    match id {\r\n        1 => Some(String::from("Ana")),\r\n        2 => Some(String::from("Carlos")),\r\n        3 => Some(String::from("Lucia")),\r\n        _ => None,  // Usuario no encontrado\r\n    }\r\n}\r\n\r\nfn main() {\r\n    // Patron basico: match\r\n    let usuario = buscar_usuario(2);\r\n    match &usuario {\r\n        Some(nombre) => println!("Encontrado: {}", nombre),\r\n        None => println!("Usuario no encontrado"),\r\n    }\r\n\r\n    // if let: cuando solo te interesa Some\r\n    if let Some(nombre) = buscar_usuario(1) {\r\n        println!("Usuario 1: {}", nombre);\r\n    }\r\n\r\n    // unwrap_or: valor por defecto si es None\r\n    let nombre = buscar_usuario(999).unwrap_or(String::from("Anonimo"));\r\n    println!("Usuario 999: {}", nombre);\r\n\r\n    // is_some() / is_none(): verificar sin extraer\r\n    println!("Existe usuario 1? {}", buscar_usuario(1).is_some());\r\n    println!("Existe usuario 5? {}", buscar_usuario(5).is_some());\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Métodos útiles de Option\r\n\r\nOption tiene muchos métodos que hacen el código más expresivo y conciso:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn dividir(a: f64, b: f64) -> Option<f64> {\r\n    if b == 0.0 {\r\n        None  // No se puede dividir por cero\r\n    } else {\r\n        Some(a / b)\r\n    }\r\n}\r\n\r\nfn main() {\r\n    // unwrap_or: proporcionar un valor por defecto\r\n    let r1 = dividir(10.0, 3.0).unwrap_or(0.0);\r\n    let r2 = dividir(10.0, 0.0).unwrap_or(0.0);\r\n    println!("10/3 = {:.2}, 10/0 = {}", r1, r2);\r\n\r\n    // map: transformar el valor interno sin sacarlo del Option\r\n    let resultado = dividir(10.0, 4.0)\r\n        .map(|v| format!("{:.2}", v))\r\n        .unwrap_or(String::from("Error"));\r\n    println!("10/4 = {}", resultado);\r\n\r\n    // and_then: encadenar operaciones que devuelven Option\r\n    let doble_division = dividir(100.0, 5.0)\r\n        .and_then(|r| dividir(r, 2.0));\r\n    println!("100/5/2 = {:?}", doble_division);\r\n\r\n    // unwrap_or_else: calcular valor por defecto perezosamente\r\n    let valor = dividir(10.0, 0.0)\r\n        .unwrap_or_else(|| {\r\n            println!("  (calculando valor por defecto...)");\r\n            -1.0\r\n        });\r\n    println!("Resultado: {}", valor);\r\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: "**¡Nunca uses `.unwrap()` en producción!**\r\n`.unwrap()` extrae el valor de un `Some`, pero si es `None`, **el programa se detiene con panic**. Es útil para prototipos y pruebas, pero en código real necesitas manejar el `None`. Mira la tabla siguiente con las alternativas concretas.",
				},
				{
					type: "text",
					body: '## Patrones recomendados en lugar de `.unwrap()`\r\n\r\n| Situación | Patrón preferido | Ejemplo |\r\n|---|---|---|\r\n| Tengo un valor por defecto | `.unwrap_or(default)` | `n.unwrap_or(0)` |\r\n| El default es caro de calcular | `.unwrap_or_else(\\|\\| ...)` | `n.unwrap_or_else(\\|\\| calcular())` |\r\n| Quiero ramificar Some/None | `match` o `if let` | `if let Some(x) = n { ... }` |\r\n| Quiero propagar el `None` al caller | `?` (si la función devuelve `Option`) | `let x = n?;` |\r\n| El `None` es realmente imposible aquí | `.expect("razón clara")` | `port.expect("CLI ya validó esto")` |\r\n\r\n`.expect()` es como `.unwrap()` pero te obliga a escribir **por qué** estás seguro de que no será `None`. Si igual ocurre, el mensaje aparece en el panic — mucho mejor que un crash silencioso.',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn primer_par(numeros: &[i32]) -> Option<i32> {\r\n    for &n in numeros {\r\n        if n % 2 == 0 {\r\n            return Some(n);\r\n        }\r\n    }\r\n    None\r\n}\r\n\r\nfn main() {\r\n    let lista = vec![1, 3, 7, 4, 9];\r\n\r\n    // 1. unwrap_or — valor por defecto\r\n    let par = primer_par(&lista).unwrap_or(-1);\r\n    println!("Primer par o -1: {}", par);\r\n\r\n    // 2. match — control completo\r\n    match primer_par(&lista) {\r\n        Some(n) => println!("Encontre el par: {}", n),\r\n        None => println!("No hay pares"),\r\n    }\r\n\r\n    // 3. if let — solo si me interesa el caso Some\r\n    if let Some(n) = primer_par(&lista) {\r\n        println!("Hay un par y vale {}", n);\r\n    }\r\n\r\n    // 4. expect — invariante documentado\r\n    let lista_no_vacia = vec![2, 4, 6];\r\n    let par = primer_par(&lista_no_vacia)\r\n        .expect("lista_no_vacia siempre tiene un par por construccion");\r\n    println!("Par garantizado: {}", par);\r\n}',
					runnable: true,
				},
				{
					type: "quiz",
					question: "¿Por qué Rust no tiene null?",
					options: [
						{
							text: "Porque es un lenguaje nuevo y null ya no se usa",
							correct: false,
						},
						{
							text: "Porque Option<T> obliga a manejar la ausencia de valor explícitamente, previniendo NullPointerException",
							correct: true,
						},
						{
							text: "Porque Rust no tiene punteros",
							correct: false,
						},
						{
							text: "Por razones de rendimiento",
							correct: false,
						},
					],
					explanation:
						"`Option<T>` hace la ausencia **visible en el tipo**: el compilador te obliga a manejar el caso `None` antes de usar el valor. Con `null`, cualquier referencia puede estar vacía sin que el tipo lo diga, y olvidar comprobarlo causa el clásico `NullPointerException` en runtime. Rust sí tiene punteros y referencias — lo que no tiene es ausencia implícita.",
				},
				{
					type: "quiz",
					question:
						"¿Qué ocurre si llamas `.unwrap()` sobre un valor que es `None`?",
					options: [
						{
							text: 'Devuelve un valor por defecto del tipo (0, "", etc.)',
							correct: false,
						},
						{
							text: "El programa se detiene con un panic en tiempo de ejecución",
							correct: true,
						},
						{
							text: "Devuelve null",
							correct: false,
						},
						{
							text: "No compila: el compilador detecta el None",
							correct: false,
						},
					],
					explanation:
						'`.unwrap()` significa "dame el valor o revienta": sobre `Some(v)` devuelve `v`, pero sobre `None` provoca un **panic** que aborta el programa. El compilador no puede detectarlo porque el contenido del `Option` solo se conoce en runtime — por eso en código real se prefiere `unwrap_or`, `match`, `if let` o `.expect("razón")`.',
				},
				{
					type: "callout",
					variant: "tip",
					body: "### Ficha de familia: combinadores de `Option` que **consumen** el Option\n\nYa los viste en acción arriba (`unwrap_or`, `map`, `and_then`...). Antes de practicarlos, lee su anatomía. **Todos toman `self`**: igual que aprendiste en Ownership, eso significa que **se comen el `Option`** — después de llamarlos, esa variable ya no existe. Esa es la conexión clave del módulo: un combinador que toma `self` mueve el `Option` adentro.\n\n| Método | Qué hace | Receptor | Devuelve | Trampa Py/JS |\n|---|---|---|---|---|\n| `.unwrap_or(def)` | Si es `Some(v)` da `v`; si es `None` da `def` | `self` → **consume** | el valor `T` (ya sin envolver) | No es `x ?? def` perezoso: `def` se evalúa **siempre**, aunque haya `Some` |\n| `.map(f)` | Transforma el `Some(v)` en `Some(f(v))`; deja `None` igual | `self` → **consume** | un `Option<U>` **nuevo** | No es `arr.map`: opera sobre 0 o 1 valor, no sobre una lista |\n| `.and_then(f)` | Encadena: `f` recibe `v` y **devuelve otro `Option`** | `self` → **consume** | el `Option<U>` que devolvió `f` | Como `flatMap`/optional chaining: evita acabar con `Option<Option<U>>` |\n\n> Lee el receptor: `self` = se lo come · `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio.\n\n**`.map` vs `.and_then`** (la confusión clásica): usa `.map(f)` cuando tu `f` devuelve un valor *normal* (`x * 2`). Usa `.and_then(f)` cuando tu `f` ya devuelve un `Option` (otra operación que puede fallar, como otra división). Si usaras `.map` con una función que devuelve `Option`, acabarías con `Option<Option<T>>` anidado.",
				},
				{
					type: "callout",
					variant: "tip",
					body: '### Ficha: sacar el valor (`.unwrap`/`.expect`) vs solo preguntar (`.is_some`)\n\n| Método | Qué hace | Receptor | Devuelve | Trampa Py/JS |\n|---|---|---|---|---|\n| `.unwrap()` | Saca el valor del `Some`; si es `None` **entra en pánico** y aborta | `self` → **consume** | el valor `T` | Como un `!` de TS que *sí* revienta en runtime: nunca en producción |\n| `.expect("razón")` | Igual que `.unwrap()` pero el pánico muestra tu mensaje | `self` → **consume** | el valor `T` | El texto documenta *por qué* creías imposible el `None` |\n| `.is_some()` | Pregunta si hay valor | `&self` → **presta** | `bool` | Es la **excepción**: solo mira, no consume — el `Option` sigue usable después |\n\n> Lee el receptor: `self` = se lo come · `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio.\n\n**El insight del módulo:** casi todos los combinadores (`unwrap`, `unwrap_or`, `map`, `and_then`, `expect`) toman `self`, así que **mueven el `Option` adentro y lo consumen** — por eso no puedes encadenar dos cosas sobre la misma variable ni reusarla después:\n\n```rust\nlet n: Option<u32> = Some(10);\nlet a = n.unwrap_or(0);  // n se consume aquí\n// let b = n.map(|x| x * 2);  // ERROR: n ya se movió\n```\n\n`.is_some()` es distinto: toma `&self`, **presta** el `Option` y te devuelve un `bool`, así que la variable sigue viva. Es la misma regla de Ownership de siempre, aplicada a `Option`.',
				},
				{
					type: "faded-exercise",
					conceptId: "m04-option-combinadores",
					title: "🟢 Guiado: encadena .map().unwrap_or() sobre un Option real",
					intro:
						"Vas a manejar un `Option` sin escribir un solo `match`: primero un valor por defecto con `.unwrap_or`, luego una transformación con `.map`, y al final los combinas en un caso de tienda real. Observa cómo cada combinador toma `self` y consume el `Option`.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** Un carrito guarda la cantidad como `Option<u32>` porque el campo puede faltar. `.unwrap_or(0)` consume el `Option` y te da el número directamente: el valor si era `Some`, o `0` si era `None`. Fíjate: tras `.unwrap_or`, ya no tienes un `Option`, tienes un `u32`.",
							code: "fn cantidad_en_carrito(cantidad: Option<u32>) -> u32 {\n    // Si el campo venía, usa su valor; si faltaba (None), usa 0.\n    cantidad.unwrap_or(0)\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** `.map(f)` transforma el `Some` por dentro y deja `None` intacto. Aquí queremos duplicar los puntos de fidelidad cuando existen. Rellena los `___`: el cierre recibe cada valor y debe devolver el doble.",
							code: "fn puntos_dobles(puntos: Option<u32>) -> Option<u32> {\n    // Some(21) -> Some(42) ; None -> None\n    puntos.___(|x| x ___ 2)\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Caso real de tienda: `precio_final` recibe el `precio` base y un `descuento: Option<u32>` (en la misma unidad). Si hay descuento, réstalo del precio; si no, devuelve el precio tal cual. Hazlo **sin `match` ni `if`**: encadena `.map(...)` (para restar cuando hay descuento) con `.unwrap_or(...)` (para caer en el precio base cuando es `None`).",
							code: "fn precio_final(precio: u32, descuento: Option<u32>) -> u32 {\n    // Pista: descuento.map(...).unwrap_or(...)\n    \n}",
						},
					],
					tests:
						'fn main() {\n    assert_eq!(precio_final(100, Some(30)), 70, "100 con descuento 30 deberia ser 70");\n    assert_eq!(precio_final(100, None), 100, "100 sin descuento deberia quedar en 100");\n    assert_eq!(precio_final(50, Some(50)), 0, "50 con descuento 50 deberia ser 0");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn precio_final(precio: u32, descuento: Option<u32>) -> u32 {\n    descuento.map(|d| precio - d).unwrap_or(precio)\n}",
				},
				{
					type: "exercise",
					title: "🟡 Aplica: configuración con valores por defecto",
					language: "rust",
					prompt:
						'Tu servidor lee la configuración de un archivo, pero los campos son **opcionales**: si el usuario no los escribe, llegan como `None` y tú debes aplicar un valor por defecto sensato.\n\nLlegan ya parseados así:\n- `puerto: Option<u16>` — `None` si el archivo no lo trae.\n- `host: Option<&str>` — `None` si el archivo no lo trae.\n\nTu tarea: completa estas tres funciones usando **`.unwrap_or(default)`** (sin `match` ni `if`):\n\n1. `puerto_o_default(puerto: Option<u16>) -> u16` → el puerto dado, o `8080` por defecto.\n2. `host_o_default(host: Option<&str>) -> &str` → el host dado, o `"localhost"` por defecto.\n3. `describir_config(host: Option<&str>, puerto: Option<u16>) -> String` → combina ambas usando las funciones anteriores y devuelve `"host:puerto"` (ej: `"localhost:8080"`).\n\nRecuerda: `.unwrap_or` toma `self`, así que **consume** el `Option` y te entrega el valor ya desenvuelto.',
					starterCode:
						'fn puerto_o_default(puerto: Option<u16>) -> u16 {\n    // TODO: el puerto, o 8080 si es None\n    todo!()\n}\n\nfn host_o_default(host: Option<&str>) -> &str {\n    // TODO: el host, o "localhost" si es None\n    todo!()\n}\n\nfn describir_config(host: Option<&str>, puerto: Option<u16>) -> String {\n    // TODO: combina host_o_default y puerto_o_default en "host:puerto"\n    todo!()\n}\n\nfn main() {\n    // Config completa\n    println!("{}", describir_config(Some("0.0.0.0"), Some(443)));\n    // Todo por defecto (archivo vacío)\n    println!("{}", describir_config(None, None));\n    // Solo host, puerto por defecto\n    println!("{}", describir_config(Some("db.local"), None));\n}',
					solution:
						'fn puerto_o_default(puerto: Option<u16>) -> u16 {\n    puerto.unwrap_or(8080)\n}\n\nfn host_o_default(host: Option<&str>) -> &str {\n    host.unwrap_or("localhost")\n}\n\nfn describir_config(host: Option<&str>, puerto: Option<u16>) -> String {\n    format!("{}:{}", host_o_default(host), puerto_o_default(puerto))\n}\n\nfn main() {\n    println!("{}", describir_config(Some("0.0.0.0"), Some(443)));\n    println!("{}", describir_config(None, None));\n    println!("{}", describir_config(Some("db.local"), None));\n}',
					hints: [
						"`.unwrap_or(default)` es justo lo que necesitas: `puerto.unwrap_or(8080)` devuelve el número si vino `Some`, o `8080` si vino `None`. No hace falta `match` ni `if`.",
						'Para el host el default es un texto literal: `host.unwrap_or("localhost")`. Como `host` es `Option<&str>` y el default es un `&str`, los tipos encajan.',
						'En `describir_config` no repitas la lógica: llama a `host_o_default(host)` y `puerto_o_default(puerto)` y únelos con `format!("{}:{}", h, p)`.',
					],
					explanation:
						'**Por qué esto aparece en código real:** casi toda app lee configuración (de un archivo, variables de entorno o flags) donde los campos pueden faltar. En Python/JS resolverías esto con `config.get("port", 8080)` o `port ?? 8080` — y nada te garantiza que recordaste el default en *todos* los sitios. En Rust, el tipo es `Option<u16>`: el compilador **no te deja** usar el puerto sin antes decidir qué hacer con el `None`. `.unwrap_or(8080)` es esa decisión, en una línea.\n\n**Lo que practicaste sobre Ownership:** `.unwrap_or` toma `self`, así que **consume** el `Option`. Eso está bien aquí porque solo necesitas el valor una vez. Si necesitaras consultar el `Option` *y* seguir usándolo, usarías `.is_some()` (que toma `&self`, presta) o un `match` sobre `&opt`.\n\n**Patrón a recordar:** `valor_opcional.unwrap_or(default_sensato)` es el idiom de "campo opcional con valor por defecto". Lo verás por todo el ecosistema: `env::var("PORT").ok().unwrap_or(...)`, opciones de `clap`, campos de `serde` con `#[serde(default)]`. Si el default fuera **caro** de construir (abrir una conexión, leer otro archivo), usarías `.unwrap_or_else(|| ...)` para calcularlo solo cuando de verdad haga falta.',
				},
			],
		},
		{
			id: "m04_l05",
			moduleId: "m04",
			moduleSlug: "m04_structs_enums",
			order: 5,
			title: "Result y el operador ?",
			blocks: [
				{
					type: "first-principles",
					title: "Result: cuando fallar es una posibilidad real",
					problem:
						"Muchas operaciones pueden fallar por motivos distintos: un archivo que no existe, un texto que no es un número, una red caída. Saber solo que “falló” no basta — necesitas saber por qué para reaccionar bien.",
					mentalModel:
						"`Result` es un sobre con dos caras: `Ok(valor)` si la operación salió bien, `Err(error)` con la causa si salió mal. El error es un dato más que viaja en el tipo de retorno, no una excepción invisible.",
					concreteExample:
						'Parsear `"42"` a número da `Ok(42)`. Parsear `"abc"` da `Err(...)` explicando que no es un número. Quien llama decide: reintentar, avisar al usuario o propagar el error hacia arriba.',
					remember:
						"`Option` dice si hay valor o no; `Result` además te dice por qué falló. Los errores son valores, y el compilador te obliga a mirarlos.",
				},
				{
					type: "challenge",
					conceptId: "m04-result-question",
					title:
						"🔴 Antes de leer: propaga el error sin escribir ni un `match`",
					prompt:
						"Escenario real: una calculadora recibe los dos operandos como **texto** (vienen de un formulario o de la línea de comandos, donde todo llega como `&str`). Tienes que dividir el primero entre el segundo, pero pueden pasar tres cosas:\n\n- el primer texto no es un número → error\n- el segundo texto no es un número → error\n- el segundo número es `0` → error (no se divide entre cero)\n\n**Tu reto:** completa `dividir_textos(a: &str, b: &str) -> Result<f64, String>`. Devuelve `Ok(resultado)` cuando todo va bien, y `Err(mensaje)` con una causa clara en cada fallo.\n\nIntenta encadenar los pasos con el operador `?` en vez de tres `match` anidados. Si todavía no lo dominas, peléate con esto — la lección de abajo encajará sola. Pista: `texto.trim().parse::<f64>()` devuelve un `Result`, y `.map_err(|e| e.to_string())` convierte su error en `String`.",
					starterCode:
						"fn dividir_textos(a: &str, b: &str) -> Result<f64, String> {\n    // 1. parsear `a` a f64 (puede fallar -> Err(String))\n    // 2. parsear `b` a f64 (puede fallar -> Err(String))\n    // 3. si el divisor es 0.0 -> Err(String)\n    // 4. devolver Ok(a / b)\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(dividir_textos("10", "2"), Ok(5.0), "10 / 2 deberia ser Ok(5.0)");\n    assert_eq!(dividir_textos("7.5", "2.5"), Ok(3.0), "7.5 / 2.5 deberia ser Ok(3.0)");\n    assert_eq!(\n        dividir_textos("9", "0"),\n        Err(String::from("no se puede dividir entre cero")),\n        "dividir entre cero deberia ser Err con ese mensaje exacto"\n    );\n    assert!(dividir_textos("abc", "2").is_err(), "\'abc\' no es numero: deberia ser Err");\n    assert!(dividir_textos("10", "xyz").is_err(), "\'xyz\' no es numero: deberia ser Err");\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"La función ya promete `Result<f64, String>`, así que **dentro** puedes usar `?`: cualquier `Err(String)` que aparezca saldrá solo de la función. Esa es la condición para usar `?`: la firma debe devolver `Result`.",
						"`a.trim().parse::<f64>()` devuelve `Result<f64, ParseFloatError>`. Ese error NO es `String`, así que el `?` no lo puede propagar tal cual. Conviértelo: `.map_err(|e| e.to_string())?`. Ahora sí, el error es `String` y el `?` lo deja salir.",
						'El divisor cero no es un error de parseo, es una regla de negocio: compruébalo con un `if` después de parsear y usa `return Err(String::from("no se puede dividir entre cero"));` con ese texto exacto.',
					],
					solution:
						'fn dividir_textos(a: &str, b: &str) -> Result<f64, String> {\n    let numerador: f64 = a.trim().parse().map_err(|e: std::num::ParseFloatError| e.to_string())?;\n    let denominador: f64 = b.trim().parse().map_err(|e: std::num::ParseFloatError| e.to_string())?;\n\n    if denominador == 0.0 {\n        return Err(String::from("no se puede dividir entre cero"));\n    }\n\n    Ok(numerador / denominador)\n}',
					reveal:
						'La clave es que la función **devuelve `Result`**, y eso te habilita el operador `?`:\n\n```rust\nfn dividir_textos(a: &str, b: &str) -> Result<f64, String> {\n    let numerador: f64 = a.trim().parse().map_err(|e: std::num::ParseFloatError| e.to_string())?;\n    let denominador: f64 = b.trim().parse().map_err(|e: std::num::ParseFloatError| e.to_string())?;\n\n    if denominador == 0.0 {\n        return Err(String::from("no se puede dividir entre cero"));\n    }\n\n    Ok(numerador / denominador)\n}\n```\n\nLee cada línea como una frase: *"parsea `a`; si falla, sal con ese error"*. El `?` hace el `return Err(...)` por ti.\n\n¿Por qué el `.map_err(...)`? Porque `.parse()` falla con un `ParseFloatError`, pero tu función promete `String` en el `Err`. El `?` solo puede propagar un error del **mismo tipo** que la firma; `.map_err` traduce `ParseFloatError → String` justo a tiempo. El divisor cero, en cambio, lo decides tú con un `if` y un `return Err(...)` manual.\n\n**Por qué esto aparece en código real:** todo lo que entra desde fuera (formularios web, argumentos de CLI, líneas de un archivo, campos de un JSON) llega como texto. Parsear-y-validar con `?` es el patrón que verás en cualquier handler de servidor o parser. Justo abajo lo desmontamos paso a paso. 👇',
				},
				{
					type: "text",
					body: '## Result<T, E>: operaciones que pueden fallar\r\n\r\nMientras `Option` representa "hay valor o no hay", `Result` representa "éxito o error con información":\r\n\r\n```\r\nenum Result<T, E> {\r\n    Ok(T),     // Operación exitosa, contiene el valor\r\n    Err(E),    // Error, contiene información del error\r\n}\r\n```\r\n\r\n`Result` se usa para operaciones que pueden fallar: leer archivos, parsear números, conexiones de red, etc.',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn parsear_edad(texto: &str) -> Result<u32, String> {\r\n    match texto.trim().parse::<u32>() {\r\n        Ok(edad) => {\r\n            if edad > 150 {\r\n                Err(format!("{} no es una edad valida", edad))\r\n            } else {\r\n                Ok(edad)\r\n            }\r\n        }\r\n        Err(_) => Err(format!("\'{}\' no es un numero valido", texto)),\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let pruebas = vec!["25", "abc", "200", "  42  ", "-5"];\r\n\r\n    for texto in pruebas {\r\n        match parsear_edad(texto) {\r\n            Ok(edad) => println!("\'{}\' -> Edad: {}", texto, edad),\r\n            Err(error) => println!("\'{}\' -> Error: {}", texto, error),\r\n        }\r\n    }\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## El operador ?: propagación elegante de errores\r\n\r\nEl operador `?` es azucar sintactica para: "si es Ok, extrae el valor; si es Err, devuelvelo inmediatamente". Elimina la necesidad de match anidados:',
				},
				{
					type: "callout",
					variant: "tip",
					body: "## Tres fichas para leer el operador `?` y sus dos ayudantes\n\nIgual que en Ownership leías el receptor de cada método, aquí hay tres herramientas que **consumen** el `Result`/`Option` (toman `self`): después de usarlas, ese valor ya no existe. Esa es la conexión con ownership — y es el insight del módulo.\n\n### El operador `?` — propaga el error y sale\n\n| | |\n|---|---|\n| **Qué hace** | Sobre `Ok(v)` saca `v` y sigue. Sobre `Err(e)` hace `return Err(e)` **de la función entera**, ahí mismo. |\n| **Receptor** | toma `self` → **consume** el `Result`. Por eso `let x = r?;` deja de poder usar `r` después. |\n| **Devuelve** | el valor de dentro del `Ok` (no un `Result`). El `Err` ya salió por la puerta de atrás. |\n| **Trampa Py/JS** | No es un `try/catch`: no hay bloque que capture nada. Es un *return temprano* disfrazado de signo de interrogación. Y **solo compila si tu función devuelve `Result`** (o `Option`) — porque el `Err` que propaga tiene que poder salir por el `return`. |\n\n### `.map_err(|e| ...)` — cambia el tipo del error\n\n| | |\n|---|---|\n| **Qué hace** | Si es `Err(e)`, reemplaza `e` por lo que devuelva tu closure (p.ej. un `String` claro). Si es `Ok`, lo deja intacto. |\n| **Receptor** | toma `self` → **consume** el `Result` y te da uno nuevo. |\n| **Devuelve** | un `Result<T, E2>` **NUEVO** con el error transformado. |\n| **Trampa Py/JS** | No toca el caso `Ok`, solo el `Err`. Se usa junto a `?` cuando el error original (ej. `ParseIntError`) no es del tipo que tu función promete devolver: `.map_err(\\|e\\| e.to_string())?` lo convierte a `String` para que el `?` pueda propagarlo. |\n\n### `.ok_or_else(|| ...)` — convierte un `Option` en `Result`\n\n| | |\n|---|---|\n| **Qué hace** | Sobre `Some(v)` da `Ok(v)`. Sobre `None` da `Err(...)` con el error que produzca tu closure. |\n| **Receptor** | toma `self` → **consume** el `Option`. |\n| **Devuelve** | un `Result<T, E>` **NUEVO**, listo para usar con `?`. |\n| **Trampa Py/JS** | Es el puente de `Option` (no hay valor) a `Result` (no hay valor *y aquí está el porqué*). El `_else` significa perezoso: solo construye el error si de verdad era `None`. La hermana `.ok_or(valor)` construye el error siempre. |\n\n> Lee el receptor: `self` = se lo come · `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio.\n\n**Regla de bolsillo:** casi todos los combinadores de `Result`/`Option` (`.unwrap`, `.unwrap_or`, `.map`, `.and_then`, `.map_err`, `.ok_or`, `.ok`) toman `self` → **consumen** el valor; por eso no puedes seguir usándolo después. Las excepciones que solo *prestan* (`&self`) son las que preguntan sin sacar nada: `.is_ok()`, `.is_some()`.",
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug)]\r\nstruct Config {\r\n    puerto: u16,\r\n    max_conexiones: u32,\r\n}\r\n\r\nfn parsear_config(puerto_str: &str, max_str: &str) -> Result<Config, String> {\r\n    // El ? extrae Ok o devuelve Err automaticamente\r\n    let puerto: u16 = puerto_str.parse()\r\n        .map_err(|_| format!("Puerto invalido: \'{}\'", puerto_str))?;\r\n    let max: u32 = max_str.parse()\r\n        .map_err(|_| format!("Max conexiones invalido: \'{}\'", max_str))?;\r\n\r\n    if puerto < 1024 {\r\n        return Err(String::from("Puerto debe ser >= 1024"));\r\n    }\r\n\r\n    Ok(Config {\r\n        puerto,\r\n        max_conexiones: max,\r\n    })\r\n}\r\n\r\nfn main() {\r\n    // Caso exitoso\r\n    match parsear_config("8080", "100") {\r\n        Ok(config) => println!("Config: {:?}", config),\r\n        Err(e) => println!("Error: {}", e),\r\n    }\r\n\r\n    // Caso con error\r\n    match parsear_config("abc", "100") {\r\n        Ok(config) => println!("Config: {:?}", config),\r\n        Err(e) => println!("Error: {}", e),\r\n    }\r\n\r\n    // Puerto invalido\r\n    match parsear_config("80", "100") {\r\n        Ok(config) => println!("Config: {:?}", config),\r\n        Err(e) => println!("Error: {}", e),\r\n    }\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## Desarmando el operador `?` paso a paso\n\nEl `?` parece magia, pero hace algo muy concreto en cada línea. Léelo así: *"saca el valor del `Ok` y sigue; pero si es `Err`, **sal de la función ahora mismo** devolviendo ese error"*. Es un `return` temprano disfrazado de signo de interrogación.\n\nMira qué pasa en `parsear_config` según la entrada:',
				},
				{
					type: "code",
					language: "text",
					code: '   parsear_config("8080", "100")    (todo bien)\n     puerto_str.parse()?   ->  Ok(8080)    el ? saca 8080 y SIGUE\n     max_str.parse()?      ->  Ok(100)     el ? saca 100 y SIGUE\n     puerto < 1024 ?       ->  no\n     devuelve  Ok(Config { puerto: 8080, max_conexiones: 100 })\n\n   parsear_config("abc", "100")     (el primer parse falla)\n     puerto_str.parse()?   ->  Err(...)    el ? hace RETURN Err AQUÍ MISMO\n     (las lineas de abajo NUNCA se ejecutan)\n     la funcion entera devuelve  Err("Puerto invalido: \'abc\'")',
					runnable: false,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Dos condiciones para que el `?` compile:**\n\n- Tu función **debe devolver `Result`** (o `Option`), porque el `?` necesita una puerta de salida por donde mandar el `Err`. Por eso no puedes usar `?` dentro de un `main` normal sin más.\n- El error que propaga el `?` debe ser del **mismo tipo** que el `Err` de tu firma. Si no coincide (ej. `.parse()` da `ParseIntError` pero tu función promete `String`), lo traduces con `.map_err(|e| ...)` **antes** del `?` — por eso ves `.map_err(...)?` encadenado.",
				},
				{
					type: "faded-exercise",
					conceptId: "m04-question-operator",
					title: "🟢 Práctica guiada: el operador `?`",
					intro:
						"Vas a ver el mismo trabajo —parsear un texto a número y propagar el error— escrito de tres formas, cada vez con menos código. Primero un ejemplo resuelto con `match`, luego reemplazas ese `match` por `?`, y al final escribes tú una función que parsea dos textos y los suma. Escenario real: validar entrada que siempre llega como `&str`.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** `parsear` convierte un texto a `i32`. `s.trim().parse::<i32>()` ya devuelve un `Result`, así que aquí solo hacemos `match`: en `Ok` reenviamos el número, en `Err` reenviamos el mismo error. Fíjate que el tipo de error de la función (`std::num::ParseIntError`) es **exactamente** el que produce `.parse::<i32>()`.",
							code: "fn parsear(s: &str) -> Result<i32, std::num::ParseIntError> {\n    match s.trim().parse::<i32>() {\n        Ok(numero) => Ok(numero),\n        Err(error) => Err(error),\n    }\n}",
						},
						{
							kind: "faded",
							instructions:
								'**Paso 2 — completa.** Ese `match` no hace más que "saca el valor o reenvía el error": justo lo que hace `?`. Reemplaza el `match` entero por una sola línea con `?`. Rellena los `___`. (Funciona porque la firma devuelve `Result` del mismo tipo de error.)',
							code: "fn parsear(s: &str) -> Result<i32, std::num::ParseIntError> {\n    let numero = s.trim().parse::<i32>()___;\n    ___(numero)\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `sumar_textos(a: &str, b: &str) -> Result<i32, std::num::ParseIntError>` que parsee `a` y `b` con `?` y devuelva su suma envuelta en `Ok`. Como ambos `.parse::<i32>()` producen el MISMO tipo de error que la firma, NO necesitas `.map_err` aquí: el `?` propaga el `ParseIntError` directamente.",
							code: "fn sumar_textos(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {\n    // parsea a con ?\n    // parsea b con ?\n    // devuelve Ok(suma)\n    \n}",
						},
					],
					tests:
						'fn main() {\n    assert_eq!(sumar_textos("3", "4"), Ok(7), "3 + 4 deberia ser Ok(7)");\n    assert_eq!(sumar_textos("  10 ", "5"), Ok(15), "con espacios alrededor, 10 + 5 deberia ser Ok(15)");\n    assert_eq!(sumar_textos("-2", "8"), Ok(6), "-2 + 8 deberia ser Ok(6)");\n    assert!(sumar_textos("x", "4").is_err(), "\'x\' no es numero: deberia ser Err");\n    assert!(sumar_textos("3", "").is_err(), "texto vacio no es numero: deberia ser Err");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn sumar_textos(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {\n    let x = a.trim().parse::<i32>()?;\n    let y = b.trim().parse::<i32>()?;\n    Ok(x + y)\n}",
				},
				{
					type: "callout",
					variant: "info",
					body: "**Option vs Result - ¿Cuándo usar cada uno?**\r\n- **Option<T>**: cuando la ausencia de valor NO es un error. Ejemplo: buscar un elemento que podría no existir.\r\n- **Result<T, E>**: cuando la ausencia de valor ES un error y quieres saber POR QUE fallo. Ejemplo: parsear un número, leer un archivo.\r\n- Ambos obligan a manejar el caso negativo. No puedes ignorarlos como en otros lenguajes.",
				},
				{
					type: "quiz",
					question:
						"Qué hace el operador `?` en una función ¿qué devuelve Result?",
					options: [
						{
							text: "Convierte un Result en un Option",
							correct: false,
						},
						{
							text: "Si es Ok extrae el valor; si es Err devuelve el error inmediatamente de la función",
							correct: true,
						},
						{
							text: "Ignora los errores",
							correct: false,
						},
						{
							text: "Imprime el error en la consola",
							correct: false,
						},
					],
					explanation:
						"`?` desenvuelve el `Ok(valor)` y deja seguir la ejecución, pero si encuentra un `Err(e)` hace `return Err(e)` inmediatamente desde la función actual. Es azúcar sintáctica para el `match` de propagación de errores: no los ignora ni los imprime, los **propaga** al caller.",
				},
				{
					type: "quiz",
					question:
						"Quieres parsear un string a número y, si falla, saber por qué falló. ¿Qué tipo de retorno es el adecuado?",
					options: [
						{
							text: "`Option<u32>`: con `None` basta",
							correct: false,
						},
						{
							text: "`Result<u32, E>`: el `Err(E)` lleva la información de por qué falló",
							correct: true,
						},
						{
							text: "`u32` usando 0 como valor centinela de error",
							correct: false,
						},
						{
							text: "`bool` indicando si funcionó",
							correct: false,
						},
					],
					explanation:
						'`Result` existe exactamente para esto: `Err(E)` transporta **la causa** del fallo (texto vacío, caracteres inválidos, fuera de rango...). `Option` solo dice "no hay valor" sin explicar por qué — útil cuando la ausencia es normal, no un error. Los valores centinela (0, -1) son el anti-patrón que `Option` y `Result` vinieron a eliminar.',
				},
				{
					type: "exercise",
					title: "Parsear coordenadas: encadenar Results con `?`",
					language: "rust",
					prompt:
						'Recibes coordenadas como string en formato `"lat,lng"` (ej: `"-12.0464,-77.0428"` = Lima). Necesitas parsearlas a un struct `Point { lat: f64, lng: f64 }`.\n\nEsto puede fallar de varias formas:\n- Falta la coma → error\n- Los números no son válidos → error\n- Lat fuera de rango [-90, 90] → error\n- Lng fuera de rango [-180, 180] → error\n\nTu tarea: implementa `parse_point` que devuelva `Result<Point, String>`. Usa el operador `?` para propagar los errores en lugar de matches anidados.',
					starterCode:
						'#[derive(Debug)]\nstruct Point {\n    lat: f64,\n    lng: f64,\n}\n\nfn parse_point(input: &str) -> Result<Point, String> {\n    // TODO: separar por \',\'\n    // TODO: parsear cada parte a f64 (puede fallar)\n    // TODO: validar rangos\n    todo!()\n}\n\nfn main() {\n    let inputs = [\n        "-12.0464,-77.0428",  // Lima, ok\n        "40.4168,-3.7038",    // Madrid, ok\n        "abc,def",            // inválido\n        "100,50",             // lat fuera de rango\n        "sin-coma",           // formato malo\n    ];\n\n    for s in inputs {\n        match parse_point(s) {\n            Ok(p) => println!("\'{}\' → {:?}", s, p),\n            Err(e) => println!("\'{}\' → ERROR: {}", s, e),\n        }\n    }\n}',
					solution:
						'#[derive(Debug)]\nstruct Point {\n    lat: f64,\n    lng: f64,\n}\n\nfn parse_point(input: &str) -> Result<Point, String> {\n    let (lat_str, lng_str) = input\n        .split_once(\',\')\n        .ok_or_else(|| format!("falta coma en \'{}\'", input))?;\n\n    let lat: f64 = lat_str\n        .trim()\n        .parse()\n        .map_err(|_| format!("lat inválida: \'{}\'", lat_str))?;\n\n    let lng: f64 = lng_str\n        .trim()\n        .parse()\n        .map_err(|_| format!("lng inválida: \'{}\'", lng_str))?;\n\n    if !(-90.0..=90.0).contains(&lat) {\n        return Err(format!("lat fuera de rango: {}", lat));\n    }\n    if !(-180.0..=180.0).contains(&lng) {\n        return Err(format!("lng fuera de rango: {}", lng));\n    }\n\n    Ok(Point { lat, lng })\n}\n\nfn main() {\n    let inputs = [\n        "-12.0464,-77.0428",\n        "40.4168,-3.7038",\n        "abc,def",\n        "100,50",\n        "sin-coma",\n    ];\n\n    for s in inputs {\n        match parse_point(s) {\n            Ok(p) => println!("\'{}\' → {:?}", s, p),\n            Err(e) => println!("\'{}\' → ERROR: {}", s, e),\n        }\n    }\n}',
					hints: [
						"`str::split_once(',')` devuelve `Option<(&str, &str)>`. Para convertirlo a `Result` usa `.ok_or_else(|| ...)` que añade un mensaje de error si era `None`.",
						"`.parse::<f64>()` devuelve `Result<f64, ParseFloatError>`. Para cambiar el tipo de error usa `.map_err(|_| ...)` con tu propio mensaje.",
						"Para validar el rango: `(-90.0..=90.0).contains(&lat)` — sí, los rangos de Rust tienen un método `.contains()`. El `!` al inicio es 'no contiene'.",
					],
					explanation:
						"**Por qué `?` es elegante aquí:**\n\nCompara con escribir match para cada paso:\n```rust\nlet (a, b) = match input.split_once(',') {\n    Some(v) => v,\n    None => return Err(\"falta coma\".to_string()),\n};\nlet lat = match a.parse() {\n    Ok(v) => v,\n    Err(_) => return Err(\"lat inválida\".to_string()),\n};\n// ... etc\n```\nVs con `?`:\n```rust\nlet (a, b) = input.split_once(',').ok_or(...)?;\nlet lat: f64 = a.parse().map_err(...)?;\n```\n\nMisma lógica, **4 líneas vs 14**. Y más legible: cada `?` dice 'esto puede fallar, si falla salgo'.\n\n**Patrón a recordar:**\n- `Option<T>` → `Result<T, E>` con `.ok_or(e)` o `.ok_or_else(|| e)`.\n- `Result<T, E1>` → `Result<T, E2>` con `.map_err(|e| ...)`.\n- Encadena con `?` cuando todas las operaciones devuelven `Result` con el **mismo tipo de error**.\n\n**Esto es exactamente cómo se ven los parsers en código Rust real.** En `serde`, `nom`, `clap`, verás `?` por todos lados.",
				},
			],
		},
	],
};

export default module;
