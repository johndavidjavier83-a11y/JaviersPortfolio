/* =========================
   SCORE SYSTEM
========================= */

const scoreInputs = {
    quizScore: "quizProgress",
    longQuizScore: "longQuizProgress",
    midtermScore: "midtermProgress",
    finalScore: "finalProgress",
    labScore: "labProgress",
    projectScore: "projectProgress"
};


/* LOAD SAVED SCORES */

Object.keys(scoreInputs).forEach(inputId => {

    const input = document.getElementById(inputId);

    const savedScore = localStorage.getItem(inputId);

    if (savedScore !== null) {
        input.value = savedScore;
    }

    input.addEventListener("input", updateScores);

});


/* UPDATE SCORES */

function updateScores() {

    let total = 0;
    let count = 0;

    Object.keys(scoreInputs).forEach(inputId => {

        const input = document.getElementById(inputId);
        const progress = document.getElementById(scoreInputs[inputId]);

        let value = Number(input.value);

        if (value < 0) value = 0;
        if (value > 100) value = 100;

        input.value = value;

        progress.style.width = value + "%";

        localStorage.setItem(inputId, value);

        total += value;
        count++;

    });


    const average = count > 0 ? total / count : 0;

    const rounded = Math.round(average);

    document.getElementById("overallScore").textContent =
        rounded + "%";

    document.getElementById("overallProgress").style.width =
        rounded + "%";

    document.getElementById("heroAverage").textContent =
        rounded + "%";


    let message;

    if (rounded >= 90) {
        message = "Excellent performance!";
    }
    else if (rounded >= 80) {
        message = "Very good performance!";
    }
    else if (rounded >= 75) {
        message = "Good job! Keep improving!";
    }
    else if (rounded > 0) {
        message = "Keep studying and improving!";
    }
    else {
        message = "Enter your scores above";
    }

    document.getElementById("performanceText").textContent =
        message;
}


/* INITIAL UPDATE */

updateScores();


/* =========================
   IMAGE UPLOAD SYSTEM
========================= */

const fileInput = document.getElementById("fileInput");
const uploadCategory = document.getElementById("uploadCategory");
const gallery = document.getElementById("gallery");

let uploadedImages =
    JSON.parse(localStorage.getItem("academicImages")) || [];


/* FILE UPLOAD */

fileInput.addEventListener("change", function () {

    const files = Array.from(this.files);

    files.forEach(file => {

        if (!file.type.startsWith("image/")) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            const image = {
                id: Date.now() + Math.random(),
                name: file.name,
                category: uploadCategory.value,
                src: event.target.result
            };

            uploadedImages.push(image);

            saveImages();

            displayImages();

        };

        reader.readAsDataURL(file);

    });

    this.value = "";

});


/* SAVE */

function saveImages() {

    localStorage.setItem(
        "academicImages",
        JSON.stringify(uploadedImages)
    );

    updateUploadCount();
}


/* DISPLAY */

function displayImages() {

    gallery.innerHTML = "";

    if (uploadedImages.length === 0) {

        gallery.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
                color:#777;
            ">
                No academic pictures uploaded yet.
            </div>
        `;

        return;
    }


    uploadedImages.forEach(image => {

        const card = document.createElement("div");

        card.className = "image-card";

        card.innerHTML = `

            <button
                class="delete-btn"
                onclick="deleteImage(${image.id})"
            >
                ×
            </button>

            <img
                src="${image.src}"
                alt="${image.name}"
                onclick="openImage('${image.src}')"
            >

            <div class="image-info">

                <strong>
                    ${formatCategory(image.category)}
                </strong>

                <small>
                    ${image.name}
                </small>

            </div>

        `;

        gallery.appendChild(card);

    });


    updateUploadCount();
}


/* DELETE */

function deleteImage(id) {

    const confirmDelete =
        confirm("Delete this picture?");

    if (!confirmDelete) return;

    uploadedImages =
        uploadedImages.filter(image => image.id !== id);

    saveImages();

    displayImages();
}


/* CATEGORY NAME */

function formatCategory(category) {

    const names = {
        quiz: "Quiz",
        longQuiz: "Long Quiz",
        midterm: "Midterms",
        final: "Finals",
        laboratory: "Laboratory",
        project: "Project"
    };

    return names[category] || category;
}


/* COUNT */

function updateUploadCount() {

    document.getElementById("heroUploads").textContent =
        uploadedImages.length;
}


/* =========================
   IMAGE MODAL
========================= */

const modal =
    document.getElementById("imageModal");

const modalImage =
    document.getElementById("modalImage");

const closeModal =
    document.getElementById("closeModal");


function openImage(src) {

    modalImage.src = src;

    modal.classList.add("show");
}


closeModal.addEventListener("click", function () {

    modal.classList.remove("show");

});


modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        modal.classList.remove("show");
    }

});


/* =========================
   DARK / LIGHT MODE
========================= */

const themeBtn =
    document.getElementById("themeBtn");


const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "light") {

    document.body.classList.add("light");

    themeBtn.textContent = "☀";

}


themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    localStorage.setItem(
        "theme",
        isLight ? "light" : "dark"
    );

    themeBtn.textContent =
        isLight ? "☀" : "☾";

});


/* =========================
   DRAG & DROP
========================= */

const uploadBox =
    document.querySelector(".upload-box");


uploadBox.addEventListener("dragover", function(event) {

    event.preventDefault();

    uploadBox.style.borderColor =
        "#7c5cff";

});


uploadBox.addEventListener("dragleave", function() {

    uploadBox.style.borderColor =
        "#353746";

});


uploadBox.addEventListener("drop", function(event) {

    event.preventDefault();

    uploadBox.style.borderColor =
        "#353746";

    const files =
        Array.from(event.dataTransfer.files);

    processDroppedFiles(files);

});


function processDroppedFiles(files) {

    files.forEach(file => {

        if (!file.type.startsWith("image/")) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload = function(event) {

            uploadedImages.push({

                id: Date.now() + Math.random(),

                name: file.name,

                category:
                    uploadCategory.value,

                src:
                    event.target.result

            });

            saveImages();

            displayImages();

        };

        reader.readAsDataURL(file);

    });

}


/* =========================
   NAVIGATION ANIMATION
========================= */

const sections =
    document.querySelectorAll("section");

const navLinks =
    document.querySelectorAll("nav a");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.classList.add("active");

        }

    });

});


/* INITIAL GALLERY */

displayImages();