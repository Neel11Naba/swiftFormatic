document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".tool").forEach(button => { button.addEventListener("click", function (event) { event.preventDefault(); const type = this.getAttribute("data-type"); console.log("Selected Conversion Type:", type); handleConversion(type); }); }); });

function handleConversion(type) { let input = document.createElement("input"); input.type = "file";

if (type === "text-pdf") {
    input.accept = ".txt";
} else if (type === "word-pdf") {
    input.accept = ".docx";
} else if (type === "pdf-word") {
    input.accept = ".pdf";
} else if (type === "image-pdf") {
    input.accept = "image/*";
}

input.addEventListener("change", function () {
    const file = input.files[0];
    if (!file) {
        console.error("No file selected");
        return;
    }
    console.log("File Selected:", file.name);

    if (type === "text-pdf") {
        convertTextToPDF(file);
    } else if (type === "word-pdf") {
        alert("Word to PDF conversion is not yet implemented.");
    } else if (type === "pdf-word") {
        alert("PDF to Word conversion is not yet implemented.");
    } else if (type === "image-pdf") {
        convertImageToPDF(file);
    }
});

input.click();

}

function convertTextToPDF(file) { const reader = new FileReader(); reader.onload = function (e) { const text = e.target.result; console.log("Text File Content:", text); const { jsPDF } = window.jspdf; let pdf = new jsPDF(); pdf.text(text, 10, 10); pdf.save("converted.pdf"); console.log("Text to PDF conversion complete"); }; reader.readAsText(file); }

function convertImageToPDF(file) { const { jsPDF } = window.jspdf; let pdf = new jsPDF(); let img = new Image(); img.src = URL.createObjectURL(file); img.onload = function () { console.log("Image loaded for conversion"); pdf.addImage(img, 'JPEG', 10, 10, 180, 160); pdf.save("converted.pdf"); console.log("Image to PDF conversion complete"); }; }

