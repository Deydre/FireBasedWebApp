let firebaseConfig = { 
    apiKey: "AIzaSyDUXRP7fah5PnvoUV02W7BsfKjqOJLh7oM",
    authDomain: "demoweb-46446.firebaseapp.com",
    projectId: "demoweb-46446",
    storageBucket: "demoweb-46446.appspot.com",
    messagingSenderId: "460314176652",
    appId: "1:460314176652:web:691c74421911536a0f9fa9"
  };
  
  firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase
  
  const db = firebase.firestore();// db representa mi BBDD //inicia Firestore
  
  //Función auxiliar para pintar una foto en el album
  const printPhoto = (title, url, docId) => {
    let card = document.createElement('article');
    card.setAttribute('class', 'card');
    let picture = document.createElement('img');
    picture.setAttribute('src', url);
    picture.setAttribute('style', 'max-width:250px');
    let caption = document.createElement('p');
    caption.innerHTML = title;
    let id = document.createElement('p');
    id.innerHTML = docId;
    const album = document.getElementById('album');
    card.appendChild(picture);
    card.appendChild(caption);
    card.appendChild(id);
    album.appendChild(card);
  };
  
  //Create
  const createPicture = (picture) => {
    db.collection("album")
      .add(picture)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
        readAll();
      })
      .catch((error) => console.error("Error adding document: ", error));
  };
  
  //Read all
  const readAll = () => {
    // Limpia el album para mostrar el resultado
    cleanAlbum();
  
    //Petición a Firestore para leer todos los documentos de la colección album
    db.collection("album")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          printPhoto(doc.data().title, doc.data().url, doc.id)
        });
  
      })
      .catch(() => console.log('Error reading documents'));;
  };
  
  //Delete
  const deletePicture = () => {
    const id = prompt('Introduce el ID a borrar');
    db.collection('album').doc(id).delete().then(() => {
      alert(`Documento ${id} ha sido borrado`);
      //Clean
      document.getElementById('album').innerHTML = "";
      //Read all again
      readAll();
    })
      .catch(() => console.log('Error borrando documento'));
  };
  
  //Clean 
  const cleanAlbum = () => {
    document.getElementById('album').innerHTML = "";
  };
  
  //Show on page load
  /* readAll(); */
  
  //**********EVENTS**********
  
  //Create
  document.getElementById("create").addEventListener("click", () => {
    const title = prompt("Introduce el título de tu foto");
    const url = prompt("Introduce la url de tu foto");
    if (!title || !url) {
      alert("Hay un campo vacio. No se ha salvado");
      return
    }
    createPicture({
      title,
      url,
    });
  });
  
  //Read all
  document.getElementById("read-all").addEventListener("click", () => {
    readAll();
  });
  
  //Read one
  document.getElementById('read-one').addEventListener("click", () => {
    const id = prompt("Introduce el id a buscar");
    readOne(id);
  });
  
  //Delete one
  document.getElementById('delete').addEventListener('click', () => {
    deletePicture();
  });
  
  //Clean
  document.getElementById('clean').addEventListener('click', () => {
    cleanAlbum();
  });
  
  //********FIRESTORE USERS COLLECTION******
  
  const createUser = (user) => {
    db.collection("users")
      .add(user)
      .then((docRef) => console.log("Document written with ID: ", docRef.id))
      .catch((error) => console.error("Error adding document: ", error));
  };
  
  /* const readAllUsers = (born) => {
    db.collection("users")
      .where("first", "==", born)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
        });
      });
  }; */
  
  // Read ONE
  function readOne(id) {
    // Limpia el album para mostrar el resultado
    cleanAlbum();
  
    //Petición a Firestore para leer un documento de la colección album 
    var docRef = db.collection("album").doc(id);
  
    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        printPhoto(doc.data().title, doc.data().url, doc.id);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  
  }
  
  /**************Firebase Auth*****************/
  
  /*
  
  const signUpUser = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        console.log(`se ha registrado ${user.email} ID:${user.uid}`)
        alert(`se ha registrado ${user.email} ID:${user.uid}`)
        // ...
        // Saves user in firestore
        createUser({
          id: user.uid,
          email: user.email,
          message: "hola!"
        });
  
      })
      .catch((error) => {
        console.log("Error en el sistema" + error.message, "Error: " + error.code);
      });
  };
  
  
  document.getElementById("form1").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;
  
    pass === pass2 ? signUpUser(email, pass) : alert("error password");
  })
  
  
  const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        console.log(`se ha logado ${user.email} ID:${user.uid}`)
        alert(`se ha logado ${user.email} ID:${user.uid}`)
        console.log("USER", user);
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
  }
  
  const signOut = () => {
    let user = firebase.auth().currentUser;
  
    firebase.auth().signOut().then(() => {
      console.log("Sale del sistema: " + user.email)
    }).catch((error) => {
      console.log("hubo un error: " + error);
    });
  }
  
  
  document.getElementById("form2").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email2.value;
    let pass = event.target.elements.pass3.value;
    signInUser(email, pass)
  })
  document.getElementById("salir").addEventListener("click", signOut);
  
  // Listener de usuario en el sistema
  // Controlar usuario logado
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(`Está en el sistema:${user.email} ${user.uid}`);
      document.getElementById("message").innerText = `Está en el sistema: ${user.uid}`;
    } else {
      console.log("no hay usuarios en el sistema");
      document.getElementById("message").innerText = `No hay usuarios en el sistema`;
    }
  });
  
  */
  
  