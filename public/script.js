document.addEventListener("DOMContentLoaded", () => {
  const verifyBtn = document.getElementById("verifyBtn");
  const idInput = document.getElementById("idInput");

  verifyBtn.addEventListener("click", verifyID);
  
  idInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      verifyID();
    }
  });
});

function maskName(fullName) {
  if (!fullName) return "";
  
  return fullName
    .split(" ")
    .map(word => {
      if (word.length <= 2) {
        return word;
      }
      
      const firstChar = word.charAt(0);
      const lastChar = word.charAt(word.length - 1);
      const maskedMiddle = "*".repeat(word.length - 2);
      
      return `${firstChar}${maskedMiddle}${lastChar}`;
    })
    .join(" ");
}

async function verifyID() {
  const idInput = document.getElementById("idInput").value.trim();
  const loader = document.getElementById("loader");
  const statusMessage = document.getElementById("statusMessage");
  const resultContainer = document.getElementById("resultContainer");

  if (!idInput) {
    statusMessage.textContent = "Please enter an ID Number.";
    resultContainer.style.display = "none";
    return;
  }

  statusMessage.textContent = "";
  resultContainer.style.display = "none";
  loader.style.display = "block";

  try {
    const response = await fetch(`/api/server?id=${encodeURIComponent(idInput)}`);
    const result = await response.json();

    loader.style.display = "none";

    if (result.status === "success") {
      document.getElementById("resId").textContent = result.data.idCode;
      document.getElementById("resRank").textContent = result.data.rank;
      document.getElementById("resName").textContent = maskName(result.data.name);
      
      const validityBadge = document.getElementById("resValidity");
      validityBadge.textContent = result.data.validity;

      if (result.data.validity.toUpperCase() === "ACTIVE") {
        validityBadge.className = "badge badge-active";
      } else {
        validityBadge.className = "badge badge-inactive";
      }

      resultContainer.style.display = "block";
    } else {
      statusMessage.textContent = result.message || "Record not found.";
    }
  } catch (error) {
    loader.style.display = "none";
    statusMessage.textContent = "Error connecting to the verification database.";
    console.error(error);
  }
}
