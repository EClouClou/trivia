/**
 * @type {Dialog}
 */
export default class Dialog {
  constructor() {
    /**
     * @type {HTMLElement[]}
     */
    this.dialogs = document.querySelectorAll(".dialog");
    /**
     * @type {HTMLElement[]}
     */
    this.btnsClose = document.querySelectorAll(".btn-close");

    this.init();
  }

  /**
   * @returns {void}
   */
  init() {
    window.addEventListener("click", (e) => this.toggleDialog(e));

    this.dialogs.forEach((dialog) => {
      dialog.addEventListener("click", () => this.closingDialog(dialog));

      /**
       * @type {HTMLElement[]}
       */
      const children = dialog.querySelectorAll(":scope > *");
      children.forEach((child) => {
        child.addEventListener("click", (e) => e.stopImmediatePropagation());
      });
    });

    this.btnsClose.forEach((btn) =>
      btn.addEventListener("click", () => {
        this.dialogs.forEach((dialog) => this.closingDialog(dialog));
      })
    );
  }

  /**
   * @param {MouseEvent} e
   * @returns {void}
   */
  toggleDialog(e) {
    /**
     * @type {HTMLElement}
     */
    const target = e.target;
    /**
     * @type {string|null}
     */
    const dialogSelector = target.getAttribute("data-dialog");

    if (dialogSelector) {
      /**
       * @type {HTMLElement|null}
       */
      const dialog = document.querySelector(dialogSelector);

      if (dialog) {
        if (dialog.hasAttribute("open")) {
          this.closingDialog(dialog);
        } else {
          dialog.setAttribute("open", "");
        }
      }
    }
  }

  /**
   * @param {HTMLElement} dialog
   * @returns {void}
   */
  closingDialog(dialog) {
    dialog.setAttribute("closing", "");
    dialog.addEventListener("animationend", () => this.closeDialog(dialog), {
      once: true,
    });
  }

  /**
   * @param {HTMLElement} dialog
   * @returns {void}
   */
  closeDialog(dialog) {
    dialog.removeAttribute("open");
    dialog.removeAttribute("closing");
  }
}
