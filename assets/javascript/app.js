// GLOBAL VARIABLES
// ==========================================================================================
var newTrainName;
var newDestination;
var newFirstTrainTime;
var newFrequency;

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

// Runs the following logic once the page is ready
$(document).ready(function() {
  // When the add train button is clicked the addTrain function is executed without refreshing
  // the page. Checks are put into place in order to make sure the user input for each train
  // detail is valid before executing addTrain. If any input is not valid the user will 
  // receive an alert.
  $("#add-train").on("click", function() {
    event.preventDefault();

    newTrainName = $("#train-name").val().trim();
    newDestination = $("#destination").val().trim();
    newFirstTrainTime = $("#first-train-time").val().trim();
    newFrequency = $("#frequency").val().trim();

    // Authentication for train variables - train name and destination can only contain 
    // letters and spaces and must be between 3-20 characters, first train time must 
    // be entered in proper military time format, and frequency must be a positive 
    // whole number between 1 and 4 digits
    var checkTrainName = /^[A-Za-z\s]{3,20}$/;
    var checkDestination = /^[A-Za-z\s]{3,20}$/;
    var checkFirstTrainTime = /^([01]\d|2[0-3]):([0-5]\d)$/;//
    var checkFrequency = /^[0-9]{1,4}$/;

    if (!checkTrainName.test(newTrainName)) {
      alert("Please enter a valid train name.");
    }
    else if (!checkDestination.test(newDestination)) {
      alert("Please enter a valid destination.");
    }
    else if (!checkFirstTrainTime.test(newFirstTrainTime) || !moment(newFirstTrainTime, "hh:mm").isValid()) {
      alert("Please enter a valid first train time.");
    }
    else if (!checkFrequency.test(newFrequency) || newFrequency <= 0 || newFrequency % 1 != 0) {
      alert("Please enter a valid frequency.");
    }
    else {
      addTrain();
    }

  });

  // Runs function when a new child is added to the database, train info is pulled from the 
  // database and displayed in the Train Schedule panel
  // The next arrival time (converted into 12 hour format) and minutes away are calculated
  // with the help of Momentjs
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
    var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "days");
    console.log(firstTrainTimeConverted);
    var timeDifference = moment().diff(moment(firstTrainTimeConverted), "minutes");
    console.log(timeDifference)
    var timeRemainder = timeDifference % frequency;
    var minutesAway = frequency - timeRemainder;
    var nextArrival = moment().add(minutesAway, "minutes").format("h:mm A");

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
