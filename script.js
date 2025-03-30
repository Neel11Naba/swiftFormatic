document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tool").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const type = this.getAttribute("data-type");

            if (!type) {
                console.error("Error: data-type is missing for this button!");
                alert("Error: data-type is missing!");
                return;
            }

            console.log("Button Clicked:", type);
            alert("Button Clicked: " + type);
            handleConversion(type);
        });
    });
});

function handleConversion(type) {
    if (type === "text-pdf") {
        // Show text input popup
        const userText = prompt("Enter text to convert to PDF:");
        if (!userText) {
            alert("No text entered!");
            return;
        }
        convertTextToPDF(userText);
    } else {
        let input = document.createElement("input");
        input.type = "file";

        if (type === "image-pdf") input.accept = "image/*";
        if (type === "pdf-word") input.accept = ".pdf";
        if (type === "word-pdf") input.accept = ".doc,.docx";

        input.addEventListener("change", function () {
            const file = input.files[0];
            if (!file) {
                alert("No file selected!");
                return;
            }
            alert("File Selected: " + file.name);

            if (type === "image-pdf") convertImageToPDF(file);
            if (type === "pdf-word") convertPDFToWord(file);
            if (type === "word-pdf") convertWordToPDF(file);
        });

        input.click();
    }
}

function convertTextToPDF(text) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save("text-to-pdf.pdf");
}

function convertImageToPDF(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.addImage(img, "JPEG", 10, 10, 180, 160);
            doc.save("image-to-pdf.pdf");
        };
    };
    reader.readAsDataURL(file);
}

function convertPDFToWord(file) {
    alert("PDF to Word conversion is not yet implemented.");
}

function convertWordToPDF(file) {
    alert("Word to PDF conversion is not yet implemented.");
}
