var quizQs = [];

for (let i=0; i<10; i++) {
    quizQs[i] = new quizObject(("Question " + (i+1)));
}


function quizObject(q) {
    this.question = q,
    this.options = [
        { text: "option 1", correct: false },
        { text: "the correct answer", correct: true },
        { text: "option 3", correct: false },
        { text: "option 4", correct: false }
    ]

    return this;
}