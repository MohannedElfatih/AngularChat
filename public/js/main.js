/*global angular */
/*global firebase*/
var app1 = angular.module('main', ['firebase', 'ngRoute', 'luegg.directives']);

var config = {
    apiKey: "AIzaSyDevYmwxc63JZ9Ut7zwYyFSvnOKYpREfpo",
    authDomain: "endless-theorem-135023.firebaseapp.com",
    databaseURL: "https://endless-theorem-135023.firebaseio.com",
    storageBucket: "endless-theorem-135023.appspot.com",
    messagingSenderId: "72986315816"
};
firebase.initializeApp(config);

app1.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: './views/startUp.html',
            controller: 'main'
        })
        .when('/main', {
            templateUrl: './views/main.html',
            controller: 'Test'
        })
        .otherwise({

        });
});

app1.directive('messagesData', ['$location', '$anchorScroll', function($location, $anchorScroll){
    return {
        scope: {
            message: "=",
        },
        template: '<p><span>{{message.name}}: </span>{{message.message}}</p>',
        restrict: 'E',
        compile: function(element, attrs) {
            console.log("compiler");
            document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
        },
        link: function(element, attrs) {
          document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
        }
    };
}]);

app1.controller('main', function($scope, $rootScope, $firebaseObject) {
    $scope.glued = true;
    const rootRef = firebase.database().ref();
    $scope.object = $firebaseObject(rootRef);
    $scope.firebasedataRef = firebase.database().ref().child("messages").limitToLast(30);
    console.log($rootScope.user);
    var user = firebase.auth().currentUser;
    $scope.firebasedataRef.on('value', snap => {
        console.log(snap.val());
        console.log(snap.numChildren());
        var counter = 0;
        $scope.messages = new Array();
        snap.forEach(function(childSnapshot) {
            console.log(childSnapshot.child('message').val());
            console.log(childSnapshot.child('name').val());
            $scope.messages.push({
                "name": childSnapshot.child('name').val(),
                "message": childSnapshot.child('message').val()
            });
        });
    });

    $scope.scrolldown = function() {
        console.log("scrolling");
        document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
    };


    $scope.submit = function() {
        var pushMessage = rootRef.child("messages").push();
        pushMessage.set({
            "message": $scope.textBox,
            "name": $rootScope.user.displayName
        });

        $scope.textBox = '';

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
        });
    };
});

app1.controller('Test', function($location, $scope, $rootScope, $firebaseObject) {
    const rootRef = firebase.database().ref();
    var object = $firebaseObject(rootRef);
    var provider = new firebase.auth.FacebookAuthProvider();
    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('fileButton');
    const logIn = document.getElementById('logIn');
    const logOut = document.getElementById('logOut');
    const connectFB = document.getElementById('connectFB');
    var signUp = document.getElementById('signUp');

    $scope.signUp = function(e) {
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(
            document.getElementById("username").value,
            document.getElementById("password").value);
        promise
            .then(user => {
                console.log(user)
                angular.element(document.querySelector('#notifyUser'))
                    .text("Signed up successfully.");
                angular.element(document.querySelector('#notifyUser'))
                    .className = "show";
                setTimeout(() => {
                    document.getElementById('notifyUser').className = 'hide';
                }, 6000);
            })
            .catch(e => console.log(e.message));
    };

    $scope.logIn = function(e) {
        $location.path("#main");
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(document.getElementById("username").value,
            document.getElementById("password").value);
        promise
            .then(user => {
                console.log(user);
            })
            .catch(e => console.log(e.message));
    };

    $scope.logOut = function(e) {
        firebase.auth().signOut();
    };

    $scope.connectFB = function(e) {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(result => {
                var token = result.credential.accessToken;
                var user = result.user;
                $location.path('/main');
                console.log(user);
            }).catch(e => {
                console.log("error code is " + e.code);
                console.log("error message is " + e.message);
                console.log("error email is " + e.email);
                console.log("error credential is " + e.credential);
            });
    };

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            $rootScope.user = firebaseUser;
            console.log(firebaseUser);
            $location.path('/main');
        } else {
            console.log('not logged in');
            $location.path('/');
        }
    });
});
