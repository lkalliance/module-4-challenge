var quizQs = [
    {
        question: "What shortcut character is usually used to signify a jQuery assignment or action?",
        options: [
            { text: "$", correct: true },
            { text: "%", correct: false },
            { text: "#", correct: false },
            { text: "&", correct: false }
        ]
    },
    {
        question: "Which of these is NOT a legitimate pseudo-class?",
        options: [
            { text: ":middle-child", correct: true },
            { text: ":focus", correct: false },
            { text: ":hover", correct: false },
            { text: ":first-of-type", correct: false }
        ]
    },
    {
        question: "Who is the acknowledged inventor of Javascript?",
        options: [
            { text: "Brendan Eich", correct: true },
            { text: "James Javorsky", correct: false },
            { text: "Cornelius 'ScriptMan' Sinclair", correct: false },
            { text: "Josiah Springfield", correct: false },
        ]
    },
    {
        question: "Which of the following is NOT a valid tag in the HTML5 spec?",
        options: [
            { text: "<headrow>", correct: true },
            { text: "<thead>", correct: false },
            { text: "<head>", correct: false },
            { text: "<header>", correct: false }
        ]
    },
    {
        question: "Which of these is a valid Javascript variable declaration?",
        options: [
            { text: "const [variable name]", correct: true },
            { text: "variable [variable name]", correct: false },
            { text: "num [variable name]", correct: false },
            { text: "jsv [variable name]", correct: false }
        ]
    },
    {
        question: "Which of these selectors would your browser definitively honor in applying a CSS rule?",
        options: [
            { text: "The most specific selector", correct: true },
            { text: "The first applicable selector", correct: false },
            { text: "The selector with the most rules attached", correct: false },
            { text: "The selector that gave it a good review", correct: false }
        ]
    },
    {
        question: "Which of these is NOT an event type in today's Javascript?",
        options: [
            { text: "hover", correct: true },
            { text: "click", correct: false },
            { text: "load", correct: false },
            { text: "keyup", correct: false }
        ]
    },
    {
        question: "How many columns does a 'flex' container have by default?",
        options: [
            { text: "Flexbox does not use 'rows' and 'columns'.", correct: true },
            { text: "12", correct: false },
            { text: "1", correct: false },
            { text: "Whatever the coder defines in the page's CSS", correct: false }
        ]
    },
    {
        question: "Which of these HTML tags is self-closing?",
        options: [
            { text: "<link>", correct: true },
            { text: "<script>", correct: false },
            { text: "<a>", correct: false },
            { text: "<colgroup>", correct: false }
        ]
    },
    {
        question: "What is a global Javascript variable?",
        options: [
            { text: "One that can be accessed from any function", correct: true },
            { text: "One defined inside a Unicode library", correct: false },
            { text: "One declared with the 'global' keyword", correct: false },
            { text: "One which has a name that uses only round characters", correct: false }
        ]
    },
]




/* var quizQs = [];

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
} */