// GRAB VARIOUS CONTAINERS AND BUTTONS
const startQuiz = document.querySelector("#startQuiz");     // invitation section
const startBtn = document.querySelector("#startBtn");   // "Start Quiz" button
const quiz = document.querySelector("#quiz");           // quiz section
const enterScore = document.querySelector("#enterScore");   // enter score section
const highScores = document.querySelector("#highScores");   // high scores section
const scoresTable = document.querySelector("#scores");  // high scores table
const retakeBtn = document.querySelector("#back");      // retake quiz button
const clearBtn = document.querySelector("#clear");      // clear high scores button
const viewBtn = document.querySelector("#viewScores");  // show high scores button
const submitBtn = document.querySelector("#submitScore");   // submit score
const timeLeft = document.querySelector("#timeRemaining");  // span to show result
const finalScore = document.querySelector("#finalScore");   // span to show score
const initials = document.querySelector("#enterInits");     // input to grab initials


const sections = [ startQuiz, quiz, enterScore, highScores ]    // iterable array of sections

const startingTime = 30;        // clock starts at this time
const penalty = 5;              // amount of seconds penalty for wrong answer


initialize();


// Set up all the listeners on the various buttons

function initialize() {
    startBtn.addEventListener("click", function() {
        takeQuiz();
    })
    viewBtn.addEventListener("click", function() {
        showResults();
    });
    clearBtn.addEventListener("click", function() {
        clearScores();
    });
    retakeBtn.addEventListener("click", function() {
        takeQuiz();
    });
    drawResults();
 }




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

        // flash the result
        showResult(true);

        // mark the question as having been answered
        quizQs[questionNumber].answered = true;

        // record which option was clicked
        quizQs[questionNumber].options[e.target.dataset.nth].clicked=true;

        totalRight++;
        console.log("correct!");
        if( (questionNumber + 1) == quizQs.length) {
            // this was the last question
            endQuiz(true);
        }
        else {
            questionNumber++;
            newQ(quizQs[questionNumber]);
        }
    }
    
    // Function for when a user answers a question incorrectly
    let wrongAnswer = function(e) {
        e.preventDefault();

        // flash the result
        showResult(false);

        // mark the question as having been answered
        quizQs[questionNumber].answered = true;

        // record which option was clicked
        quizQs[questionNumber].options[e.target.dataset.nth].clicked=true;

        // remove penalty seconds from timer
        timeRemaining -= penalty;
        stopClock();    // so user won't flip if clock was about to turn 

        // check if that exhausts the timer
        if (timeRemaining <=0) {
            timeRemaining = 0;
            questionNumber++;
            endQuiz();
            updateClock(0);
            return;
        } else {
            updateClock(timeRemaining);
            startClock();
        }

        if( (questionNumber + 1) == quizQs.length) {
            // this was the last question
            endQuiz(true);
        }
        else {
            questionNumber++;
            newQ(quizQs[questionNumber]);
        }
    }

    let stopQuiz = function() {
        endQuiz(false, true);
    }

    /* END FUNCTION EXPRESSIONS */



    shuffleMe(quizQs);
    initQuiz();
    // Start the quiz by calling the first question
    newQ(quizQs[0]);



    /* FUNCTION DECLARATIONS */
    
    // Function that "clears the decks" and starts the timer
    function initQuiz() {
        showSection(quiz);
        timer.textContent = convertToTime(timeRemaining);   // set the timer view to start
        $(options).toggleClass("visible", true);     // show the quiz options container
        mainTimer = setInterval(countdown, 1000);       // start the main countdown

        // add a listener to View High Scores that stops the quiz
        viewBtn.addEventListener("click", stopQuiz);
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
    function endQuiz(finished, stopShort) {
        // stop the timer
        stopClock();
        console.log("All done!");
        timer.textContent = "";

        // remove event listeners from all option buttons
        let opts = options.getElementsByTagName("LI");
        for (let i = 0; i < opts.length; i++) {
            opts[i].removeEventListener("click", correctAnswer);
            opts[i].removeEventListener("click", wrongAnswer);
        }

        if (!stopShort) {
            saveResults({ results: quizQs, correct: totalRight, answered: finished?(questionNumber + 1):questionNumber, left: timeRemaining });
        }

        // remove the quiz-specific listener from "View High Scores"
        viewBtn.removeEventListener("click", stopQuiz);
    }

    // Utilities to start and stop the clock to make coe more readable
    function startClock() {
        mainTimer = setInterval(countdown, 1000);
    }

    function stopClock() {
        clearInterval(mainTimer);
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

    // Utility that flashes the result of the question
    function showResult(correct) {
        // set the content
        result.textContent = correct?"Correct":"Incorrect";

        // which class
        let newClass = correct?"correct":"wrong";

        // add the class, and then reset after a half second
        $(result).addClass(newClass);
        setTimeout(function() {
            $(result).removeClass(newClass);
            result.textContent = "";
            }, 500);
    }

    // Utility that updates the user view of time remaining
    function updateClock(remaining) {
        timer.textContent = convertToTime(remaining);
    }
 
    /* END FUNCTION DECLARATIONS */
    
}

function saveResults(summary) {
    // temporarily add listener to submit button
    submitBtn.addEventListener("click", addScore);
    showSection(enterScore);

    timeLeft.textContent = (summary.left==0)?"You ran out of time.":("You had " + convertToTime(summary.left) + " remaining");

    let phrase = (summary.answered == summary.correct)?("all " + summary.correct + " right."):(summary.correct + " right.");
    finalScore.textContent = "You answered " + summary.answered + " questions, and got " + phrase;

    function addScore() {
        // if the initials value is empty, amscray
        // (recursion to avoid multiple listeners on the button)
        if (initials.value.length == 0) {
            submitBtn.removeEventListener("click", addScore);
            saveResults(summary);
            return;
        }
        // add the initials the user added and the date
        summary.inits = initials.value;
        summary.date = new Date();

        // set the "scores" array to the current high scores, if any
        let scores = [];
        console.log(scores);
        if(typeof(localStorage.getItem("highScores"))=="string") {
            console.log("There are high scores");
            console.log(localStorage.getItem("highScores"));
            scores = JSON.parse(localStorage.getItem("highScores"));
        }

        // add the latest result to the array, and then store
        scores.push(summary);
        localStorage.setItem("highScores", JSON.stringify(scores));
        submitBtn.removeEventListener("click", addScore);
        drawResults();
        showResults();
     }
}

function showResults() {
    showSection(highScores);
}

function drawResults() {
    let tableBody = scoresTable.querySelector("tbody");
    $(tableBody).empty();

    let storedScores = localStorage.getItem("highScores");
    console.log(storedScores);

    // If there are no high scores to show don't show them
    if (typeof(storedScores) != "string") {
        console.log("About to write the empty row");
        addRow(false);
        return;
    }

    // parse the string, then sort by score
    storedScores = JSON.parse(storedScores);
    storedScores.sort(function(a, b) { 
        if (a.correct == b.correct) return ( b.left - a.left );
        else return ( b.correct - a.correct )
    });

    // iterate over the scores, and add rows
    for (let i = 0; i < storedScores.length; i++) {
        addRow(storedScores[i]);
    }

    // function to add a row
    function addRow(data) {
        console.log(data);
        let newRow = document.createElement("TR");
        if (!data) {
            let emptyCell = document.createElement("TD");
            emptyCell.setAttribute("colspan", 4);
            emptyCell.textContent = "No scores to show"
            emptyCell.className = "no-scores";
            newRow.appendChild(emptyCell);
        } else {
            for ( let i = 0; i < 4; i++ ) {
                newRow.appendChild(document.createElement("TD"));
            }
            newRow.childNodes[0].textContent = convertToDate(data.date);
            newRow.childNodes[1].textContent = data.inits;
            newRow.childNodes[2].textContent = data.answered;
            newRow.childNodes[3].textContent = data.correct;
        };
        tableBody.appendChild(newRow);
    }
}

function clearScores() {
    localStorage.removeItem("highScores");
    drawResults();
    showResults();
}


// This iterates over all the sections, hides them all except the requested one
function showSection(show) {
    for ( let i = 0; i < sections.length; i++ ) {
        if ( sections[i] == show ) {
            $(sections[i]).toggleClass("visible", true);
        } else {
            $(sections[i]).toggleClass("visible", false);
        }
    }
}

// Utility that takes a total number of seconds and returns a m:ss string
function convertToTime(secs) {
    let minutes = (Math.floor(secs/60));
    let seconds = secs % 60;
    let timeString = minutes + ":" + ((seconds<10)?"0":"") + seconds;
    return timeString;
}

// Utility that takes a standard date string and converts to presentable format
function convertToDate(dateString) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let dateTime = dateString.split("T");
    let justDate = dateTime[0].split("-");
    let reformattedDate = months[(justDate[1]-1)] + " " + parseInt(justDate[2]) + ", " + justDate[0];
    return reformattedDate;
}