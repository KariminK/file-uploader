const moreBtns = document.querySelectorAll(".more-btn");
const moreContainers = document.querySelectorAll(".more-container");

const hideAll = () => {
  moreContainers.forEach((container) => container.classList.add("hidden"));
};

moreBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    hideAll();
    btn.nextElementSibling.classList.toggle("hidden");
  });
});

addEventListener("click", hideAll);
