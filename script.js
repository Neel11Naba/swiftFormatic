document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".tool").forEach(button => { button.addEventListener("click", function (event) { event.preventDefault(); const type = this.getAttribute("data-type"); handleConversion(type); }); }); });

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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        if (type === "text-pdf") {
            convertTextToPDF(reader.result);
        } else if (type === "word-pdf") {
            alert("Word to PDF conversion feature coming soon!");
        } else if (type === "pdf-word") {
            alert("PDF to Word conversion feature coming soon!");
        } else if (type === "image-pdf") {
            alert("Image to PDF conversion feature coming soon!");
        }
    };
    reader.readAsText(file);
});

input.click();

}

function convertTextToPDF(text) { const { jsPDF } = window.jspdf; let pdf = new jsPDF(); pdf.text(text, 10, 10); pdf.save("converted.pdf"); }

