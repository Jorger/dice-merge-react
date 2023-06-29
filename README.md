# 🎲 Dice Merge React

Dice Merge, es un juego de combinación que pondrá a prueba tu estrategia y habilidades de resolución de problemas. 
En este adictivo juego, tu objetivo es colocar dados en una cuadrícula de 5x5 y combinarlos para alcanzar el valor más alto posible.

# 🎓 Curso en Udemy.

![cover_course_dice_02](https://github.com/Jorger/dice-merge-react/assets/30050/dd7cc77e-3c57-493a-b2ba-f8605d45e997)

He preparado un curso en Udemy donde te enseño a desarrollar este juego:

# 🎮 URL del juego.

* Puedes jugar el juego terminado en la diguiente dirección: https://dice-merge-react.vercel.app/

## 📖 Reglas.

![Arrastre](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yzzod6vix968ymxumtjl.gif)

* **Arrastra los dados a una grilla de 5x5:** El objetivo de Dice Merge es colocar los dados en una grilla de 5 filas por 5 columnas. Para hacerlo, simplemente arrastra los dados a la posición deseada en la grilla.


![Combina dados](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rjs5mkn0hdqgr5cuiix1.gif)


* **Combina dados del mismo tipo:** Cuando un dado se coloca cerca de dos o más dados del mismo valor, se unirán para formar el siguiente valor. Por ejemplo, si tienes varios dados con el valor 4 cerca, se combinarán para formar dados con el valor 5.


![Seis combinado](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g7c9ky9qyv2609le0wo3.gif)

* **Combina dados hasta alcanzar el valor seis:** Cuando los dados con el valor seis se combinan, se crea un dado especial que combina todos los dados cercanos. Esto puede abrir nuevas oportunidades estratégicas para ti.


![Dados combinados](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jlw9vvwohw8mmchwahe2.gif)

* **Dados combinados desaparecen:** Una vez que realizas una combinación exitosa, el Dado combinado desaparece de la grilla. Esto libera espacio para que coloques mas dados y sigas buscando más combinaciones.

## 🎲 Dados de arrastre

* **Dados aleatorios:** En cada turno, se te entregará al azar uno o dos dados para arrastrar y colocar en la grilla. Estos dados pueden tener diferentes valores.

* **Orientación ajustable:** Si se te proporcionan dos dados, tienes la opción de girarlos para cambiar su orientación antes de colocarlos en la grilla. Esto te permite planificar tus movimientos estratégicamente y buscar las mejores combinaciones posibles.

## 💯 Puntuación.

La puntuación se basa en las combinaciones que realizas. Por ejemplo, si combinas tres dados con el valor 2, obtendrás una puntuación de seis.

![Múltiples Merges](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ar3598zsc3ryqedl7398.gif)

Sin embargo, si realizas múltiples combinaciones en el mismo turno, la puntuación se duplica. Por ejemplo, si combinas tres dados con el valor 1 (3 puntos) y luego combinas otros dados la puntuación se duplica, si logras tres combinaciones se triplica y así sucesivamente.

Cuando se hace merge de un dado combinado, obtienes **100 puntos**.

## 💪🏻 Ayudas.

El juego también incluye cuatro ayudas que puedes utilizar para mejorar tus posibilidades de éxito. Estas ayudas se renuevan diariamente y puedes usarlas según tus necesidades estratégicas.


![Deshacer](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tkbfdu6fpesb9celi5bf.gif)

* **Deshacer (Undo):** Esta ayuda te permite deshacer el último movimiento realizado. Puedes usarla hasta un máximo de 5 veces. Utilízala sabiamente para corregir errores o probar diferentes estrategias.

![Descartar](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/41rrarujtao59h6gl15m.gif)

* **Descartar (Trash):** Con esta ayuda, puedes descartar los dados que se te han entregado y obtener nuevos dados en su lugar. Esto puede ser útil si no encuentras una buena ubicación para los dados actuales. Al igual que con la ayuda de "Deshacer", puedes usarla hasta 5 veces.

![Bomba](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qs8vp08xljez1e7h9g8a.gif)

* **Bomba (Bomb):** La ayuda de la bomba te permite destruir un dado que ya se encuentra en la grilla. Esto puede ser útil si necesitas liberar espacio o deshacerte de un dado no deseado. Sin embargo, ten en cuenta que solo puedes usar la ayuda de la bomba hasta 3 veces.

![Dado Estrella](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6b5cdsv6zmn3ofvtpwfb.gif)

* **Dado Estrella (Star Die):** Esta ayuda especial te proporciona un dado que se puede combinar con cualquier otro dado en la grilla. Esto te brinda más opciones estratégicas y flexibilidad para realizar combinaciones. Al igual que con la ayuda de la bomba, puedes usar el Dado Estrella hasta 3 veces.

## 🤯 Desafíos del desarrollo:

El desarrollo de Dice Merge presentó varios desafíos interesantes que se superaron con éxito. Estos desafíos incluyen:

* **Implementación del arrastrar y soltar (drag and drop):** Para permitir a los jugadores arrastrar los dados a la grilla, se utilizó la biblioteca [dnd-kit](https://dndkit.com/). Esta biblioteca facilita la implementación del arrastrar y soltar en ReactJS y garantiza una interacción intuitiva y sin problemas.

* **Validación de combinaciones:** Se implementó un sistema de validación basado en [recursión](https://en.wikipedia.org/wiki/Recursion) para determinar si los dados vecinos o los dados recién colocados en la grilla pueden combinarse. Esto asegura que solo se realicen combinaciones válidas y evita movimientos incorrectos.

* **Manejo del estado y animaciones:** Para animar los dados y reflejar los cambios en la grilla, fue necesario gestionar el estado de manera eficiente. Se implementaron diferentes estados para los dados, lo que permitió animaciones suaves y una representación visual clara de las combinaciones realizadas.

* **Múltiples combinaciones:** Dice Merge permite realizar múltiples combinaciones en un solo turno si se crean nuevas combinaciones después de una combinación exitosa. Se implementó un evento de escucha que verifica los cambios en la grilla y determina si hay nuevas combinaciones posibles después de cada merge. Esto añade emoción y estrategia adicional al juego.

* **Interrupciones en las animaciones:** Aunque React actualiza automáticamente la interfaz de usuario después de un cambio de estado, en el caso de las animaciones CSS fue necesario establecer interrupciones para garantizar una experiencia visual fluida y agradable (no se hizo uso de librería para este proceso). Estas interrupciones se aplicaron cuidadosamente para que las animaciones se ejecuten correctamente y sin problemas.


# 👨🏻‍💻 Autor.

* Jorge Rubiano 
* https://bio.link/jorgerub
* [@ostjh](https://twitter.com/ostjh)
