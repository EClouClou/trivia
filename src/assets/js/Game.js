import imgDesert from "../img/desert.png";
import ScoreManager from "./ScoreManager";
import PageChanger from "./Page-Changer";
import BestScores from "./BestScores.js";

/**
 * @type {PageChanger}
 */
const pageChanger = new PageChanger();
/**
 * @type {ScoreManager}
 */
const scoreManager = new ScoreManager();
/**
 * @type {BestScores}
 */
const bestScoresInstance = new BestScores();

/**
 * @type {Game}
 */
export default class Game {
  constructor() {
    /**
     * @type {number}
     */
    this.currentQuestionIndex = 0;

    /**
     * @type {HTMLElement}
     */
    this.questionHtml = document.querySelector(".question");

    /**
     * @type {HTMLElement[]}
     */
    this.responsesHtml = document.querySelectorAll(".response");

    /**
     * @type {HTMLElement}
     */
    this.msgError = document.querySelector(".msg-error");

    /**
     * @type {HTMLElement}
     */
    this.modaleContinue = document.querySelector(".modale-continue");

    document.querySelector(
      ".continue-screen"
    ).style.backgroundImage = `url(${imgDesert})`;
  }

  /**
   * @param {string} url
   * @returns {Promise<void>}
   */
  fetchGame(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.response_code === 1) {
          this.msgError.textContent =
            "Please change your settings. The game doesn't have enough questions with the selected settings.";
        } else {
          /**
           * @type {Object}
           */
          this.game = data;
          localStorage.setItem("oldGame", JSON.stringify(this.game));
          this.displayQuestion();
          pageChanger.switchScreen("game");
        }
      })
      .catch((error) => {
        console.error("Erreur de fetch:", error);
      });
  }

  /**
   * @returns {boolean}
   */
  gameFromLocalStorage() {
    /**
     * @type {string}
     */
    let oldGameData = localStorage.getItem("oldGame");
    if (oldGameData) {
      /**
       * @type {object}
       */
      this.game = JSON.parse(oldGameData);

      /**
       * @type {number}
       */
      this.currentQuestionIndex =
        JSON.parse(localStorage.getItem("currentQuestion")) || 0;
      return true;
    }
    return false;
  }

  /**
   * @param {string} selectedAnswer
   * @param {string} correctAnswer
   * @param {HTMLElement} selectedElement
   * @returns {void}
   */
  verifyAnswer(selectedAnswer, correctAnswer, selectedElement) {
    this.responsesHtml.forEach((responseHtml) => {
      responseHtml.onclick = null;
    });

    if (selectedAnswer === correctAnswer) {
      selectedElement.classList.add(
        "border-8",
        "border-greenAnswer",
        "box-border"
      );
      scoreManager.incrementScore();
    } else {
      selectedElement.classList.add(
        "border-8",
        "border-redAnswer",
        "box-border"
      );
      this.responsesHtml.forEach((responseHtml) => {
        if (responseHtml.textContent === correctAnswer) {
          responseHtml.classList.add(
            "border-8",
            "border-greenAnswer",
            "box-border"
          );
        }
      });
    }

    setTimeout(() => {
      this.responsesHtml.forEach((responseHtml) => {
        responseHtml.classList.remove(
          "box-border",
          "border-8",
          "border-greenAnswer",
          "border-redAnswer"
        );
      });

      this.currentQuestionIndex++;
      localStorage.setItem(
        "currentQuestion",
        JSON.stringify(this.currentQuestionIndex)
      );
      this.displayQuestion();
      scoreManager.displayScore(this.currentQuestionIndex);
    }, 1000);
  }

  /**
   * Décode une chaîne HTML encodée en texte brut.
   * Crée un élément `<textarea>`, insère la chaîne HTML encodée,
   * et récupère le texte décodé.
   * @param {string} html - La chaîne HTML encodée à décoder.
   * @returns {string} - Le texte décodé.
   */
  decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  /**
   * @returns {void}
   */
  displayQuestion() {
    if (this.currentQuestionIndex >= this.game.results.length) {
      return this.endGame();
    }

    /**
     * @type {string}
     */
    const question = this.game.results[this.currentQuestionIndex].question;
    this.questionHtml.innerHTML = this.decodeHtml(question);

    /**
     * @type {string}
     */
    const correctAnswer = this.decodeHtml(
      this.game.results[this.currentQuestionIndex].correct_answer
    );

    /**
     * @type {string[]}
     */
    let responses = this.game.results[
      this.currentQuestionIndex
    ].incorrect_answers.map((answer) => this.decodeHtml(answer));
    responses.push(correctAnswer);
    responses.sort(() => Math.random() - 0.5);

    this.responsesHtml.forEach((responseHtml) => {
      responseHtml.classList.remove("hidden");
      responseHtml.onclick = null;
    });

    if (responses.length === 2) {
      this.responsesHtml.forEach((responseHtml, index) => {
        if (index < 2) {
          responseHtml.classList.remove("hidden");
          responseHtml.textContent = responses[index];
          responseHtml.onclick = () =>
            this.verifyAnswer(responses[index], correctAnswer, responseHtml);
        } else {
          responseHtml.classList.add("hidden");
        }
      });
    } else {
      this.responsesHtml.forEach((responseHtml, index) => {
        responseHtml.classList.remove("hidden");
        responseHtml.textContent = responses[index];
        responseHtml.onclick = () =>
          this.verifyAnswer(responses[index], correctAnswer, responseHtml);
      });
    }

    scoreManager.updateProgressBar(this.currentQuestionIndex, this.game);
    scoreManager.displayScore(this.currentQuestionIndex);
  }

  /**
   * @returns {void}
   */
  endGame() {
    pageChanger.switchScreen("end");
    scoreManager.displayScore(this.currentQuestionIndex);
    /**
     * @type {object}
     */
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    /**
     * @type {object}
     * @property {object} user
     * @property {number} score
     * @property {string} date
     */
    const userScore = {
      user: currentUser,
      score: scoreManager.calculateScorePercent(this.currentQuestionIndex),
      date: new Date().toISOString(),
    };

    bestScoresInstance.savedBestScores.push(userScore);
    bestScoresInstance.sortScores();

    localStorage.setItem(
      "bestScores",
      JSON.stringify(bestScoresInstance.savedBestScores)
    );

    this.resetGame();

    bestScoresInstance.displayBestScores();
  }

  /**
   * @returns {void}
   */
  resetGame() {
    this.resetLocalStorage();
    this.game = {};
    this.questionHtml.textContent = "";
    this.responsesHtml.forEach((response) => (response.textContent = ""));
  }

  /**
   * @returns {void}
   */
  resetLocalStorage() {
    localStorage.removeItem("oldGame");
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("score");
  }

  /**
   * @returns {void}
   */
  restartGame() {
    this.resetGame();
    this.currentQuestionIndex = 0;
    scoreManager.currentScore = 0;
    scoreManager.resetScores();
    scoreManager.resetProgressBar();
    this.modaleContinue.setAttribute("closing", "");
    this.modaleContinue.removeAttribute("open");
    pageChanger.switchScreen("accueil");
  }

  /**
   * @returns {void}
   */
  continueGame() {
    this.modaleContinue.setAttribute("closing", "");
    this.modaleContinue.removeAttribute("open");
    scoreManager.displayScore(this.currentQuestionIndex);
    this.displayQuestion();
  }
}
