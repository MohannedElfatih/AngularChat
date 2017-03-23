var config = {
    apiKey: "AIzaSyDevYmwxc63JZ9Ut7zwYyFSvnOKYpREfpo",
    authDomain: "endless-theorem-135023.firebaseapp.com",
    databaseURL: "https://endless-theorem-135023.firebaseio.com",
    storageBucket: "endless-theorem-135023.appspot.com",
    messagingSenderId: "72986315816"
};
firebase.initializeApp(config);
var provider = new firebase.auth.FacebookAuthProvider();
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');
const logIn = document.getElementById('logIn');
const logOut = document.getElementById('logOut');
const connectFB = document.getElementById('connectFB');

logIn.addEventListener('click', e => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(document.getElementById("username").value,
        document.getElementById("password").value);
    promise
        .then(user => console.log(user))
        .catch(e => console.log(e.message));
});

logOut.addEventListener('click', e=>{
    firebase.auth().signOut();
});

connectFB.addEventListener('click', e =>{
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result =>{
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user);
    }).catch(e =>{
        console.log("error code is " + e.code);
        console.log("error message is " + e.message);
        console.log("error email is " + e.email);
        console.log("error credential is " + e.credential);
    });
});

fileButton.addEventListener('change', function(e){
    var file = e.target.files[0];
    
    var storageRef = firebase.storage().ref('photos/' + file.name);
    
    var task = storageRef.put(file);
    
    task.on('state_changed', 
           function progress(snapshot){
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploader.value = percentage;
    },
            
            function error(e){
        
    },
            
            function complete(){
        
    });
});

firebase.auth().onAuthStateChanged(firebaseUser =>{
    if(firebaseUser){
        console.log(firebaseUser);
    } else {
        console.log('not logged in');
    }
});