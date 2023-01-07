// GRAB VARIOUS CONTAINERS AND BUTTONS
// Sections (or pages)
const jStartSection = $("#start-quiz-section");      // invitation section
const jQuizSection = $("#quiz-section");             // quiz section
const jEnterSection = $("#enter-score-section");     // enter score section
const jScoresSection = $("#high-scores-section");    // high scores section

// Buttons
const jStartBtn = $("#start-quiz-button");           // "Start Quiz" button
const jTryAgainBtn = $("#try-again-button");         // retake quiz button (from high scores)
const jNoSubmitBtn = $("#no-submit-button");         // don't submit, retake
const jClearBtn = $("#clear-button");                // clear high scores button
const jViewBtn = $("#view-scores-button");           // go to high scores button
const jSubmitBtn = $("#submit-score-button");        // submit score button
const jReviewBackBtn = $("#review-back");            // back button during review
const jReviewNextBtn = $("#review-next");            // next button during review
const jTryAgainRevBtn = $("#review-try-again");         // retake quiz button (from review)

// Other containers
const jScoresTable = $("#scores");                   // high scores table
const jTimeLeft= $("#time-remaining");               // span to show result
const jFinalScore = $("#final-score");               // span to show score
const jInitialsInput = $("#enter-inits");            // input to grab initials
const jTimer = $("#timer");                          // countdown clock container
const jQuestion = $("#question");                    // quiz question container
const jOptions = $("#options");                      // quiz answer options
const jResult = $("#result");                        // result indicator container

// iterable array of sections
const sections = [ jStartSection, jQuizSection, jEnterSection, jScoresSection ];  

const startingTime = 90;        // clock starts at this time
const penalty = 5;              // amount of seconds penalty for wrong answer


initialize();


// Set up all the listeners on the various buttons

function initialize() {
    jStartBtn.on("click", function() {
        takeQuiz();
    })
    jViewBtn.on("click", function() {
        showResults();
    });
    jClearBtn.on("click", function() {
        clearScores();
    });
    jTryAgainBtn.on("click", function() {
        takeQuiz();
    });
    jTryAgainRevBtn.on("click", function() {
        takeQuiz();
    });
    drawResults();
 }




/* ---- PAGE MANAGEMENT FUNCTIONS ---- */

// Each page has a function that manages the user experience for it


// TAKE THE QUIZ PAGE ------------------------------

