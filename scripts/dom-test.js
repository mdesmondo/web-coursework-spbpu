// Массив вопросов и ответов
const questionsData = [
    {
        question: "Если человека назвали мордофиля, то это…",
        answers: [
            {
                text: "Значит, что он тщеславный.",
                isCorrect: true,
                explanation: "Правильно! Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный."
            },
            {
                text: "Значит, что у него лицо как у хряка.",
                isCorrect: false
            },
            {
                text: "Значит, что чумазый.",
                isCorrect: false
            }
        ]
    },
    {
        question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        answers: [
            {
                text: "Он маленький и невзрачный.",
                isCorrect: true,
                explanation: "Правильно! Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи."
            },
            {
                text: "Он тот еще алкоголик.",
                isCorrect: false
            },
            {
                text: "Он не держит свое слово.",
                isCorrect: false
            }
        ]
    },
    {
        question: "Если человека прозвали пятигузом, значит, он…",
        answers: [
            {
                text: "Не держит слово.",
                isCorrect: true,
                explanation: "Правильно! Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек."
            },
            {
                text: "Изменяет жене",
                isCorrect: false
            },
            {
                text: "Без гроша в кармане.",
                isCorrect: false
            }
        ]
    },
    {
        question: "Кто такой шлындра?",
        answers: [
            {
                text: "Обманщик.",
                isCorrect: false
            },
            {
                text: "Нытик.",
                isCorrect: false
            },
            {
                text: "Бродяга.",
                isCorrect: true,
                explanation: "Правильно! Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться."
            }
        ]
    },
    {
        question: "В каком случае про человека можно сказать, что он охренел (в смысле «обнаглел/перешёл границы»), а не просто удивился?",
        answers: [
            {
                text: "Он без спроса берёт твои вещи и делает вид, что так и надо.",
                isCorrect: true,
                explanation: "Правильно. Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть»."
            },
            {
                text: "Он в наглую лезет без очереди и ещё возмущается, что его не пропускают.",
                isCorrect: true,
                explanation: "Правильно. Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть»."
            },
            {
                text: "Он съел много хрена и искренне удивился: «Какой жгучий, вот это да!»",
                isCorrect: false
            },
            {
                text: "В осеннем лесу наблюдается завихрение листьев.",
                isCorrect: false
            }
        ]
    }
];

// Функция перемешивания массива
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Перемешиваем вопросы и ответы внутри каждого вопроса
const shuffledQuestions = shuffleArray(questionsData).map(item => ({
    ...item,
    answers: shuffleArray(item.answers)
}));

let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let isQuestionActive = false; // Блокировка выбора нового вопроса, пока не дан ответ на текущий
let isQuizFinished = false;

const nextQuestionBtn = document.getElementById("dom-next-btn");
const statusArea = document.getElementById("dom-status-area");
const finishedMessage = document.getElementById("dom-finished-msg");
const statsMessage = document.getElementById("dom-stats-msg");
const questionsColumn = document.getElementById("dom-questions-col");
const answersRow = document.getElementById("dom-answers-row");

// Клик по кнопке "Вопрос"
nextQuestionBtn.addEventListener("click", () => {
    if (isQuestionActive || isQuizFinished) {
        return;
    }

    if (currentQuestionIndex >= shuffledQuestions.length) {
        finishQuiz();
        return;
    }

    renderNextQuestion();
});

