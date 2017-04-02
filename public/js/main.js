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

app1.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: './views/startUp.html',
            controller: 'main'
        })
        .when('/main', {
            templateUrl: './views/main2.html',
            controller: 'Test'
        })
        .otherwise({

        });
});

/*app1.directive('messagesData', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
        scope: {
            message: "=",
        },
        template: '<p><span class="testing">{{message.name}}: </span>{{message.message}}</p>',
        restrict: 'E',
        compile: function(element, attrs) {
            console.log("compiler");
            document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
        },
        link: function(element, attrs) {
            document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
        }
    };
}]);*/

app1.directive('messagesData', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
    return {
        scope: {
            message: "=",
        },
        templateUrl: './views/messageData.html',
        restrict: 'EA',
        compile: function (element, attrs) {
            console.log("compiler");
            document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
        },
        link: function (element, attrs) {
            document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
        }
    };
}]);

app1.directive('notifyUser', function () {
    return {
        scope: false,
        template: '<p id="notifyUser">{{notifyUser}}</p>',
        restrict: "E"
    }
});

app1.directive('leftChatMenu', function () {
    return {
        scope: false,
        templateUrl: './views/leftMenu.html',
        restrict: 'E'
    }
});

app1.directive('rightChat', function () {
    return {
        scope: false,
        templateUrl: './views/rightChat.html',
        restrict: 'E'
    }
});

app1.controller('main', function ($scope, $rootScope, $firebaseObject) {
    $scope.glued = true;
    $scope.notifyUser = "Welcome! Enter credentials to Sign up.";
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
        snap.forEach(function (childSnapshot) {
            console.log(childSnapshot.child('message').val());
            console.log(childSnapshot.child('name').val());
            $scope.messages.push({
                "name": childSnapshot.child('name').val(),
                "message": childSnapshot.child('message').val()
            });
        });
    });

    $scope.scrolldown = function () {
        console.log("scrolling");
        document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
    };

    $scope.signOut = function () {
        console.log("Am in signout function");
        firebase.auth().signOut()
            .then(function () {
                console.log("Signed out");
            }).catch(function (error) {
                console.log(error.message);
            });
    }

    $scope.send = function () {
        var pushMessage = rootRef.child("messages").push();
        pushMessage.set({
            "message": $scope.textBox,
            "name": $rootScope.user.displayName
        });

        $scope.textBox = '';
        
        document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
    };
});

app1.controller('Test', function ($location, $scope, $rootScope, $firebaseObject, $timeout) {
    const rootRef = firebase.database().ref();
    var object = $firebaseObject(rootRef);
    var provider = new firebase.auth.FacebookAuthProvider();
    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('fileButton');
    const logIn = document.getElementById('logIn');
    const logOut = document.getElementById('logOut');
    const connectFB = document.getElementById('connectFB');
    var signUp = document.getElementById('signUp');

    $scope.signUp = function (e) {
        $scope.notifyUser = "Signing Up...";
        var signUpTimeout = $timeout(function () {
            $scope.notifyUser = "An error happened, check credentials.";
        }, 5000);
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(
            document.getElementById("username").value,
            document.getElementById("password").value);
        promise.then(user => {
                console.log(user)
                $timeout.cancel(signUpTimeout);
                $scope.logIn();
            })
            .catch(e => {
                console.log(e.message)

            });
    };

    $scope.logIn = function (e) {
        $scope.notifyUser = "Logging in...";
        var logInTimeOut = $timeout(function () {
            $scope.notifyUser = "An error happened, check credentials.";
        }, 3000);
        const promise = firebase.auth().signInWithEmailAndPassword(document.getElementById("username").value,
            document.getElementById("password").value);
        promise.then(user => {
            $timeout.cancel(logInTimeOut);
            $location.path("/main");
            console.log(user);
        }).catch(e => {
            console.log(e.message);
        });
        console.log($scope.notifyUser);
    };

    $scope.connectFB = function (e) {
        $scope.notifyUser = "Logging in...";
        var provider = new firebase.auth.FacebookAuthProvider();
        const promise = firebase.auth().signInWithPopup(provider);
        promise.then(result => {
            var token = result.credential.accessToken;
            var user = result.user;
            $location.path("/main");
            $scope.$apply();
            console.log(user);
        }).catch(e => {
            console.log("error code is " + e.code);
            console.log("error message is " + e.message);
            console.log("error email is " + e.email);
            console.log("error credential is " + e.credential);
        });
    };

    firebase.auth().onAuthStateChanged(firebaseUser => {
        $rootScope.user = firebaseUser;
        if (firebaseUser) {
            $scope.notifyUser = "Logging in...";
            $location.path("/main");
            $rootScope.user = firebaseUser;
            console.log(firebaseUser);
        } else {
            $scope.notifyUser = "Enter info to Sign Up.";
            console.log('Enter info');
            $location.path('/');
        }
    });
});