function takeQuiz() {

    // INITIALIZATION

    // declare some variables to scope them for this function
    let mainTimer;                      // variable to hold setInterval
    let timeRemaining = startingTime;   // initialize the timer
    let questionNumber = 0;             // tracks what question we're on
    let totalRight = 0;                 // tracks how many correct
    
    // shuffle the order of the questions
    shuffleMe(quizQs);
    // show the user the correct page
    showSection(jQuizSection);
    jTimer.text(convertToTime(timeRemaining));      // set the timer view to start
    
    

    /* FUNCTION EXPRESSIONS */
    
    const countdown = function() {
        // this function tick-tock decrements the game timer
        timeRemaining--;
        updateClock(timeRemaining);
        if(timeRemaining<=0) {
            endQuiz();
        }
    }
    
    const correctAnswer = function(e) {
        // This function is for when a user answers a question correctly
        
        e.preventDefault();
        
        // flash the result
        showResult(true);
        // mark the question as having been answered
        quizQs[questionNumber].answered = true;
        // record which option was clicked
        quizQs[questionNumber].options[e.target.parentNode.dataset.nth].clicked=true;
        // increment the running total of correct answers
        totalRight++;
        
        if( (questionNumber + 1) == quizQs.length) {
            // this was the last question
            
            // setTimeout to allow the result of the last answer to flash
            setTimeout(function() { endQuiz() }, 1000);
        }
        else {
            // there are more questions, go to the next one
            questionNumber++;
            newQ(quizQs[questionNumber]);
        }
    }
    
    const wrongAnswer = function(e) {
        // This function is for when a user answers a question incorrectly
        
        e.preventDefault();
        
        // flash the result
        showResult(false);
        // mark the question as having been answered
        quizQs[questionNumber].answered = true;
        // record which option was clicked
        quizQs[questionNumber].options[e.target.parentNode.dataset.nth].clicked=true;
        // remove penalty seconds from timer
        timeRemaining -= penalty;
        stopClock();    // so user won't flip if clock was about to turn 
        
        // check if that exhausts the timer
        if (timeRemaining <=0) {
            // our time went to or below zero.
            timeRemaining = 0;
            questionNumber++;
            updateClock(0);
            // setTimeout to allow the result of the last answer to flash
            setTimeout(function() { endQuiz() }, 1000);
            return;
        } else {
            // still time left, update the clock and keep going
            updateClock(timeRemaining);
            startClock();
        }
        
        if( (questionNumber + 1) == quizQs.length) {
            // this was the last question

            // setTimeout to allow the result of the last answer to flash
            setTimeout(function() { endQuiz() }, 1000);
        }
        else {
            // there are more questions, go to the next one
            questionNumber++;
            newQ(quizQs[questionNumber]);
        }
    }
    
    const stopQuiz = function() {
        // This function stop the quiz before it ends
        endQuiz(false, true);
    }
    
    /* END FUNCTION EXPRESSIONS */
    
    
    // add a listener to View High Scores that stops the quiz
    jViewBtn.on("click", stopQuiz);
    // start the main countdown
    mainTimer = setInterval(countdown, 1000);
    // READYSETGO! Go to the first question
    newQ(quizQs[0]);
    
    
    
    /* FUNCTION DECLARATIONS */
    
    function newQ(q) {
        // This function puts a new question on the screen
        // parameter "q" is a question object

        // Put in the new question text
        jQuestion.text(q.question);
        // empty the options list
        jOptions.empty();
        // shuffle the question's answer options
        shuffleMe(q.options);
                
        // create li for each option, add text, attribute and listener
        let jOptionLI, jOptionBtn;
        for (let i = 0; i < q.options.length; i++) {
            jOptionLI = $("<li>");
            jOptionBtn = $("<button>");
            jOptionBtn.text(q.options[i].text);
            jOptionLI.attr("data-nth",i);
            jOptionLI.append(jOptionBtn);
            jOptions.append(jOptionLI);
            // check if this is the right answer and add appropriate callback
            if (q.options[i].correct) {
                jOptionBtn.on("click", correctAnswer);
            } else {
                jOptionBtn.on("click", wrongAnswer); 
            }
        };        
    }

    function endQuiz(finished, stopShort) {
        // This function tidies up after the quiz is over
        // parameter "finished" is whether the user got to the end
        // parameter "stopShort" is whether we exited before the quiz was done

        // stop the clock and remove the time remaining text
        stopClock();
        jTimer.text("");
        // remove event listeners from all option buttons
        $('#options li').each( function() {
            $(this).off("click");
        } );
        // if we haven't exited the quiz early, send the user to Save Results page
        if (!stopShort) {
            saveResults({ results: quizQs, correct: totalRight, answered: finished?(questionNumber + 1):questionNumber, left: timeRemaining });
        }
        // remove the quiz-specific listener from "View High Scores"
        jViewBtn.off("click", stopQuiz);
    }

    
    
    /* UTILITY FUNCTIONS */
    
    // Utilities to start and stop the clock to make code more readable
    function startClock() {
        mainTimer = setInterval(countdown, 1000);
    }

    function stopClock() {
        clearInterval(mainTimer);
    }

    function shuffleMe(arr) {
        // This utility takes an array and shuffles it
        // parameter "arr" is the array to be shuffled
        // (Thanks to W3docs for this technique)

        let rand, temp;
        
        // start a counter at the end of the array
        let counter = arr.length;
        while (counter != 0) {
            // choose a random index
            rand = Math.floor( Math.random() * counter );
            // decrement counter
            counter--;
            // swap the random-index element with the counter element
            temp = arr[counter];
            arr[counter] = arr[rand];
            arr[rand] = temp;
        }

        // "dummy" return (array was shuffled in place)
        return false;
    }

    function showResult(correct) {
        // This utility flashes the result of the question
        // This result just flashes for a second on screen
        // parameter "correct" is if question was answered correctly

        // set the content
        result.textContent = correct?"Correct":"Incorrect";
        // which class
        let newClass = correct?"correct":"wrong";
        // add the class, and then reset after a half second
        $(result).addClass(newClass);
        setTimeout(function() {
            $(result).removeClass(newClass);
            result.textContent = "";
            }, 1000);
    }

    function updateClock(remaining) {
        // This utility updates the user view of time remaining
        // parameter "remaining" is the number of seconds left in the quiz

        jTimer.text(convertToTime(remaining));
    }
 
    /* END FUNCTION DECLARATIONS */
    
}

