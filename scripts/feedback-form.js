// Скрипт для отправки формы обратной связи
const feedbackForm = document.getElementById("feedback-form");
const feedbackStatus = document.getElementById("feedback-status");

if (feedbackForm) {
    feedbackForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        feedbackStatus.textContent = "Отправка сообщения...";

        try {
            const response = await fetch(feedbackForm.dataset.endpoint, {
                method: "POST",
                body: new FormData(feedbackForm)
            });

            if (!response.ok) {
                throw new Error("Ошибка сервера: " + response.status);
            }

            feedbackForm.reset();
            feedbackStatus.textContent = "Спасибо! Ваше сообщение отправлено.";
        } catch (error) {
            feedbackStatus.textContent =
                "Сейчас сайт работает как статическая страница (без подключенного бэкенда). Обработчик /api/feedback планируется добавить в курсе серверного программирования.";
        }
    });
}
