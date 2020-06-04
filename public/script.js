const myForm = document.querySelector("#myForm");
const message = document.querySelector("#message");
const emailText = document.querySelector("#email");
const keyLabel = document.querySelector("#key-label");
const keyText = document.querySelector("#key");
const tooltip = document.querySelector("#myTooltip");
const copyBtn = document.querySelector("#copy");
const tryKey = document.querySelector("#try-key");
const tryBtn = document.querySelector("#try-btn");

showKey(false);

myForm.addEventListener("submit", submitUser, false);
copyBtn.style.display = "none";
copyBtn.addEventListener("click", () => {
  keyText.select();
  keyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  keyText.setSelectionRange(0, 0);
  tooltip.textContent = "Key copied: " + keyText.value;
});

copyBtn.addEventListener("onmouseout", () => {
  tooltip.textContent = "Copy to clipboard";
});

tryBtn.addEventListener("click", async () => {
  call_endpoint().then(i => {
    tryBtn.textContent = "Try me! " + i;
  });
});

function showKey(show) {
  if (show) {
    keyLabel.style.display = "inline-block";
    keyText.style.display = "inline-block";
  } else {
    keyLabel.style.display = "none";
    keyText.style.display = "none";
    copyBtn.style.display = "none";
  }
}

function submitUser(event) {
  event.preventDefault();
  const userData = {
    email: myForm.elements[0].value,
    password: myForm.elements[1].value
  };

  emailText.textContent = "Email: " + userData.email;

  fetch("/submit-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
    .then(response => response.json())
    .then(data => {
      showKey(true);
      if ("key" in data) {
        message.textContent = "A matching key has been found";
        keyText.value = data.key;
        copyBtn.style.display = "inline-block";
      } else {
        keyText.value = "N/A";
        copyBtn.style.display = "none";
        switch (data.error) {
          case 0:
            message.textContent = "Connection Error!";
            break;
          case 1:
            message.textContent =
              "This user already exists. Password doesn't match.";
            break;
          case 2:
            message.textContent = "Creating a new user...";
            addUser(userData);
            break;
          default:
            message.textContent = "Unknown Error :(";
        }
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  myForm.reset();
  myForm.elements.email.focus();
}

function addUser(userData) {
  fetch("/add-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
    .then(response => response.json())
    .then(data => {
      if ("key" in data) {
        message.textContent = "A new key has been created";
        keyText.value = data.key;
        copyBtn.style.display = "inline-block";
      }
    });
}

function call_endpoint() {
  return fetch(`/v1/next?key=${tryKey.value}`)
    .then(response => response.json())
    .then(data => ("integer" in data ? data.integer : -1));
}