// END TAKE THE QUIZ PAGE ------------------------------



// SAVE RESULTS PAGE -----------------------------------

function saveResults(summary) {
    // parameter "summary" is an object with everything we know about the quiz

    // INITIALIZATION

    // Add event listeners
    jSubmitBtn.on("click", addScore);
    jNoSubmitBtn.on("click", notAddingScore);
    // Make this section visible and hide the others
    showSection(jEnterSection);
    // Fill in the summary details on the user's result
    jTimeLeft.text((summary.left==0)?"You ran out of time.":("You had " + convertToTime(summary.left) + " remaining."));
    let phrase = (summary.answered == summary.correct)?("all " + summary.correct + " right."):(summary.correct + " right.");
    jFinalScore.text("You answered " + summary.answered + " questions, and got " + phrase);

    // That's all we have to do: it's up to the user now.

    
    /* FUNCTION DECLARATIONS */

    function addScore() {
        // This function adds the score to the High Scores list

        // if the initials value is empty, amscray
        // (recursion to avoid multiple listeners on the button)
        if (jInitialsInput.val().length == 0) {
            endSubmit();
            saveResults(summary);
            return;
        }

        // add the initials the user added and the date
        summary.inits = jInitialsInput.val();
        summary.date = new Date();

        // set the "scores" array to the current high scores, if any
        let scores = [];
        if(typeof(localStorage.getItem("highScores"))=="string") {
            scores = JSON.parse(localStorage.getItem("highScores"));
        }

        // add the latest result to the array, and then store
        scores.push(summary);
        localStorage.setItem("highScores", JSON.stringify(scores));

        // redraw the high scores table
        drawResults();
        // our job here is done, go to cleanup
        endSubmit();
        // send the user to the results table
        showResults();
     }

     function notAddingScore() {
        // This function is for when the user decides not to add the score
        
        // our job here is done, go to cleanup
        endSubmit();
        // send the user to take the quiz again
        takeQuiz();
     }

     function endSubmit() {
        // This function tidies up as the user leaves the page

        // remove listeners (to avoid multiple listeners accumulating)
        jSubmitBtn.off("click");
        jNoSubmitBtn.off("click");
        // clear out the initials field
        jInitialsInput.val("");
     }

     /* END FUNCTION DECLARATIONS */
}

// END SAVE RESULTS PAGE ------------------------------



// SHOW RESULTS PAGE ----------------------------------

function showResults() {

    // INITIALIZATION

    // show the High Scores section, hide the others
    showSection(jScoresSection);

    // The real work is in the drawResults() function.
}

// END SHOW RESULTS PAGE ------------------------------



// REVIEW RESULTS PAGE --------------------------------

