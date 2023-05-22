import Question from "./Questions.jsx";

state = {
    questions: [
        { id: 'fdsd', title: 'Why is the sky blue?' },
        { id: 'adsf', title: 'Who invented pizza?' },
        { id: 'afdsf', title: 'Is green tea overrated?' },
    ],
    displayQuestions: false
}

if ( this.state.displayQuestions ) {
    questions = (
        <div>
            { this.state.questions.map((question, index) => {
                return <Question key={question.id}
                                 title={question.title} />
            })}
        </div>
    )
}