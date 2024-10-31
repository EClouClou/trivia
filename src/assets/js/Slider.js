/**
 * @type {Slider}
 */
export default class Slider {
  constructor() {
    /**
     * @type {HTMLElement}
     */
    this.btnPrevious = document.querySelector(".btn-previous");
    /**
     * @type {HTMLElement}
     */
    this.btnNext = document.querySelector(".btn-next");
    /**
     * @type {HTMLElement[]}
     */
    this.slides = document.querySelectorAll(".avatar-choice");
    /**
     * @type {HTMLElement}
     */
    this.slidesContainer = document.querySelector(".avatar-choices");
    /**
     * @type {number}
     */
    this.currentSlideIndex = 0;

    this.updateSlidePosition();

    this.btnPrevious.addEventListener("click", () => this.changeSlide(-1));
    this.btnNext.addEventListener("click", () => this.changeSlide(1));

    window.addEventListener("resize", () => this.updateSlidePosition());

    this.handleAvatarClick();
  }

  /**
   * @returns {number}
   */
  getVisibleSlidesCount() {
    /**
     * @type {number}
     */
    const containerWidth = this.slidesContainer.offsetWidth;
    /**
     * @type {number}
     */
    const slideWidth = this.slides[0].offsetWidth;
    return Math.floor(containerWidth / slideWidth);
  }

  /**
   * @returns {void}
   */
  updateSlidePosition() {
    /**
     * @type {number}
     */
    const slideWidth = this.slides[0].offsetWidth;
    this.slidesContainer.scrollTo({
      left: slideWidth * this.currentSlideIndex,
      behavior: "smooth",
    });
  }

  /**
   * @returns {void}
   * @param {number} direction
   */
  changeSlide(direction) {
    /**
     * @type {number}
     */
    const totalSlides = this.slides.length;
    /**
     * @type {number}
     */
    const visibleSlidesCount = this.getVisibleSlidesCount();
    /**
     * @type {number}
     */
    const maxSlideIndex = totalSlides - visibleSlidesCount;

    this.currentSlideIndex =
      (this.currentSlideIndex + direction + totalSlides) % totalSlides;

    if (this.currentSlideIndex > maxSlideIndex) {
      this.currentSlideIndex = 0;
    }

    this.updateSlidePosition();
  }

  /**
   * @returns {void}
   */
  handleAvatarClick() {
    this.slides.forEach((slide) => {
      slide.addEventListener("click", () => this.changeAvatar(slide));
    });
  }

  /**
   * @param {HTMLElement} slide
   * @returns {void}
   */
  changeAvatar(slide) {
    /**
     * @type {HTMLElement}
     */
    const choosenAvatar = document.querySelector(".img-avatar");
    /**
     * @type {string | null}
     */
    const newAvatarSrc = slide.getAttribute("src");

    if (choosenAvatar) {
      choosenAvatar.setAttribute("src", newAvatarSrc);

      this.slides.forEach((otherSlide) => {
        otherSlide.classList.add("opacity-50");
      });

      slide.classList.remove("opacity-50");
    }
  }
}
