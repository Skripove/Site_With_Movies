const aboutBtn = document.querySelector(".about-btn");
const aboutContent = document.querySelector(".about-content");

aboutBtn.addEventListener("click", () => {
    aboutContent.classList.toggle("about-content-active");
});