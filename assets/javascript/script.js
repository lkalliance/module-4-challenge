// GRAB VARIOUS CONTAINERS
// div that contains the time remaining
const header = document.querySelector("#startQuiz");  // header and start button
const quiz = document.querySelector("#quiz");         // quiz section
const start = document.querySelector("#startBtn");    // "Start Quiz" button

const startingTime = 90;     // Clock starts at this time


start.addEventListener("click", function() {
    takeQuiz();
})


// Encasing everything to do with a quiz into
// its own function to avoid global variables

function takeQuiz() {
    // Declare some variables to scope them for this function
    let mainTimer;                                      // variable to hold setInterval
    let shuffledQs = shuffleMe(quizQs);                 // shuffle the questions
    let timeRemaining = startingTime;                             // initialize the timer
    let questionNumber = 0;                             // tracks what question we're on
    let timer = document.querySelector("#timer");       // countdown clock
    let question = document.querySelector("#question"); // quiz question
    let options = document.querySelector("#options");   // quiz answers
    let result = document.querySelector("#result");     // result indicator


    
    /* FUNCTION EXPRESSIONS */
    
    // Function that decrements the main countdown clock
    let countdown = function() {
        timeRemaining--;
        timer.textContent = convertToTime(timeRemaining);
        if(timeRemaining==0) {
            console.log("Time's up!");
            endQuiz();
        }
    }

    // Function for when a user answers a question correctly
    let correctAnswer = function(e) {
        e.preventDefault();
        console.log("correct!");
        if( (questionNumber + 1) == shuffledQs.length) {
            // this was the last question
            endQuiz();
        }
        else {
            questionNumber++;
            newQ(shuffledQs[questionNumber]);
        }
    }
    
    // Function for when a user answers a question incorrectly
    let wrongAnswer = function(e) {
        e.preventDefault();
        console.log("wrong!");
        if( (questionNumber + 1) == shuffledQs.length) {
            // this was the last question
            endQuiz();
        }
        else {
            questionNumber++;
            newQ(shuffledQs[questionNumber]);
        }
    }

    /* END FUNCTION EXPRESSIONS */



    initQuiz();
    // Start the quiz by calling the first question
    newQ(shuffledQs[0]);



    /* FUNCTION DECLARATIONS */
    
    // Function that "clears the decks" and starts the timer
    function initQuiz() {
        $("#startQuiz").toggleClass("visible", false);  // hide the "start quiz" section 
        timer.textContent = convertToTime(timeRemaining);   // set the timer view to start
        $(quiz).toggleClass("visible", true);        // show the quiz interface
        $(options).toggleClass("visible", true);     // show the quiz options container
        mainTimer = setInterval(countdown, 1000);       // start the main countdown
    }
    
    // Put a new question on the screen
    function newQ(q) {
        // Put in the new question text
        question.textContent = q.question;
        
        // empty the options list
        $(options).empty();

        // shuffle the questions answer options
        let shuffledOpts = shuffleMe(q.options);
                
        // create li for each option and put them in an array
        let optionLI;
        for (let i = 0; i < shuffledOpts.length; i++) {
            optionLI = document.createElement("LI");
            optionLI.textContent = shuffledOpts[i].text;
            options.appendChild(optionLI);
            if (shuffledOpts[i].correct) {
                optionLI.addEventListener("click", correctAnswer);
            } else {
                optionLI.addEventListener("click", wrongAnswer); 
            }
        };        
    }

    // Functions that tidies up after the quiz is over
    function endQuiz() {
        // stop the timer
        clearInterval(mainTimer);
        console.log("All done!");

        // remove event listeners from all option buttons
        let opts = options.getElementsByTagName("LI");
        for (let i = 0; i < opts.length; i++) {
            opts[i].removeEventListener("click", correctAnswer);
            opts[i].removeEventListener("click", wrongAnswer);
        }
    }

    // Utility that takes a total number of seconds and returns a m:ss string
    function convertToTime(secs) {
        let minutes = (Math.floor(secs/60));
        let seconds = secs % 60;
        let timeString = minutes + ":" + ((seconds<10)?"0":"") + seconds;
        return timeString;
    }

    // Utility that takes an array and shuffles it
    function shuffleMe(arr) {
        let oldArr = arr;
        let newArr = [];
        while (oldArr.length>0) {
            // take a random element from the old array, push it onto the new one
            newArr.push(oldArr.splice((Math.floor(Math.random()*oldArr.length)),1)[0]);
        }
        return newArr;
    }
 
    /* END FUNCTION DECLARATIONS */
    
}