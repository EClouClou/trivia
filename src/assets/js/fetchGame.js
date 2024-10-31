import Settings from "./Settings.js";
import PageChanger from "./Page-Changer.js";
import ScoreManager from "./ScoreManager.js";
import User from "./User";
import BestScores from "./BestScores.js";
import Game from "./Game.js";
import Slider from "./Slider";
import Dialog from "./Dialog.js";

/**
 * @type {Dialog}
 */
const dialogManager = new Dialog();

/**
 * @type {Settings}
 */
const settingsManager = new Settings();

/**
 * @type {PageChanger}
 */
const pageChanger = new PageChanger();

/**
 * @type {ScoreManager}
 */
const scoreManager = new ScoreManager();

/**
 * @type {Game}
 */
const gameManager = new Game();

/**
 * @type {Slider}
 */
const slider = new Slider();

/**
 * @type {HTMLElement}
 */
const modaleContinue = document.querySelector(".modale-continue");

/**
 * @type {HTMLElement}
 */
const btnContinue = document.querySelector(".btn-continue");

/**
 * @type {HTMLElement}
 */
const btnsRestart = document.querySelectorAll(".btn-restart");

/**
 * @type {HTMLElement}
 */
const btnsStart = document.querySelectorAll(".btn-start");

/**
 * @type {HTMLElement}
 */
const inputName = document.getElementById("user-name");

/**
 * @type {HTMLElement}
 */
const choosenAvatar = document.querySelector(".img-avatar");

/**
 * @type {HTMLElement}
 */
const currentNameHtml = document.querySelector(".current-name");

/**
 * @type {HTMLElement}
 */
const currentAvatarHtml = document.querySelector(".current-avatar");

/**
 * @type {HTMLElement}
 */
const msgError = document.querySelector(".msg-error");

/**
 * @type {Object[]}
 */
let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];

/**
 * @type {BestScores}
 */
const bestScoresInstance = new BestScores(bestScores);

/**
 * @returns {void}
 */
function checkCurrentUser() {
  /**
   * @type {{ name: string, avatar: string } | null}
   */
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return pageChanger.switchScreen("accueil");
  }

  if (gameManager.gameFromLocalStorage()) {
    pageChanger.switchScreen("game");
    scoreManager.displayScore(gameManager.currentQuestionIndex);
    gameManager.displayQuestion();
    modaleContinue.setAttribute("open", "");
    currentNameHtml.textContent = currentUser.name;
    currentAvatarHtml.setAttribute("src", currentUser.avatar);
  } else {
    pageChanger.switchScreen("accueil");
  }
}

checkCurrentUser();

btnsStart.forEach((btnStart) => {
  btnStart.addEventListener("click", () => {
    /**
     * @type {string}
     */
    const username = inputName.value.trim();
    if (username.length > 1) {
      msgError.textContent = "";
      /**
       * @type {User}
       */
      const user = new User(username, choosenAvatar.getAttribute("src"));
      user.saveCurrentUser();
      /**
       * @type {string}
       */
      const gameUrl = settingsManager.getUrlBySettings();
      gameManager.fetchGame(gameUrl);
    } else {
      msgError.textContent = "Veuillez entrer un nom d'utilisateur.";
    }
  });
});

btnContinue.addEventListener("click", () => {
  gameManager.continueGame();
});

btnsRestart.forEach((btnRestart) => {
  btnRestart.addEventListener("click", () => {
    gameManager.restartGame();
  });
});

bestScoresInstance.displayBestScores();
scoreManager.displayScore(scoreManager.currentQuestionIndex);
