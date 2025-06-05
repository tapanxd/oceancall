const form = document.getElementById("uploadForm")
const fileInput = document.getElementById("audioFile")
const fileUploadArea = document.getElementById("fileUploadArea")
const fileInfo = document.getElementById("fileInfo")
const loadingEl = document.getElementById("loading")
const resultEl = document.getElementById("result")
const speciesEl = document.getElementById("species")
const probabilitiesEl = document.getElementById("probabilities")

const API_URL = "https://p5ezrtfbu2.execute-api.us-east-1.amazonaws.com/default/OceanCallAudioHandler"

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
      // Trigger the change event to update file info
      const event = new Event("change", { bubbles: true })
      fileInput.dispatchEvent(event)
    } else {
      alert("Please upload a valid .wav file.")
    }
  }
}

// File input change - integrated your code
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    fileInfo.innerText = `Selected file: ${fileInput.files[0].name}`
    fileInfo.style.display = "block"
  } else {
    fileInfo.innerText = ""
    fileInfo.style.display = "none"
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

// Form submission - integrated your code and fixed for your API response
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  resultEl.classList.add("hidden")
  loadingEl.classList.remove("hidden")

  const file = fileInput.files[0]
  if (!file) {
    alert("Please select an audio file.")
    loadingEl.classList.add("hidden")
    return
  }

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Server returned an error.")
    }

    const data = await response.json()

    // Display the prediction
    speciesEl.innerText = data.prediction

    // Clear previous results
    probabilitiesEl.innerHTML = ""

    // Create a single probability item showing the confidence
    const confidenceItem = document.createElement("div")
    confidenceItem.className = "probability-item"
    confidenceItem.innerHTML = `
      <span class="probability-label">${data.prediction}</span>
      <span class="probability-value">${(data.confidence * 100).toFixed(2)}%</span>
    `
    probabilitiesEl.appendChild(confidenceItem)

    resultEl.classList.remove("hidden")
  } catch (err) {
    alert("❌ Error: " + err.message)
  } finally {
    loadingEl.classList.add("hidden")
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