function renderNextQuestion() {
    isQuestionActive = true;
    nextQuestionBtn.disabled = true;

    const questionObj = shuffledQuestions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    const requiredCorrectCount = questionObj.answers.filter(a => a.isCorrect).length;

    // Снимаем активную рамку с предыдущих вопросов
    document.querySelectorAll(".dom-question-block").forEach(block => {
        block.classList.remove("dom-active");
    });

    // Создаем пронумерованный блок вопроса в вертикальной колонке
    const questionBlock = document.createElement("div");
    questionBlock.className = "dom-question-block dom-active";

    const questionContent = document.createElement("div");
    questionContent.className = "dom-question-content";

    const questionText = document.createElement("span");
    questionText.textContent = `${questionNumber}. ${questionObj.question}`;
    questionContent.appendChild(questionText);

    // Если в вопросе несколько правильных ответов, добавляем плашку в блок вопроса
    if (requiredCorrectCount > 1) {
        const multiBadge = document.createElement("span");
        multiBadge.className = "dom-multi-badge";
        multiBadge.textContent = `Выберите ${requiredCorrectCount} правильных ответа`;
        questionContent.appendChild(multiBadge);
    }

    const markerSpan = document.createElement("span");
    markerSpan.className = "dom-marker";

    questionBlock.appendChild(questionContent);
    questionBlock.appendChild(markerSpan);
    questionsColumn.appendChild(questionBlock);

    // Очищаем контейнер ответов и выводим ответы горизонтально
    answersRow.replaceChildren();

    // Плашка-уведомление над ответами, если правильных вариантов несколько
    let multiNotice = null;
    if (requiredCorrectCount > 1) {
        multiNotice = document.createElement("div");
        multiNotice.className = "dom-multi-notice";
        multiNotice.textContent = `Внимание: в этом вопросе ${requiredCorrectCount} правильных ответа — выберите оба варианта (выбрано: 0 из ${requiredCorrectCount})`;
        answersRow.appendChild(multiNotice);
    }

    let isTurnLocked = false;
    let selectedCorrectCount = 0;

    questionObj.answers.forEach((answerObj) => {
        const answerBlock = document.createElement("div");
        answerBlock.className = "dom-answer-block";

        const answerText = document.createElement("div");
        answerText.textContent = answerObj.text;
        answerBlock.appendChild(answerText);

        answerBlock.addEventListener("click", () => {
            // Пока вопрос завершается или карточка уже выбрана, повторно нажать нельзя
            if (isTurnLocked || answerBlock.dataset.selected === "true") return;
            answerBlock.dataset.selected = "true";

            // Эффект тряски при нажатии
            answerBlock.classList.add("dom-shake");

            const allAnswerBlocks = Array.from(answersRow.querySelectorAll(".dom-answer-block"));

            if (answerObj.isCorrect) {
                selectedCorrectCount++;

                // Карточка с правильным ответом увеличивается и показывает пояснение
                setTimeout(() => {
                    answerBlock.classList.remove("dom-shake");
                    answerBlock.classList.add("dom-correct-expanded");

                    const explanationDiv = document.createElement("div");
                    explanationDiv.className = "dom-explanation";
                    explanationDiv.textContent = answerObj.explanation;
                    answerBlock.appendChild(explanationDiv);
                }, 350);

                // Если нужно выбрать ещё правильные ответы, обновляем плашку и ждём следующего клика
                if (selectedCorrectCount < requiredCorrectCount) {
                    if (multiNotice) {
                        multiNotice.textContent = `Выбрано правильных ответов: ${selectedCorrectCount} из ${requiredCorrectCount} — выберите ещё один`;
                    }
                    return;
                }

                // Все правильные ответы на вопрос выбраны
                isTurnLocked = true;
                correctAnswersCount++;

                if (multiNotice) {
                    multiNotice.textContent = `Отлично! Выбраны все правильные ответы (${selectedCorrectCount} из ${requiredCorrectCount})`;
                }

                // 1. В поле вопроса появляется маркер правильного ответа
                markerSpan.textContent = "✔";
                markerSpan.classList.add("dom-correct");

                // 2. Через пару секунд неправильные ответы поочередно уезжают вниз
                const wrongBlocks = allAnswerBlocks.filter(b => b.dataset.selected !== "true");
                const correctBlocks = allAnswerBlocks.filter(b => b.dataset.selected === "true");

                setTimeout(() => {
                    wrongBlocks.forEach((wrongBlock, idx) => {
                        wrongBlock.style.transitionDelay = `${idx * 0.25}s`;
                        wrongBlock.classList.add("dom-move-down");
                    });

                    // 3. Потом исчезают правильные ответы (и плашка, если она есть)
                    const totalWrongDelay = wrongBlocks.length * 250 + 600;
                    setTimeout(() => {
                        if (multiNotice) {
                            multiNotice.classList.add("dom-move-down");
                        }
                        correctBlocks.forEach((cBlock, idx) => {
                            cBlock.style.transitionDelay = `${idx * 0.15}s`;
                            cBlock.classList.remove("dom-correct-expanded");
                            cBlock.classList.add("dom-move-down");
                        });

                        setTimeout(() => {
                            completeQuestionTurn(questionBlock, questionObj);
                        }, 600);
                    }, totalWrongDelay);
                }, 2000);

            } else {
                // ЕСЛИ ОТВЕТ ВЫБРАН НЕВЕРНО:
                isTurnLocked = true;

                setTimeout(() => {
                    answerBlock.classList.remove("dom-shake");
                    answerBlock.classList.add("dom-wrong-selected");
                }, 350);

                // Через пару секунд все блоки поочередно уезжают вниз и появляется маркер ответа
                setTimeout(() => {
                    markerSpan.textContent = "✖";
                    markerSpan.classList.add("dom-incorrect");

                    if (multiNotice) {
                        multiNotice.classList.add("dom-move-down");
                    }

                    allAnswerBlocks.forEach((block, idx) => {
                        block.style.transitionDelay = `${idx * 0.25}s`;
                        block.classList.remove("dom-correct-expanded");
                        block.classList.add("dom-move-down");
                    });

                    const totalDelay = allAnswerBlocks.length * 250 + 600;
                    setTimeout(() => {
                        completeQuestionTurn(questionBlock, questionObj);
                    }, totalDelay);
                }, 2000);
            }
        });

        answersRow.appendChild(answerBlock);
    });
}

