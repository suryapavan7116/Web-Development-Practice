const carousel = document.getElementById("carousel");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

rightBtn.addEventListener("click", () => {
carousel.scrollBy({
left: 300,
behavior: "smooth"
});
});

leftBtn.addEventListener("click", () => {
carousel.scrollBy({
left: -300,
behavior: "smooth"
});
});

