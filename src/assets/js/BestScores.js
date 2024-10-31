import imgScore from "../img/score.svg";

export default class BestScores {
  constructor() {
    /**
     * @type {{user: Object|string, score: number, date: string|Date}[]}
     */
    this.savedBestScores = JSON.parse(localStorage.getItem("bestScores")) || [];

    /**
     * @type {HTMLElement|null}
     */
    this.bestScoresContainer = document.querySelector(".best-scores-container");

    /**
     * @type {HTMLElement|null}
     */
    this.modaleContainerBestScoresHtml = document.querySelector(
      ".best-scores-modale"
    );
  }

  /**
   * @returns {void}
   */
  sortScores() {
    this.savedBestScores.sort((a, b) => b.score - a.score);
    if (this.savedBestScores.length > 10) {
      this.savedBestScores = this.savedBestScores.slice(0, 10);
    }
  }

  /**
   * @returns {string}
   */
  toBestScoreLigne() {
    /**
     * @type {string}
     */
    let scoresHtml = "";
    this.savedBestScores.forEach((bestScore) => {
      /**
       * @type {Object}
       */
      let user;
      if (typeof bestScore.user === "string") {
        user = JSON.parse(bestScore.user);
      } else {
        user = bestScore.user;
      }

      /**
       * @type {Date}
       */
      const date = new Date(bestScore.date);

      /**
       * @type {Date}
       */
      const options = { year: "numeric", month: "long", day: "numeric" };

      scoresHtml += `
        <div class="flex items-center gap-3 md:gap-4 lg:gap-6">
          <img class="w-[50px] md:w-[65px] lg:w-[80px]" src="${
            user.avatar
          }" alt="avatar de ${user.name}">
          <p class="font-bold w-[50px] lg:w-[70px]">${user.name}</p>
          <p style="background-image: url(${imgScore})" class="bg-[length:70%] lg:bg-[length:75%] bg-no-repeat bg-center text-[16px] md:text-[20px] lg:text-[38px] font-semibold text-center text-offWhite drop-shadow-trivia px-4 py-5 md:px-8 md:py-10">
            ${bestScore.score}&nbsp;%
          </p>
          <p class="text-sm font-bold">${date.toLocaleDateString(
            "en-US",
            options
          )}</p>
        </div>
      `;
    });
    return scoresHtml;
  }

  /**
   * @returns {void}
   */
  displayBestScores() {
    this.sortScores();
    /**
     * @type {string}
     */
    const scoresHtml = this.toBestScoreLigne();

    this.bestScoresContainer.innerHTML = scoresHtml;
    this.modaleContainerBestScoresHtml.innerHTML = scoresHtml;
  }
}
