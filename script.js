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
    let input = document.createElement("input");
    input.type = "file";

    if (type === "text-pdf") {
        const userText = prompt("Enter text to convert to PDF:");
        if (!userText) {
            alert("No text entered!");
            return;
        }
        convertTextToPDF(userText);
    } else if (type === "pdf-word") {
        input.accept = ".pdf";
        input.addEventListener("change", function () {
            const file = input.files[0];
            if (!file) {
                alert("No file selected!");
                return;
            }
            convertPDFToWord(file);
        });
        input.click();
    } else if (type === "word-pdf") {
        input.accept = ".doc,.docx";
        input.addEventListener("change", function () {
            const file = input.files[0];
            if (!file) {
                alert("No file selected!");
                return;
            }
            convertWordToPDF(file);
        });
        input.click();
    } else if (type === "image-pdf") {
        input.accept = "image/*";
        input.addEventListener("change", function () {
            const file = input.files[0];
            if (!file) {
                alert("No file selected!");
                return;
            }
            convertImageToPDF(file);
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
    alert("PDF to Word conversion requires an online API. Try using an internet-based service.");
}

function convertWordToPDF(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const docxContent = event.target.result;

        Mammoth.convertToHtml({ arrayBuffer: docxContent })
            .then(function (result) {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                doc.text(result.value, 10, 10);
                doc.save("word-to-pdf.pdf");
            })
            .catch(function (error) {
                console.error("Error converting Word to PDF:", error);
                alert("Failed to convert Word to PDF.");
            });
    };

    reader.readAsArrayBuffer(file);
}
