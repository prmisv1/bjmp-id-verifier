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
  const verifyBtn = document.getElementById("verifyBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");
  const statusMessage = document.getElementById("statusMessage");
  const resultContainer = document.getElementById("resultContainer");

  if (!idInput) {
    statusMessage.textContent = "Please enter an ID Number.";
    resultContainer.style.display = "none";
    return;
  }

  statusMessage.textContent = "";
  resultContainer.style.display = "none";
  verifyBtn.disabled = true;
  btnText.style.display = "none";
  btnSpinner.style.display = "inline-block";

  try {
    const response = await fetch(`/api/server?id=${encodeURIComponent(idInput)}`);
    const result = await response.json();

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
    statusMessage.textContent = "Error connecting to the verification database.";
    console.error(error);
  } finally {
    
    verifyBtn.disabled = false;
    btnText.style.display = "inline";
    btnSpinner.style.display = "none";
  }
}