function reviewResults(quiz) {
    // parameter "quiz" is a quiz object with all q's, a's and results

    /* FUNCTION EXPRESSIONS */

    const endReview = function() {
        // remove listeners to prevent multiple instances later
        jReviewBackBtn.off("click");
        jReviewNextBtn.off("click");
        jViewBtn.off("click", endReview);
        jTryAgainRevBtn.off("click", endReview);
        // reset the quiz section to be ready to take a quiz
        jQuizSection.removeClass("review");
        jQuizSection.addClass("quiz");
    }

    /* END FUNCTION EXPRESSIONS */

    // INITIALIZATION

    // show the Quiz section, and customize it to this purpose
    showSection(jQuizSection);
    jQuizSection.removeClass("quiz");
    jQuizSection.addClass("review");
    // initialize a counter to track what question we're on
    let questionNumber = 0;
    // add listeners to the back and next buttons
    // the true/false parameter passed is if we are going forward and not back
    jReviewBackBtn.on("click", function() {
        anotherQ(false);
    })
    jReviewNextBtn.on("click", function() {
        anotherQ(true);
    })
    // add a listener to the exit point buttons to clean things up
    jViewBtn.on("click", endReview);
    jTryAgainRevBtn.on("click", endReview);
    // disable the back button, since we're starting on the first question...
    jReviewBackBtn.prop("disabled", true);
    // ...but make sure the next button is active
    jReviewNextBtn.prop("disabled", false);



    // we start with the first question
    newQ(quiz.results[0]);


    
    /* FUNCTION DECLARATIONS */
    
    function newQ(q) {
        // This function draws the given question to the screen
        // parameter "q" is a specific question with its options

        // write the question
        jQuestion.text(q.question);
        // clear the options
        jOptions.empty();
        
        // iterate through the options and write them
        // create li for each option, add text, attribute and listener
        let jOptionLI;
        for (let i = 0; i < q.options.length; i++) {
            jOptionLI = $("<li>");
            jOptionLI.text(q.options[i].text);
            jOptions.append(jOptionLI);
            // add classes if this option was correct and/or clicked
            if (q.options[i].correct) jOptionLI.addClass("correct");
            if (q.options[i].clicked) jOptionLI.addClass("clicked"); 
        };
    }
    
    function anotherQ(next) {
        // This function advances or goes back a question
        // parameter "next" is a boolean: are we moving forward?
    
        // increment or decrement the question number
        if (next) questionNumber++;
        else questionNumber--;
    
        // enable or disable the navigation buttons if necessary
        if ( questionNumber == 0 ) jReviewBackBtn.prop("disabled", true);
        else jReviewBackBtn.prop("disabled", false);
        if ( questionNumber == (quiz.results.length - 1) ) jReviewNextBtn.prop("disabled", true);
        else jReviewNextBtn.prop("disabled", false);
    
        // call the next question
        newQ(quiz.results[questionNumber]);
    }

    /* END FUNCTION DECLARATIONS */
}

// END REVIEW RESULTS PAGE -----------------------------

/* ---- END PAGE MANAGEMENT FUNCTIONS ---- */



/* ---- GLOBAL UTILITES ---- */

