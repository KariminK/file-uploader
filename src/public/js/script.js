const moreBtns = document.querySelectorAll(".more-btn");

moreBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.nextElementSibling.classList.toggle("hidden");
  });
});
