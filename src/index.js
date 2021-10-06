import 'bootstrap';
import './sass/main.scss';
import 'node-snackbar/src/sass/snackbar.sass';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import $ from 'jquery';

import validate from 'jquery-validation';
import Snackbar from 'node-snackbar';
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
(async function(db){
        window.candidates = [];
        await getDocs(collection(db, "Blacklist")).then( (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  window.candidates.push({id: doc.id, data : doc.data() });
                });
            $('.loader').fadeOut();
            }
        );

    $('#blacklist-form').validate({
        rules: {
            "name": { required: true },
            "date": { required: true },
            "remark": { required: true },
            "nic": { required: true , minlength:10, maxlength: 12}
        },
        messages: {
            name: { required: "Name field is required" },
            date: { required: "Black list date field is required" },
            remark: {required: "Blacklist remark  field is required"},
            nic: {required: 'NIC field is required'}
        }

    });
    $('#update-form').validate({
        rules: {
            "name": { required: true },
            "date": { required: true },
            "remark": { required: true },
            "nic": { required: true , minlength:10, maxlength: 12}
        },
        messages: {
            name: { required: "Name field is required" },
            date: { required: "Black list date field is required" },
            remark: {required: "Blacklist remark  field is required"},
            nic: {required: 'NIC field is required'}
        }

    });
    $('#form-submit-btn').on('click', async e => {
        e.preventDefault();
        var formData = {};
        if(!$('#blacklist-form').valid()){
            return;
        }
        const data = $('#blacklist-form').serializeArray();
        data.map((elem)=>{
            formData[elem.name] = elem.value;
            return true;
        });
        try {
            $('#blacklist-form').get()[0].reset();
            Snackbar.show({text: "Please Wait...", pos: 'bottom-center'});
            const docRef = await addDoc(collection(db, "Blacklist"), {
                name: formData.name,
                NIC: formData.nic,
                date: formData.date,
                blacklist_remark: formData.remark
            });
            Snackbar.show({text:`Document written with ID: ${docRef.id} `, pos: 'bottom-center', backgroundColor: '#198754'});
        }catch(e){
            Snackbar.show({text: `Error adding document: ${e}`, pos:'bottom-center', backgroundColor: '#dc3545'} );
        }
    });

    function autocompleteMatch(input) {
        if (input == '') {
            return [];
        }
        var ids = [];
        var names = window.candidates.map(function(k){
            ids.push(k.data.NIC);
            return k.data.name;
        });
        // var search_terms = [...ids, ...names];
        var search_terms = window.candidates;
        var reg = new RegExp(input)
        return search_terms.filter(function(term) {
            if (term.data.name.match(reg) || term.data.NIC.match(reg)) {
                return term;
            }
        });
    }

    function showResults(val) {
        var res = document.getElementById("result");
        res.innerHTML = '';
        let list = '';
        let terms = autocompleteMatch(val);
        for (var i=0; i<terms.length; i++) {
            list += '<li class="suggest-list" data-item="'+encodeURIComponent(JSON.stringify(terms[i]))+'">' + terms[i].data.name + "<span class='float-end text-muted small'>" + terms[i].data.NIC +"</span>" + '</li>';
        }
        res.innerHTML = '<ul>' + list + '</ul>';
    }
    $('#search-form input[name="q"]').on('keyup', function (e){
        showResults($(this).val());
    });
    $(document).on('click', '#result li', function(e){
        const item = JSON.parse(decodeURIComponent($(this).attr('data-item')));
        $('#search-form').get(0).reset();
        showResults("");
        console.log(item);
        $('#update-form').find('input[name="name"]').val(item.data.name);
        $('#update-form').find('input[name="nic"]').val(item.data.NIC);
        $('#update-form').find('input[name="date"]').val(item.data.date);
        $('#update-form').find('textarea[name="remark"]').val(item.data.blacklist_remark);
        $('#update-form').find('input[name="docid"]').val(item.id);

        slider.slide.left();
    });
    $(document).on('click', '.back-btn', (e)=>{
        e.preventDefault();
       slider.slide.right();
    });
    $(document).on('click', "#form-update-btn", async (e) =>{
        e.preventDefault();
        var formData = {};
        if(!$('#update-form').valid()){
            return;
        }
        const data = $('#update-form').serializeArray();
        data.map((elem)=>{
            formData[elem.name] = elem.value;
            return true;
        });
        Snackbar.show({text: "Please Wait...", pos: 'bottom-center'});
        try {
            const updateRef = doc(db, 'Blacklist', formData.docid);
            const res = await updateDoc(updateRef, {
                name: formData.name,
                NIC: formData.nic,
                date: formData.date,
                blacklist_remark: formData.remark
            });
            Snackbar.show({text:`Document updated with ID: ${formData.docid} `, pos: 'bottom-center', backgroundColor: '#198754'});
        }catch(e){
            Snackbar.show({text: `Error Updating document: ${e}`, pos:'bottom-center', backgroundColor: '#dc3545'} );
        }
    });
    $(document).on('click', '#form-delete-btn', async (e)=>{
        Snackbar.show({text: "Please Wait...", pos: 'bottom-center'});
        try{
            await deleteDoc(doc(db, 'Blacklist', $('input[name="docid"]').val()));
            Snackbar.show({text:`Document Deleted with ID: ${$('input[name="docid"]').val()} `, pos: 'bottom-center', backgroundColor: '#198754'});
            slider.slide.right();
        }catch (e) {
            Snackbar.show({text: `Error Deleting document: ${e}`, pos:'bottom-center', backgroundColor: '#dc3545'} );
        }

    });
    $(document).on('click', function(e){
       if(!$(e.target).hasClass('suggest-list')){
           $('#search-form').get(0).reset();
           showResults("");
       }
    });
    const  listSub = onSnapshot(collection(db, "Blacklist"), (snapshot)=>{
        window.candidates = [];
        snapshot.forEach((doc) => {
            window.candidates.push({id: doc.id, data : doc.data() });
        });
    });


    var slider = {
        elem : $('.slide-wrapper'),
        slide:{
            left: () => {
                $(slider.elem).animate({
                  "margin-left" : '-'+slider.elem.outerWidth()+'px'
                });
            },
            right: () =>{
                $(slider.elem).animate({
                    "margin-left" : '0px'
                });
            }

        }

    }

})(firestore);
