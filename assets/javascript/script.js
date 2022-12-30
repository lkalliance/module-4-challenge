// GRAB VARIOUS CONTAINERS
// div that contains the time remaining
let header = document.querySelector("#startQuiz");  // header and start button
let quiz = document.querySelector("#quiz");         // quiz section
let question = document.querySelector("#question"); // quiz question
let options = document.querySelector("#optios");    // quiz answers
let timer = document.querySelector("#timer");       // countdown clock
let start = document.querySelector("#startQuiz");   // "Start Quiz" button


let timeRemaining = 90;     // Clock starts at this time

console.log(quizQs);

start.addEventListener("click", function() {
    startQuiz();
    let mainTimer = setInterval( countdown, 1000);
})


// Function that manages the main countdown clock
let countdown = function() {
    timeRemaining--;
    timer.textContent = convertToTime(timeRemaining);
    if(timeRemaining==0) {
        console.log("Time's up!");
        clearInterval(mainTimer);
    }
}

// Takes a total number of seconds and returns a m:ss string
function convertToTime(secs) {
    let minutes = (Math.floor(secs/60));
    let seconds = secs % 60;
    let timeString = minutes + ":" + ((seconds<10)?"0":"") + seconds;
    return timeString;
}

// Generic "things to do when the quiz starts" function
function startQuiz() {
    $("#startQuiz").toggleClass("visible", false);
    timer.textContent = "1:30";
    $("#quiz").toggleClass("visible", true);
}