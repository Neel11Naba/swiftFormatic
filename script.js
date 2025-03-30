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
    reader.onload = function (e) {
        const content = e.target.result;
        console.log("File Loaded: ", content);

        if (type === "text-pdf") {
            convertTextToPDF(content);
        } else if (type === "word-pdf") {
            convertWordToPDF(file);
        } else if (type === "pdf-word") {
            convertPDFToWord(file);
        } else if (type === "image-pdf") {
            convertImageToPDF(file);
        }
    };
    if (type === "text-pdf") {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
});

input.click();

}

function convertTextToPDF(text) { const { jsPDF } = window.jspdf; let pdf = new jsPDF(); pdf.text(text, 10, 10); pdf.save("converted.pdf"); }

function convertWordToPDF(file) { alert("Word to PDF conversion is not yet implemented."); }

function convertPDFToWord(file) { alert("PDF to Word conversion is not yet implemented."); }

function convertImageToPDF(file) { const { jsPDF } = window.jspdf; let pdf = new jsPDF(); let img = new Image(); img.src = URL.createObjectURL(file); img.onload = function () { pdf.addImage(img, 'JPEG', 10, 10, 180, 160); pdf.save("converted.pdf"); }; }

