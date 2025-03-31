function preprocessImage(file, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imgData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            pixels[i] = avg;
            pixels[i + 1] = avg;
            pixels[i + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);

        callback(canvas.toDataURL("image/png"));
    };

    img.src = URL.createObjectURL(file);
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tool").forEach(button => {
        button.addEventListener("click", function () {
            const type = this.getAttribute("data-type");
            if (!type) {
                console.error("Error: data-type is missing!");
                alert("Error: data-type is missing!");
                return;
            }

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
            if (!this.files[0]) {
                alert("No file selected!");
                return;
            }
            convertPDFToWord(this.files[0]);
        });
        input.click();
    } else if (type === "word-pdf") {
        input.accept = ".doc,.docx";
        input.addEventListener("change", function () {
            if (!this.files[0]) {
                alert("No file selected!");
                return;
            }
            convertWordToPDF(this.files[0]);
        });
        input.click();
    } else if (type === "image-pdf") {
        input.accept = "image/*";
        input.addEventListener("change", function () {
            if (!this.files[0]) {
                alert("No file selected!");
                return;
            }
            convertImageToPDF(this.files[0]);
        });
        input.click();
    } else if (type === "image-word") {
        input.accept = "image/*";
        input.addEventListener("change", function () {
            if (!this.files[0]) {
                alert("No file selected!");
                return;
            }
            convertImageToWord(this.files[0]);
        });
        input.click();
    } else if (type === "image-excel") {
        input.accept = "image/*";
        input.addEventListener("change", function () {
            if (!this.files[0]) {
                alert("No file selected!");
                return;
            }
            convertImageToExcel(this.files[0]);
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
    const reader = new FileReader();
    reader.onload = function () {
        const typedArray = new Uint8Array(reader.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
            let textPromises = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                textPromises.push(pdf.getPage(i).then(page => page.getTextContent().then(textContent => {
                    return textContent.items.map(item => item.str).join(" ");
                })));
            }
            Promise.all(textPromises).then(texts => {
                saveAsWordFile(texts.join("\n"));
            });
        });
    };
    reader.readAsArrayBuffer(file);
}

function saveAsWordFile(text) {
    const blob = new Blob([text], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "converted.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertWordToPDF(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        mammoth.convertToHtml({ arrayBuffer: event.target.result }).then(result => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            let lines = pdf.splitTextToSize(result.value, 180);
            pdf.text(10, 10, lines);
            pdf.save("converted.pdf");
        });
    };
    reader.readAsArrayBuffer(file);
}

function convertImageToWord(file) {
    preprocessImage(file, function (processedImage) {
        Tesseract.recognize(processedImage, 'eng').then(({ data: { text } }) => {
            saveAsWordFile(text);
        });
    });
}

function convertImageToExcel(file) {
    preprocessImage(file, function (processedImage) {
        Tesseract.recognize(processedImage, 'eng').then(({ data: { text } }) => {
            let rows = text.split("\n").map(row => row.trim().split(/\s+/));
            let ws = XLSX.utils.aoa_to_sheet(rows);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Extracted Data");
            XLSX.writeFile(wb, "extracted.xlsx");
        });
    });
            }
