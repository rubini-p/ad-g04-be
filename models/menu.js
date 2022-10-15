// WIP Armar el modelo de menu
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RecetaSchema = new Schema({
    // _id: {
    //     type:  Number,
    // },
    nombre_receta: {
        type: String,
    },
    ingredientes_ppal: {
        type: [String],
    },
    ingredientes: {
        type: [String],
    },
    categoria: {
        type: String,
    },
    dificultad: {
        type: Number,
    },
    status: {
        type: String,
    },
    Proceso: {
        type: String,
    },
    Intro: {
        type: String,
    },
    rating: {
        type: Number,
    },
    avatarUrl: {
        type: String,
    },
    coverUrl: {
        type: String,
    },
    creador: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
},
    {
        versionKey: false,
    });


module.exports = Item = mongoose.model('Receta', RecetaSchema);


    //
    // "id": 1,
    // "nombre_receta": "Alfajores de Maicena",
    // "ingredientes_ppal": "Maicena, Dulce de leche, Coco",
    // "ingredientes": ["- 150 gr de Maicena\n", "100 gr de harina 0000\n", "80 gr de azucar", "100 gr de manteca", "2 yemas de huevo", "1 cucharadita de polvo para hornear", "Esencia de vainilla", "Dulce de leche respostero", "coco rallado"],
    // "categoria": "Postre",
    // "dificultad": "3",
    // "status": "Publicada",
    // "Proceso": "1) En un bol de su preferencia, vamos a poner la manteca (a temperatura ambiente), el azúcar y unas gotitas de esencia de vainilla. Vamos a mezclar todo hasta que esté bien incorporado. Pueden utilizar una batidora eléctrica o hacerlo a mano. 2) Una vez que tengamos armada una especie de pomada, vamos a agregar las dos yemas de huevo y vamos a volver a batir. 3) Llegó el momento de incorporar la harina y nuestra protagonista, la maicena. Si pueden hacerlo con un tamizado de por medio, mucho mejor. También vamos a agregar una pizca de polvo para hornear. 4) Ahora sí, vamos a meter mano en el asunto. En el bol hasta que los ingredientes secos esté bastante incorporados con los húmedos y luego vamos a continuar en la mesada hasta que nos quede una masa bien homogénea. 5) Vamos a dejar reposar nuestra masa unos 15 minutos aproximadamente. 6) Pasado este tiempo, vamos a pasar al estirado de la masa. Para eso vamos a utilizar lo que en este canal nos gusta llamar: La técnica de los capos consiste en lo siguiente: Vamos a estirar una buena cantidad de papel film sobre la mesada. Por encima, colocamos nuestro bollo y luego por encima otra buena cantidad de papel film. Así, entre estas dos láminas, vamos a proceder a aplastar y estirar nuestra masa. Primero con las manos y luego con el palo de amasar hasta que esté bastante chatita. 7) Retiramos la parte de arriba del film y con un cortante redondo (también pueden usar cosas similares como un vaso) procedemos a armar nuestras tapitas y a medida que lo vamos haciendo, las vamos colocando en un recipiente para horno. Tengan mucho cuidado al manipular las tapitas porque la masa es muy sensible y se pone a llorar por cualquier cosa. Van a ver que les sobra masa, en ese caso la vuelven a juntar, a estirar  y así sacan más alfajores de maicena. 8) Antes de llevarlas al horno y mientras este se calienta, vamos a llevar la masa a la heladera unos minutos. 9) Pasado este tiempo, las llevamos al horno 180º por aproximadamente 10 minutos. Tengan en cuenta que la temperatura del horno es muy importante para que no queden demasiado secos. 10) Una vez que vean que las tapitas están doraditas, las vamos a sacar. Una vez que estén frías, armamos nuestros alfajores de maicena colocando dulce de leche repostero sobre una tapita y colocando otra por encima. Si lo desean, pueden agregarle el coco rallado por al rededor. ¡Y listo!",
    // "Intro": "Los alfajores de maicena son uno de los dulces argentinos más clásicos, no faltan en los recreos ni en las meriendas, de hecho es una de las recetas para la merienda que menos se hace y que más tienta, porque claro, hacer repostería casera no es moco de pavo.",
    // "rating": 2.3,
    // "avatarUrl": `/static/mock-images/covers/cover_1.jpg`,
    // "coverUrl": `/static/mock-images/avatars/avatar_1.jpg`,