function completeQuestionTurn(questionBlock, questionObj) {
    answersRow.replaceChildren();
    questionBlock.classList.remove("dom-active");

    // Сохраняем ВСЕ правильные ответы в data-атрибуты блока вопроса для просмотра по окончании теста
    const correctAnswers = questionObj.answers
        .filter(a => a.isCorrect)
        .map(a => ({
            text: a.text,
            explanation: a.explanation
        }));

    questionBlock.dataset.correctAnswers = JSON.stringify(correctAnswers);

    currentQuestionIndex++;
    isQuestionActive = false;
    nextQuestionBtn.disabled = false;

    // Когда вопросы заканчиваются, сразу выводим "Вопросы закончились" и статистику
    if (currentQuestionIndex >= shuffledQuestions.length) {
        finishQuiz();
    }
}

function finishQuiz() {
    isQuizFinished = true;
    nextQuestionBtn.disabled = true;

    // Над областью динамического добавления появляется надпись "Вопросы закончились" и статистика
    statusArea.classList.remove("dom-hidden");
    finishedMessage.textContent = "Вопросы закончились";
    statsMessage.textContent = `Правильных ответов: ${correctAnswersCount} из ${shuffledQuestions.length}`;

    // Когда все вопросы выбраны, при нажатии на вопрос показываются все его правильные ответы,
    // а у остальных вопросов правильные ответы в это время не видны
    const allQuestionBlocks = document.querySelectorAll(".dom-question-block");
    allQuestionBlocks.forEach(qBlock => {
        qBlock.classList.add("dom-clickable");

        qBlock.addEventListener("click", () => {
            if (!isQuizFinished) return;

            allQuestionBlocks.forEach(b => b.classList.remove("dom-active"));
            qBlock.classList.add("dom-active");

            // Очищаем область ответов и выводим все правильные ответы выбранного вопроса
            answersRow.replaceChildren();
            const correctAnswers = JSON.parse(qBlock.dataset.correctAnswers || "[]");

            correctAnswers.forEach(ans => {
                const reviewCard = document.createElement("div");
                reviewCard.className = "dom-answer-block dom-correct-expanded";

                const reviewAnswer = document.createElement("strong");
                reviewAnswer.textContent = ans.text;

                const reviewExplanation = document.createElement("div");
                reviewExplanation.className = "dom-explanation";
                reviewExplanation.textContent = ans.explanation;

                reviewCard.append(reviewAnswer, reviewExplanation);
                answersRow.appendChild(reviewCard);
            });
        });
    });
}