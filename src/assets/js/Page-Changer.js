import imgDesert from "../img/desert.png";
import imgMountain from "../img/mountain.png";
import imgBeach from "../img/beach.png";
import imgScore from "../img/score.svg";

export default class PageChanger {
  constructor() {
    /**
     * @type {HTMLElement}
     */
    this.scoreHtml = document.querySelector(".score");

    /**
     * @type {HTMLElement}
     */
    this.ecranAccueil = document.querySelector(".ecran-accueil");

    /**
     * @type {HTMLElement}
     */
    this.ecranJeu = document.querySelector(".ecran-jeu");

    /**
     * @type {HTMLElement}
     */
    this.ecranFin = document.querySelector(".ecran-fin");

    /**
     * @type {HTMLElement}
     */
    this.header = document.querySelector("header");

    /**
     * @type {HTMLElement}
     */
    this.body = document.querySelector("body");

    /**
     * @type {HTMLElement}
     */
    this.welcome = document.querySelector(".welcome");

    /**
     * @type {HTMLElement}
     */
    this.result = document.querySelector(".result-wrapper");

    /**
     * @type {HTMLElement[]}
     */
    this.btnsSettings = document.querySelectorAll(".btn-settings");

    /**
     * @type {HTMLElement[]}
     */
    this.btnsStart = document.querySelectorAll(".btn-start");

    /**
     * @type {string}
     */
    this.currentScreen = "accueil";

    document.querySelector(
      ".bg-mountain"
    ).style.backgroundImage = `url(${imgMountain})`;
    document.querySelector(
      ".bg-beach"
    ).style.backgroundImage = `url(${imgBeach})`;
  }

  /**
   * @returns {void}
   */
  hideAllScreens() {
    this.ecranAccueil.classList.add("hidden");
    this.ecranAccueil.classList.remove("flex");
    this.ecranJeu.classList.add("hidden");
    this.ecranJeu.classList.remove("flex");
    this.ecranFin.classList.add("hidden");
    this.ecranFin.classList.remove("flex");
  }

  /**
   * @param {"game" | "end" | "accueil"}} screenName
   * @returns {void}
   */
  switchScreen(screenName) {
    this.hideAllScreens();
    this.currentScreen = screenName;

    switch (screenName) {
      case "game":
        this.ecranJeu.classList.remove("hidden");
        this.ecranJeu.classList.add("flex");
        this.body.style.backgroundColor = "#36219A";
        this.body.style.backgroundImage = `url(${imgMountain})`;
        this.welcome.classList.add("hidden");
        this.result.classList.remove("hidden");
        this.result.classList.add("flex");
        this.scoreHtml.style.backgroundImage = `url(${imgScore})`;
        this.btnsStart.forEach((btn) => {
          btn.setAttribute("disabled", true);
        });
        this.btnsSettings.forEach((btn) => {
          btn.setAttribute("disabled", true);
        });
        break;

      case "end":
        this.ecranFin.classList.remove("hidden");
        this.ecranFin.classList.add("flex");
        this.body.style.backgroundColor = "rgb(171,179,55)";
        this.body.style.backgroundImage = `url(${imgBeach})`;
        this.btnsStart.forEach((btn) => {
          btn.setAttribute("disabled", "");
        });
        this.btnsSettings.forEach((btn) => {
          btn.removeAttribute("disabled");
        });
        break;

      case "accueil":
        this.ecranAccueil.classList.remove("hidden");
        this.ecranAccueil.classList.add("flex");
        this.body.style.backgroundColor = "#bf5737";
        this.body.style.backgroundImage = `url(${imgDesert})`;
        this.welcome.classList.remove("hidden");
        this.result.classList.add("hidden");
        this.result.classList.remove("flex");
        this.btnsSettings.forEach((btn) => {
          btn.removeAttribute("disabled");
        });
        this.btnsStart.forEach((btn) => {
          btn.removeAttribute("disabled");
        });
    }
  }
}