function drawResults() {
    // This utility empties and redraws the High Scores table

    // clear out all the existing rows
    const jTableBody = $("tbody");
    jTableBody.empty();

    // to avoid accumulation of listeners, remove this one
    jTableBody.off("click");

    let storedScores = localStorage.getItem("highScores");
    
    if (typeof(storedScores) != "string") {
        // no stored scores, add the special row and leave
        let emptyRow = createRow(false);
        jTableBody.append(emptyRow);
        return;
    }
    
    // parse the string, then create rows
    storedScores = JSON.parse(storedScores);

    // add the delegated listener for the buttons
    // this listener not applied globally, so not 
    jTableBody.on("click", "button", function(e) {
        e.preventDefault();

        // grab the tr element
        let row = e.target.parentNode.parentNode;
        reviewResults(storedScores[row.dataset.nth]);
    })


    /* A NOTE ON THE METHOD HERE:
    It would be easier to just sort the storedScores array and create the rows
    off of the sorted array. But I intend to put buttons in each row that will let
    the user review the quiz results. I need to honor the stored order of high scores
    in localStorage to do that. So we create the rows and encode them based on the
    existing order, and then sort the rows with their information encapsulated in 
    an attribute.

    Here's hoping I add those buttons now! */


    // create the array that will hold the created rows
    let newRows = [];
    
    // iterate over the scores, create rows, add to the array
    for ( let i = 0; i < storedScores.length; i++ ) {
        newRows.push(createRow(storedScores[i]));
        // assign the row's unsorted index for later reference
        newRows[i].attr("data-nth", i);
    }

    // now sort the rows by score first, then by time remaining
    newRows.sort(function(a, b) { 
        /* see the note above for the reason I'm
        sorting the rows after creating them and not before */

        let aCorrect = a.children().eq(3).text();
        let bCorrect = b.children().eq(3).text();
        let aLeft = convertToSecs(a.children().eq(2).text());
        let bLeft = convertToSecs(b.children().eq(2).text());

        if (aCorrect == bCorrect) return ( bLeft - aLeft );
        else return ( bCorrect - aCorrect )
    });

    // now add the rows to the table
    for ( i = 0; i < newRows.length; i++ ) {
        jTableBody.append(newRows[i]);
    }

    /* FUNCTION DECLARATIONS */

    function createRow(data) {
        // This function creates a tr to be added to the table
        // parameter "data" is an object that has all the info about this result

        let newRow = $("<tr>");             // the actual row we're creating
        let reviewBtn;
        if (!data) {
            // if there are no scores to create, "data" will be "false"
            let emptyCell = $("<td>");
            emptyCell.attr("colspan", "5");
            emptyCell.text("No scores to show");
            emptyCell.addClass("no-scores");
            newRow.append(emptyCell);  
        } else {
            // if there is data, create four tds
            for ( let i = 0; i < 5; i++ ) {
                newRow.append($("<td>"));
            }
            // then assign the appropriate content to the tds
            newRow.children().eq(0).text(convertToDate(data.date));
            newRow.children().eq(1).text(data.inits);
            newRow.children().eq(2).text((data.left==0)?"-":convertToTime(data.left));
            newRow.children().eq(3).text(data.correct);
            reviewBtn = $("<button>");
            reviewBtn.text("review");
            reviewBtn.addClass("review-button");
            newRow.children().eq(4).append(reviewBtn);
        };
        
        // send back the completed row
        return newRow;
    }

    /* END FUNCTION DECLARATIONS */
}



/* GLOBAL FUNCTION DECLARATIONS */

function clearScores() {
    // This function clears the high scores from local storage,
    // then redraws the (empty) table, then send the user back to the page

    localStorage.removeItem("highScores");
    drawResults();
    showResults();
}


function showSection(show) {
    // This iterates over all the sections, hides them all except one
    // parameter "show" is the section to keep visible

    for ( let i = 0; i < sections.length; i++ ) {
        if ( sections[i] == show ) {
            sections[i].toggleClass("visible", true);
        } else {
            sections[i].toggleClass("visible", false);
        }
    }
}

function convertToTime(secs) {
    // This utility takes a total number of seconds and returns a m:ss string
    // parameter "secs" is the number of seconds to convert

    let minutes = (Math.floor(secs/60));
    let seconds = secs % 60;
    let timeString = minutes + ":" + ((seconds<10)?"0":"") + seconds;
    return timeString;
}

function convertToSecs(time) {
    // This utility does the opposite of what is above, converts from m:ss to seconds
    // parameter "time" is the m:ss string to convert

    let pieces = time.split(":");
    let seconds = pieces[0] * 60;
    seconds += pieces[1];
    return seconds;
}

function convertToDate(dateString) {
    // This utility takes a standard date string and converts to presentable format
    // parameter "dateString" is the standard string created by a JS new Date()

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // split the string by the "T" separator into a date and a time
    let dateTime = dateString.split("T");
    // split the date part by the hyphens
    let justDate = dateTime[0].split("-");
    // recombine everything into mmm, dd, yyyy
    let reformattedDate = months[(justDate[1]-1)] + " " + parseInt(justDate[2]) + ", " + justDate[0];
    return reformattedDate;
}

/* END GLOBAL FUNCTION DECLARATIONS */