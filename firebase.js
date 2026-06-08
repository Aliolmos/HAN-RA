import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBciIDcGiFdr14K647Bp4whWUB-q5PaEVE",
    authDomain: "hanra-app.firebaseapp.com",
    projectId: "hanra-app",
    storageBucket: "hanra-app.firebasestorage.app",
    messagingSenderId: "28639788648",
    appId: "1:28639788648:web:784387316cb631de3685dd"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// Guardar testimonio en Firestore
window.guardarTestimonio = async function({ nombre, libro, texto }) {
    await addDoc(collection(db, "testimonios"), {
        nombre,
        libro,
        texto,
        fecha: serverTimestamp()
    });
};

// Cargar testimonios desde Firestore
window.cargarTestimonios = async function() {
    const q    = query(collection(db, "testimonios"), orderBy("fecha", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};