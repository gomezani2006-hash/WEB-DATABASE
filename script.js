const form = document.querySelector("#contact form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;

  let status = document.getElementById("form-status");
  if (!status) {
    status = document.createElement("p");
    status.id = "form-status";
    form.appendChild(status);
  }

  status.textContent = "Thanks, " + name + "! Your message has been sent.";
  form.reset();
});

const headingBtn = document.getElementById("heading-btn");
const heading = document.querySelector("h2");

headingBtn.addEventListener("click", function () {
  heading.textContent = "Welcome to my portfolio!";
});
