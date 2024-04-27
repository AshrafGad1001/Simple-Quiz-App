//select all Element UseIt
let countSpan = document.querySelector(".quiz-info .count span");
let BulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitbutton = document.querySelector(".submit-button");
let Bulletes = document.querySelector(".bullets");
let ResultContainer = document.querySelector(".result");
let countdownElement = document.querySelector(".count-down");

let CurrentQuestion = 0;
let AllrightAnswers = 0;
let CountDownInterval;


getQuestions();


function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let QuestionsObj = JSON.parse(this.responseText);
            // console.log(QuestionsObj);
            let questionsCount = QuestionsObj.length;
            // console.log(questionsCount);
            creteBulletes(questionsCount);

            // add Questions Data 
            addQuestions(QuestionsObj[CurrentQuestion], questionsCount);


            countdown(120, questionsCount);


            submitbutton.onclick = () => {
                // Get Right Answer 
                let TheRightAnswer = QuestionsObj[CurrentQuestion].right_answer;
                // console.log(TheRightAnswer);
                cheakAnswer(TheRightAnswer, questionsCount);
                //Notes
                CurrentQuestion++;
                //Remove quizArea //Remove answerArea
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                //when Click on Submit -> Next Question
                addQuestions(QuestionsObj[CurrentQuestion], questionsCount);

                // Handel Bulletes Class 
                handelBulletes();

                clearInterval(countdownInterval);
                countdown(120, questionsCount);
                //show Result
                showResult(questionsCount);

            }
        }
    }
    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}

function creteBulletes(num) {
    countSpan.innerHTML = num;

    for (let i = 0; i < num; i++) {
        // Create Bullet
        let TheBullet = document.createElement('span');
        // Append in Spans Container 
        BulletSpanContainer.appendChild(TheBullet);
        if (i === 0) {
            TheBullet.classList.add("on");
        }
    }

}

function addQuestions(obj, count) {
    if (CurrentQuestion < count) {
        // console.log(obj);
        // console.log(count); 

        // Question Text
        let QuestionText = document.createTextNode(obj.title);

        //Create H2
        let QuestionTitle = document.createElement("h2");

        //Add Text in H2
        QuestionTitle.appendChild(QuestionText);

        // Add Questions In Html (class="quiz-area")
        quizArea.appendChild(QuestionTitle);

        // Create  The Answer

        for (let i = 1; i <= 4; i++) {
            // create Main Div
            let mainDiv = document.createElement("div");
            mainDiv.classList.add("answer");

            // create RadioInput
            let RadioInput = document.createElement("input");
            RadioInput.name = 'questions';
            RadioInput.type = 'radio';
            RadioInput.id = `answer_${i}`;
            RadioInput.dataset.answer = obj[`answer_${i}`];


            ////Notes 
            if (i === 1) {
                RadioInput.checked = true;
            }


            //Create Lable For Each Radio

            let TheLable = document.createElement("label");

            TheLable.htmlFor = `answer_${i}`;

            ///Text Of Lable 
            let LableText = document.createTextNode(obj[`answer_${i}`]);

            TheLable.appendChild(LableText);


            // Adding In Main Div 'answer'
            mainDiv.appendChild(RadioInput);
            mainDiv.appendChild(TheLable);

            //adding MainDiv In Html

            answerArea.appendChild(mainDiv);

        }
    }
}

function cheakAnswer(RAnswer, Count) {

    // console.log(RAnswer);
    // console.log(Count);


    let Answers = document.getElementsByName("questions");
    let TheChoosenAnswer;

    for (let i = 0; i < Answers.length; i++) {
        if (Answers[i].checked) {
            TheChoosenAnswer = Answers[i].dataset.answer;
        }
    }

    // console.log(RAnswer);
    // console.log(TheChoosenAnswer);


    if (RAnswer === TheChoosenAnswer) {
        AllrightAnswers++;
        console.log("Good Boy");
    }

}

function handelBulletes() {
    let BulletesSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(BulletesSpans);

    arrayOfSpans.forEach((span, index) => {
        if (CurrentQuestion === index) {
            span.classList.toggle("on");
        }
    });
}

function showResult(QCount) {
    let FinalResult;
    if (CurrentQuestion === QCount) {
        quizArea.remove();
        answerArea.remove();
        submitbutton.remove();
        Bulletes.remove();
        if (AllrightAnswers > (QCount / 2) && AllrightAnswers < QCount) {
            FinalResult = `  <span class="Passed">Passed </span>, You Answered ${AllrightAnswers} from ${QCount}`;
        } else if (AllrightAnswers === QCount) {
            FinalResult = `  <span class="Excellent">Excellent </span>, All Questions Is True `;
        } else {
            FinalResult = `  <span class="bad">Bad Result </span>, You Answered ${AllrightAnswers} from ${QCount}`;
        }

        ResultContainer.innerHTML = FinalResult;
        ResultContainer.style.padding = "10px";
        ResultContainer.style.backgroundColor = "white";
        ResultContainer.style.marginTop = "50px";
    }


}

function countdown(duration, count) {
    if (CurrentQuestion < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitbutton.click();
            }
        }, 1000);
    }
}