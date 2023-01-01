// GRAB VARIOUS CONTAINERS
// div that contains the time remaining
const header = document.querySelector("#startQuiz");  // header and start button
const quiz = document.querySelector("#quiz");         // quiz section
const start = document.querySelector("#startBtn");    // "Start Quiz" button

const startingTime = 90;        // clock starts at this time
const penalty = 5;              // amount of seconds penalty for wrong answer


start.addEventListener("click", function() {
    takeQuiz();
})


// Encasing everything to do with a quiz into
// its own function to avoid global variables

function takeQuiz() {
    // Declare some variables to scope them for this function
    let mainTimer;                                        // variable to hold setInterval
    let timeRemaining = startingTime;                     // initialize the timer
    let questionNumber = 0;                               // tracks what question we're on
    let totalRight = 0;                                   // tracks how many correct answers
    const timer = document.querySelector("#timer");       // countdown clock
    const question = document.querySelector("#question"); // quiz question
    const options = document.querySelector("#options");   // quiz answers
    const result = document.querySelector("#result");     // result indicator


    
    /* FUNCTION EXPRESSIONS */
    
    // Function that decrements the main countdown clock
    let countdown = function() {
        timeRemaining--;
        updateClock(timeRemaining);
        if(timeRemaining<=0) {
            console.log("Time's up!");
            endQuiz();
        }
    }

    // Function for when a user answers a question correctly
    let correctAnswer = function(e) {
        e.preventDefault();

        // mark the question as having been answered
        quizQs[questionNumber].answered = true;

        // record which option was clicked
        quizQs[questionNumber].options[e.target.dataset.nth].clicked=true;

        totalRight++;
        console.log("correct!");
        if( (questionNumber + 1) == quizQs.length) {
            // this was the last question
            endQuiz();
        }
        else {
            questionNumber++;
            newQ(quizQs[questionNumber]);
        }
    }
    
    // Function for when a user answers a question incorrectly
    let wrongAnswer = function(e) {
        e.preventDefault();
        quizQs[questionNumber].answered = true;

console.log("Was this really wrong?");
console.log(quizQs[questionNumber].options[e.target.dataset.nth].correct);

        quizQs[questionNumber].options[e.target.dataset.nth].clicked=true;
        console.log("wrong!");

        // remove penalty seconds from timer
        timeRemaining -= penalty;
        stopClock();    // so clock doesn't get 

        // check if that exhausts the timer
        if (timeRemaining <=0) {
            timeRemaining = 0;
            endQuiz();
            updateClock(0);
            return;
        } else {
            updateClock(timeRemaining);
            startClock();
        }

        if( (questionNumber + 1) == quizQs.length) {
            // this was the last question
            endQuiz();
        }
        else {
            questionNumber++;
            newQ(quizQs[questionNumber]);
        }
    }

    /* END FUNCTION EXPRESSIONS */

    shuffleMe(quizQs);
    initQuiz();
    // Start the quiz by calling the first question
    newQ(quizQs[0]);



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

        // shuffle the question's answer options
        shuffleMe(q.options);
                
        // create li for each option, add text and listener
        let optionLI;
        for (let i = 0; i < q.options.length; i++) {
            optionLI = document.createElement("LI");
            optionLI.textContent = q.options[i].text;
            optionLI.setAttribute("data-nth",i);
            options.appendChild(optionLI);
            // check if this is the right answer and add appropriate callback
            if (q.options[i].correct) {
                optionLI.addEventListener("click", correctAnswer);
            } else {
                optionLI.addEventListener("click", wrongAnswer); 
            }
        };        
    }

    // Function that tidies up after the quiz is over
    function endQuiz(finished) {
        // stop the timer
        stopClock();
        console.log("All done!");

        // inform the user of the results
        question.textContent = ((timeRemaining)?"You finished all the questions":"You ran out of time") + " and you got " + totalRight + " correct.";
        if (finished) {
            $(options).empty();
        }
        console.log("You got " + totalRight + " correct!");

        // remove event listeners from all option buttons
        let opts = options.getElementsByTagName("LI");
        for (let i = 0; i < opts.length; i++) {
            opts[i].removeEventListener("click", correctAnswer);
            opts[i].removeEventListener("click", wrongAnswer);
        }

        saveResults(quizQs, totalRight, timeRemaining);
    }

    // Utilities to start and stop the clock to make coe more readable
    function startClock() {
        mainTimer = setInterval(countdown, 1000);
    }

    function stopClock() {
        clearInterval(mainTimer);
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
        let rand, temp;
        
        // start a counter at the end of the array
        let counter = arr.length;
        while (counter > 0) {
            // decrement counter
            counter--;
            // randomly pick an index up through the current counter
            rand = Math.floor(Math.random() * counter);
            // swap the random-index element with the counter element
            temp = arr[counter];
            arr[counter] = arr[rand];
            arr[rand] = temp;
        }

        // "dummy" return (array was shuffled in place)
        return false;
    }

    // Utility that updates the user view of time remaining
    function updateClock(remaining) {
        timer.textContent = convertToTime(remaining);
    }
 
    /* END FUNCTION DECLARATIONS */
    
}

function saveResults(summary, correct, finished) {
    console.log(summary);
    console.log("Going to ask to save results");

    // TEST: iterate over summary object and compare it's output
    // of correct answers vs. the incremented total
}