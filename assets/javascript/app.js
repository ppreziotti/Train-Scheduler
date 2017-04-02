// GLOBAL VARIABLES
// ==========================================================================================

// Initializing Firebase
var config = {
  apiKey: "AIzaSyC3v-tES1VD5URZ8SbfJLW7Iq2n70823aw",
  authDomain: "train-scheduler-ccaf7.firebaseapp.com",
  databaseURL: "https://train-scheduler-ccaf7.firebaseio.com",
  projectId: "train-scheduler-ccaf7",
  storageBucket: "train-scheduler-ccaf7.appspot.com",
  messagingSenderId: "72627344864"
};

firebase.initializeApp(config);

// Variable for referencing firebase
var database = firebase.database();

// FUNCTIONS
// ==========================================================================================

// Creates a train with a name, destination, first train time, and frequency pulled from the
// user input. The train is then stored in the firebase database and the user input fields
// are cleared.
function addTrain() {
  var newTrainName = $("#train-name").val().trim();
  var newDestination = $("#destination").val().trim();
  var newFirstTrainTime = $("#first-train-time").val().trim();
  var newFrequency = $("#frequency").val().trim();

  var newTrain = {
    trainName: newTrainName,
    destination: newDestination,
    firstTrainTime: newFirstTrainTime,
    frequency: newFrequency
  }

  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrainTime);
  console.log(newTrain.frequency);

  database.ref().push(newTrain);

  alert("Train added succesfully!");

  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");
}

// MAIN PROCESS
// ==========================================================================================

// When the add train button is clicked, the addTrain function is executed without refreshing
// the page
$("#add-train").on("click", function() {
  event.preventDefault();
  addTrain();
});