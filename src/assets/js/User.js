/**
 * @type {User}
 */
export default class User {
  /**
   * @param {string} name
   * @param {string} avatar
   */
  constructor(name, avatar) {
    /**
     * @type {HTMLElement}
     */
    this.currentNameHtml = document.querySelector(".current-name");
    /**
     * @type {HTMLElement}
     */
    this.currentAvatarHtml = document.querySelector(".current-avatar");

    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {string}
     */
    this.avatar = avatar;

    /**
     * @type {User|null}
     */

    this.currentUser = null;
  }

  /**
   * @returns {void}
   */
  saveCurrentUser() {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ name: this.name, avatar: this.avatar })
    );
  }

  /**
   * @returns {User|null}
   */
  static getCurrentUser() {
    /**
     * @type {object|null}
     */
    const currentUserData = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUserData) {
      return new User(currentUserData.name, currentUserData.avatar);
    }

    return null;
  }

  /**
   * @returns {void}
   */
  setUser() {
    this.currentUser = User.getCurrentUser();
    this.currentNameHtml.textContent = currentUser.name;
    this.currentAvatarHtml.setAttribute("src", currentUser.avatar);
  }
}
