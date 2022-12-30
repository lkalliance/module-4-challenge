var quizQs = [];

for (let i=0; i<10; i++) {
    quizQs[i] = new quizObject(("Question " + (i+1)));
}


function quizObject(q) {
    this.question = q,
    this.options = ["option 1", "option 2", "option 3", "option 4"]
    let rnd = Math.floor(Math.random()*4);
    this.correct = rnd;

    return this;
}