import PageChanger from "./Page-Changer";

const pageChanger = new PageChanger();

/**
 * @type {ScoreManager}
 */
export default class ScoreManager {
  constructor() {
    /**
     * @type {HTMLElement}
     */
    this.scorePercentHtml = document.querySelector(".score");

    /**
     * @type {HTMLElement}
     */
    this.numberQuestionHtml = document.querySelector(".number-questions");

    /**
     * @type {HTMLElement}
     */
    this.progressHtml = document.querySelector(".progress");

    /**
     * @type {[]}
     */
    this.score = [];

    /**
     * @type {number}
     */
    this.currentScore = 0;

    /**
     * @type {number}
     */
    this.currentScorePercent = 0;
  }

  /**
   * @param {number} currentQuestionIndex
   * @returns {number}
   */
  calculateScorePercent(currentQuestionIndex) {
    /**
     * @type {number}
     */
    const storedScore = JSON.parse(localStorage.getItem("score"));

    if (storedScore !== null) {
      this.currentScore = storedScore;
    }

    if (currentQuestionIndex > 0) {
      this.currentScorePercent = Math.round(
        (this.currentScore * 100) / currentQuestionIndex
      );
    } else {
      this.currentScorePercent = 0;
    }
    if (pageChanger.currentScreen === "game") {
      localStorage.setItem("score", JSON.stringify(this.currentScore));
    }
    return this.currentScorePercent;
  }

  /**
   * @param {number} currentQuestionIndex
   * @returns {void}
   */
  displayScore(currentQuestionIndex) {
    this.numberQuestionHtml.textContent = currentQuestionIndex + " questions";
    this.scorePercentHtml.textContent =
      this.calculateScorePercent(currentQuestionIndex) + " %";
  }

  /**
   * @param {number} currentQuestionIndex
   * @param {object} game
   * @returns {void}
   */
  updateProgressBar(currentQuestionIndex, game) {
    this.progressHtml.style.width =
      (currentQuestionIndex * 100) / game.results.length + "%";
  }

  /**
   * @returns {void}
   */
  resetProgressBar() {
    this.progressHtml.style.width = 0 + "%";
  }

  /**
   * @returns {void}
   */
  resetScores() {
    localStorage.setItem("score", JSON.stringify(this.currentScore));
    this.currentScore = 0;
    this.numberQuestionHtml.textContent = 0 + " questions";
    this.scorePercentHtml.textContent = 0 + " %";
  }

  /**
   * @returns {number}
   */
  loadScoreFromLocalStorage() {
    /**
     * @type {number}
     */
    const storedScore = JSON.parse(localStorage.getItem("score")) || [];
    this.score = storedScore;
    return this.score;
  }

  /**
   * @param {number} scorePercent
   * @param {number} totalQuestions
   * @returns {void}
   */
  addScore(scorePercent, totalQuestions) {
    this.score.push(scorePercent);
    this.score.push(totalQuestions);
    this.saveScoreToLocalStorage();
  }

  /**
   * @returns {void}
   */
  incrementScore() {
    this.currentScore++;
    this.saveScoreToLocalStorage();
  }

  /**
   * @returns {number}
   */
  getCurrentScore() {
    return this.currentScore;
  }

  /**
   * @returns {void}
   */
  saveScoreToLocalStorage() {
    localStorage.setItem("score", JSON.stringify(this.currentScore));
  }
}
