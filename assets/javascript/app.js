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

// Pulls individual train info from firebase and displays it in the Current Train Schedule table
function displayTrain() {

}

// MAIN PROCESS
// ==========================================================================================

$(document).ready(function() {
  // Runs the displayTrain function immediately when the page is ready so existing trains in 
  // the database are shown
  displayTrain();

  // When the add train button is clicked, the addTrain function is executed without refreshing
  // the page
  $("#add-train").on("click", function() {
    event.preventDefault();
    addTrain();
  });

  // Runs function when a new child is added to the database
  // 
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;

    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    var currentTime = moment();
    var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(firstTrainTimeConverted), "minutes");
    var timeRemainder = timeDifference % frequency;
    var minutesAway = frequency - timeRemainder;
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

    console.log(currentTime);
    console.log(minutesAway);
    console.log(nextArrival);

    var newRow = $("<tr>");
    var nameData = $("<td>").text(trainName);
    var destinationData = $("<td>").text(destination);
    var frequencyData = $("<td>").text(frequency);
    var nextArrivalData = $("<td>").text(nextArrival);
    var minutesAwayData = $("<td>").text(minutesAway);

    newRow.append(nameData);
    newRow.append(destinationData);
    newRow.append(frequencyData);
    newRow.append(nextArrivalData);
    newRow.append(minutesAwayData);
    $("#schedule").append(newRow);
  });

});
