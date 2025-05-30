const form = document.getElementById("uploadForm")
const fileInput = document.getElementById("audioFile")
const fileUploadArea = document.getElementById("fileUploadArea")
const fileInfo = document.getElementById("fileInfo")
const loadingEl = document.getElementById("loading")
const resultEl = document.getElementById("result")
const speciesEl = document.getElementById("species")
const probabilitiesEl = document.getElementById("probabilities")

const API_URL = "https://your-api-id.execute-api.us-east-1.amazonaws.com/predict"

// Create floating particles
function createParticles() {
  const particles = document.getElementById("particles")
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div")
    particle.style.position = "absolute"
    particle.style.width = "2px"
    particle.style.height = "2px"
    particle.style.background = Math.random() > 0.5 ? "#00ffff" : "#0080ff"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"
    particle.style.animation = `float-particles ${10 + Math.random() * 20}s linear infinite`
    particle.style.animationDelay = Math.random() * 20 + "s"
    particles.appendChild(particle)
  }
}

// Drag and drop functionality
fileUploadArea.addEventListener("dragenter", handleDrag)
fileUploadArea.addEventListener("dragover", handleDrag)
fileUploadArea.addEventListener("dragleave", handleDragLeave)
fileUploadArea.addEventListener("drop", handleDrop)

function handleDrag(e) {
  e.preventDefault()
  e.stopPropagation()
  fileUploadArea.classList.add("dragover")
}

function handleDragLeave(e) {
  e.preventDefault()
  e.stopPropagation()
  fileUploadArea.classList.remove("dragover")
}

function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  fileUploadArea.classList.remove("dragover")

  const files = e.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (file.type === "audio/wav") {
      fileInput.files = files
      showFileInfo(file)
    } else {
      alert("Please upload a valid .wav file.")
    }
  }
}

// File input change
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (file) {
    showFileInfo(file)
  }
})

function showFileInfo(file) {
  const sizeInMB = (file.size / 1024 / 1024).toFixed(2)
  fileInfo.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span>📁 ${file.name}</span>
      <span>${sizeInMB} MB</span>
    </div>
  `
  fileInfo.style.display = "block"
}

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const file = fileInput.files[0]
  if (!file || file.type !== "audio/wav") {
    alert("Please upload a valid .wav file.")
    return
  }

  loadingEl.classList.remove("hidden")
  resultEl.classList.add("hidden")

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "audio/wav" },
      body: file,
    })

    const data = await response.json()
    loadingEl.classList.add("hidden")

    speciesEl.textContent = data.prediction
    probabilitiesEl.innerHTML = ""

    for (const [label, prob] of Object.entries(data.probabilities)) {
      const li = document.createElement("div")
      li.className = "probability-item"
      li.innerHTML = `
        <span class="probability-label">${label}</span>
        <span class="probability-value">${(prob * 100).toFixed(2)}%</span>
      `
      probabilitiesEl.appendChild(li)
    }

    resultEl.classList.remove("hidden")
  } catch (err) {
    loadingEl.classList.add("hidden")
    alert("Error: " + err.message)
  }
})

function resetForm() {
  form.reset()
  fileInfo.style.display = "none"
  resultEl.classList.add("hidden")
  fileUploadArea.classList.remove("dragover")
}

// Initialize particles on load
document.addEventListener("DOMContentLoaded", createParticles)
