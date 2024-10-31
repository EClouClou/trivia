/**
 * @type {Settings}
 */
export default class Settings {
  constructor() {
    /**
     * @type {HTMLElement}
     */
    this.msgSettings = document.querySelector(".msg-settings");
    /**
     * @type {HTMLElement}
     */
    this.formSettings = document.querySelector(".settings-inputs");
    /**
     * @type {HTMLElement}
     */
    this.categoriesSelect = document.querySelector("#category");
    /**
     * @type {HTMLElement[]}
     */
    this.difficultyRadios = document.querySelectorAll(
      'input[name="difficulty"]'
    );
    /**
     * @type {HTMLElement[]}
     */
    this.typeRadios = document.querySelectorAll('input[name="type"]');
    /**
     * @type {HTMLInputElement}
     */
    this.nbQuestionsInput = document.querySelector("#nb-question");
    /**
     * @type {HTMLElement}
     */
    this.btnSave = document.querySelector(".btn-save");
    /**
     * @type {HTMLElement}
     */
    this.btnReset = document.querySelector(".btn-reset");
    /**
     * @type {HTMLElement}
     */
    this.nbQuestionIndicator = document.querySelector(".nb-question-indicator");

    /**
     * @type {{category: string, difficulty: string, type: string, nbQuestions: number}}
     */
    this.settings = {
      category: "",
      difficulty: "",
      type: "",
      nbQuestions: 10,
    };

    this.loadSettingsFromLocalStorage();
    this.init();
    this.updateNbQuestionIndicator();
  }

  /**
   * @returns {void}
   */
  init() {
    this.msgSettings.textContent = "";
    this.fetchCategories();
    this.btnSave.addEventListener("click", (e) => this.handleSave(e));
    this.btnReset.addEventListener("click", (e) => this.handleReset(e));
    this.nbQuestionsInput.addEventListener("input", () =>
      this.updateNbQuestionIndicator()
    );
  }

  /**
   * @returns {void}
   */
  fetchCategories() {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        data.trivia_categories.forEach((cat) => {
          /**
           * @type {HTMLElement}
           */
          const optionElement = document.createElement("option");
          optionElement.textContent = cat.name;
          optionElement.setAttribute("value", cat.id);
          this.categoriesSelect.appendChild(optionElement);
        });
        this.applySettingsToForm();
      })
      .catch((error) => {
        console.error("Erreur lors du fetch des catégories:", error);
      });
  }

  /**
   * @param {MouseEvent} e
   * @returns {void}
   */
  handleSave(e) {
    e.preventDefault();

    this.settings.category = this.categoriesSelect.value;
    this.settings.difficulty = this.getSelectedRadioValue(
      this.difficultyRadios
    );
    this.settings.type = this.getSelectedRadioValue(this.typeRadios);
    this.settings.nbQuestions = this.nbQuestionsInput.value;

    localStorage.setItem("settings", JSON.stringify(this.settings));

    this.msgSettings.textContent = "Settings saved";
    setTimeout(() => {
      this.msgSettings.textContent = "";
    }, 2000);
  }

  /**
   * @param {MouseEvent} e
   * @returns {void}
   */
  handleReset(e) {
    e.preventDefault();

    this.settings = {
      category: "",
      difficulty: "",
      type: "",
      nbQuestions: 10,
    };

    this.applySettingsToForm();
    localStorage.setItem("settings", JSON.stringify(this.settings));

    this.msgSettings.textContent = "Settings reset";
    setTimeout(() => {
      this.msgSettings.textContent = "";
    }, 2000);
  }

  /**
   * @returns {void}
   */
  updateNbQuestionIndicator() {
    this.nbQuestionIndicator.textContent = this.nbQuestionsInput.value;
    this.nbQuestionIndicator.style.left = `${
      this.nbQuestionsInput.value * 1.7
    }%`;
  }

  /**
   * @param {HTMLElement[]} radioList
   * @returns {string}
   */
  getSelectedRadioValue(radioList) {
    /**
     * @type {string}
     */
    let selectedValue = "";
    radioList.forEach((radio) => {
      if (radio.checked) {
        selectedValue = radio.value;
      }
    });
    return selectedValue;
  }

  /**
   * @returns {void}
   */
  loadSettingsFromLocalStorage() {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
      this.applySettingsToForm();
    }
  }

  /**
   * @returns {void}
   */
  applySettingsToForm() {
    this.categoriesSelect.value = this.settings.category || "any";
    this.difficultyRadios.forEach((radio) => {
      if (radio.value === this.settings.difficulty) {
        radio.checked = true;
      }
    });
    this.typeRadios.forEach((radio) => {
      if (radio.value === this.settings.type) {
        radio.checked = true;
      }
    });
    this.nbQuestionsInput.value = this.settings.nbQuestions;
    this.updateNbQuestionIndicator();
  }

  /**
   * @returns {string}
   */
  getUrlBySettings() {
    const url = "https://opentdb.com/api.php";
    if (!this.settings) {
      return `${url}?amount=10`;
    }
    /**
     * @type {string}
     */
    let settingsUrl = `${url}?amount=${this.settings.nbQuestions}`;
    if (this.settings.category && this.settings.category !== "any") {
      settingsUrl += `&category=${this.settings.category}`;
    }
    if (this.settings.difficulty && this.settings.difficulty !== "any") {
      settingsUrl += `&difficulty=${this.settings.difficulty}`;
    }
    if (this.settings.type && this.settings.type !== "any") {
      settingsUrl += `&type=${this.settings.type}`;
    }

    return settingsUrl;
  }
}
