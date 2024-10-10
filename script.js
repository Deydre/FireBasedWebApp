// Credenciales de la BBDD
const firebaseConfig = {
  apiKey: "AIzaSyCjgqh_mQ0oduPSq_tqgUCK3NNzhpX6WHo",
  authDomain: "demoweb-dfb33.firebaseapp.com",
  projectId: "demoweb-dfb33",
  storageBucket: "demoweb-dfb33.appspot.com",
  messagingSenderId: "946005046680",
  appId: "1:946005046680:web:027a4111122fd14aeee7ed"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);//

// db representa mi BBDD //inicia FirestoreS
const db = firebase.firestore();

// ---- FUNCIONES AUXILIARES -----------------------------
// Crear user en la BBDD
const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Elemento escrito en BBDD. ID:", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

// Borrar lista DOM
const cleanContactList = () => {
  document.getElementById('contactList').innerHTML = "";
};


// ---- FUNCIONES --------------------------------------
// Pintar datos en el DOM
const printData = (nombre, email, mensaje, urlImagen) => {
  let card = document.createElement('article');
  card.setAttribute('class', 'card');

  let nombreContainer = document.createElement('h3');
  nombreContainer.innerHTML = nombre;

  let imgContainer = document.createElement('img');
  imgContainer.setAttribute('src', urlImagen);
  imgContainer.setAttribute('style', 'max-width:250px');

  let emailContainer = document.createElement('p');
  emailContainer.innerHTML = email;

  let mensajeContainer = document.createElement('p');
  mensajeContainer.innerHTML = mensaje;

  card.appendChild(nombreContainer);
  card.appendChild(imgContainer);
  card.appendChild(emailContainer);
  card.appendChild(mensajeContainer);
  document.getElementById('contactList').appendChild(card);
};


// Borrar lista DOM, leer los datos de la BBDD y pintarlos
const readAndPrintAll = () => {
  // Borrar lista DOM
  cleanContactList();

  // Leer datos de la BBDD
  db.collection("users")
    .get()
    .then((querySnapshot) => {
      console.log('Documents fetched:', querySnapshot.size);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Pintar todos con la función printData()
        printData(data.nombre, data.email, data.mensaje, data.urlImagen)
      });
    })
    .catch((e) => console.log('Error reading documents:', e.code));
};

// VER CÓMO USAR PARA BORRAR TODO ----------------
//Delete
const deletePicture = () => {
  const id = prompt('Introduce el ID a borrar');
  db.collection('users').doc(id).delete().then(() => {
    alert(`Documento ${id} ha sido borrado`);
    //Clean
    document.getElementById('contactList').innerHTML = "";
    //Read all again
    readAndPrintAll();
  })
    .catch(() => console.log('Error borrando documento'));
};

// Función para borrar todos los documentos de la colección "users"
const deleteAllContacts = () => {

  // Pedir confirmación
  const confirmation = confirm("¿Estás seguro de que deseas borrar todos los contactos?");
  
  if (confirmation) {
    // Obtenemos la referencia a la colección "users" y hacemos la consulta para obtener todos los documentos
    db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Eliminamos cada documento individualmente
        db.collection('users').doc(doc.id).delete().then(() => {
          console.log(`Documento ${doc.id} ha sido borrado.`);
        }).catch((error) => {
          console.error(`Error borrando el documento con ID ${doc.id}:`, error);
        });
      });

      // Limpia la lista de contactos
      document.getElementById('contactList').innerHTML = "";
      
      // Vuelve a cargar los contactos restantes (vacío si se han borrado todos)
      readAndPrintAll();

    }).catch((error) => {
      console.error("Error obteniendo los contactos:", error);
    });
  }
};

// Asignar función al evento de hacer click en BORRAR TODOS
document.getElementById("clearAll").addEventListener("click", deleteAllContacts);



// VER CÓMO USAR PARA BORRAR SOLO 1 ----------------
// // Read ONE
// function readOne(id) {
//   // Limpia el album para mostrar el resultado
//   cleanContactList();

//   //Petición a Firestore para leer un documento de la colección album 
//   var docRef = db.collection("users").doc(id);

//   docRef.get().then((doc) => {
//     if (doc.exists) {
//       console.log("Document data:", doc.data());
//       let data = doc.data();
//       printData(data.nombre, data.email, data.mensaje, data.urlImagen);
//     } else {
//       // doc.data() will be undefined in this case
//       console.log("No such document!");
//     }
//   }).catch((error) => {
//     console.log("Error getting document:", error.code);
//   });

// }

// ----------------------------


document.addEventListener("DOMContentLoaded", function () {
  // obtener referencias a los elementos en HTML
  let formularioDeContacto = document.getElementById("contactForm");
  // let listaDeContactos = document.getElementById("contactList");
  let botonBorrarTodos = document.getElementById("clearAll");
  
  // Leer los datos y pintarlos
  readAndPrintAll(); 

  // cuando el formulario se envía
  formularioDeContacto.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evitar que la página se recargue

    // obtener los valores que el usuario escribió
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let mensaje = document.getElementById("mensaje").value;
    let urlImagen = document.getElementById("imageUrl").value;

    // Crear en el DOM
    createUser({nombre, email, mensaje, urlImagen});

    formularioDeContacto.reset(); // reiniciar el formulario
    readAndPrintAll(); // actualizar la lista
  });

  // Evento para borrar todos los contactos
  botonBorrarTodos.addEventListener("click", function () {
    db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete(); // Borrar cada documento
      });
    }).then(() => {
      alert("Todos los contactos han sido borrados.");
      readAndPrintAll(); // Leer todos los contactos después de borrar todos
    });
  });

});
