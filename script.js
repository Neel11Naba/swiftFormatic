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
                const extractedText = texts.join("\n");
                saveAsWordFile(extractedText);
            });
        }).catch(error => {
            console.error("Error reading PDF:", error);
            alert("Failed to extract text from PDF.");
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
    console.log("File selected for conversion:", file.name);

    const reader = new FileReader();
    reader.onload = function (event) {
        console.log("File read successfully.");
        const arrayBuffer = event.target.result;

        // Use Mammoth.js to extract text (preserves bold, italics, headings)
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(result => {
            console.log("Mammoth.js conversion successful.");
            const extractedText = result.value;
            
            // Initialize jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.setFont("times");

            if (!extractedText.trim()) {
                alert("No text extracted. Try a different Word file.");
                return;
            }

            // Split text into lines for proper formatting
            let lines = pdf.splitTextToSize(extractedText, 180);
            pdf.text(10, 10, lines);
            
            console.log("Saving PDF...");
            pdf.save("converted.pdf");
        }).catch(error => {
            console.error("Error converting DOCX to PDF:", error);
            alert("Failed to convert Word to PDF.");
        });
    };
    
    reader.onerror = function () {
        console.error("Error reading the file.");
        alert("Failed to read the Word file.");
    };

    reader.readAsArrayBuffer(file);
}

//Create Image to Word file
function convertImageToWord(file) {
    console.log("Image selected:", file.name);

    const reader = new FileReader();
    reader.onload = function (event) {
        const imgData = event.target.result;

        Tesseract.recognize(
            imgData,
            'eng', // Language: English (can add others)
            {
                logger: m => console.log(m)
            }
        ).then(({ data: { text } }) => {
            console.log("Extracted Text:", text);

            if (!text.trim()) {
                alert("No text detected. Try another image.");
                return;
            }

            // Create Word file
            const blob = new Blob([text], { type: "application/msword" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "extracted.doc";
            link.click();
        }).catch(error => {
            console.error("OCR Error:", error);
            alert("Failed to extract text from image.");
        });
    };

    reader.readAsDataURL(file);
}

//convert Image to Excel File
function convertImageToExcel(file) {
    console.log("Image selected:", file.name);

    const reader = new FileReader();
    reader.onload = function (event) {
        const imgData = event.target.result;

        Tesseract.recognize(
            imgData,
            'eng',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            console.log("Extracted Text:", text);

            if (!text.trim()) {
                alert("No text detected. Try another image.");
                return;
            }

            // Convert extracted text into an array format
            let textLines = text.split("\n").map(line => [line]); // Each line in a separate row
            console.log("Formatted Text for Excel:", textLines);

            // Convert extracted text into Excel sheet
            let ws = XLSX.utils.aoa_to_sheet(textLines);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Extracted Data");

            console.log("Saving Excel file...");
            XLSX.writeFile(wb, "extracted.xlsx");
        }).catch(error => {
            console.error("OCR Error:", error);
            alert("Failed to extract text from image.");
        });
    };

    reader.readAsDataURL(file);
}
