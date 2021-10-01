import 'bootstrap';
import './sass/main.scss';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import $ from 'jquery';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBHkh-ud3uZPD_w530Mav_o_AOBEO-E7mQ",
    authDomain: "kbr-shoot01.firebaseapp.com",
    databaseURL: "https://kbr-shoot01.firebaseio.com",
    projectId: "kbr-shoot01",
    storageBucket: "kbr-shoot01.appspot.com",
    messagingSenderId: "244138302237",
    appId: "1:244138302237:web:35fb29588977e6fc785ff4",
    measurementId: "G-YCV7TSS2R5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
console.log(firestore);
(async function(db){
        await getDocs(collection(db, "Blacklist")).then( (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} => ${doc.data()}`);
                });
            }
        );
    $('#form-submit-btn').on('click', async e => {
        e.preventDefault();
        var formData = {};
        const data = $('#blacklist-form').serializeArray();
        data.map((elem)=>{
            formData[elem.name] = elem.value;
            return true;
        });
        try {
            const docRef = await addDoc(collection(db, "Blacklist"), {
                name: formData.name,
                NIC: formData.nic,
                date: formData.date,
                blacklist_remark: formData.remark
            });
            console.log("Document written with ID: ", docRef.id);
        }catch(e){
            console.error("Error adding document: ", e);
        }
    });

})(firestore);