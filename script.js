// ✅ Image to PDF (Fixed Image Cut Issue)
function convertImageToPDF() {
    let fileInput = document.getElementById('imageInput').files[0];
    if (!fileInput) {
        alert("Please select an image first.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        let img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            let pdf = new jspdf.jsPDF();
            let pageWidth = pdf.internal.pageSize.getWidth();
            let pageHeight = pdf.internal.pageSize.getHeight();

            // Auto scale image to fit in PDF
            let imgWidth = pageWidth - 20;
            let imgHeight = (img.height / img.width) * imgWidth;

            if (imgHeight > pageHeight - 20) {
                imgHeight = pageHeight - 20;
                imgWidth = (img.width / img.height) * imgHeight;
            }

            pdf.addImage(img.src, "JPEG", 10, 10, imgWidth, imgHeight);
            pdf.save("converted.pdf");
        };
    };
    reader.readAsDataURL(fileInput);
}

// ✅ PDF to Word (Fixed Error - Now Uses PDF.js)
function convertPDFToWord() {
    let fileInput = document.getElementById('pdfToWordInput').files[0];
    if (!fileInput) {
        alert("Please select a PDF file first.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        pdfjsLib.getDocument({ data: event.target.result }).promise.then(pdf => {
            let fullText = "";
            let promises = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                promises.push(pdf.getPage(i).then(page => {
                    return page.getTextContent().then(textContent => {
                        let pageText = textContent.items.map(item => item.str).join(" ");
                        fullText += `\n--- Page ${i} ---\n` + pageText;
                    });
                }));
            }
            Promise.all(promises).then(() => {
                let blob = new Blob([fullText], { type: "application/msword" });
                let link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "converted.docx";
                link.click();
            });
        }).catch(err => {
            console.error("Error:", err);
            alert("Failed to convert PDF to Word.");
        });
    };
    reader.readAsArrayBuffer(fileInput);
}

// ✅ Word to PDF (Fixed Text Cutting)
function convertWordToPDF() {
    let fileInput = document.getElementById('wordToPDFInput').files[0];
    if (!fileInput) {
        alert("Please select a Word file first.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        let text = event.target.result;
        let pdf = new jspdf.jsPDF();
        let margin = 10;
        let pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        let pageHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
        let lineHeight = 10;

        let lines = pdf.splitTextToSize(text, pageWidth);
        let cursorY = margin;
        for (let i = 0; i < lines.length; i++) {
            if (cursorY + lineHeight > pageHeight) {
                pdf.addPage();
                cursorY = margin;
            }
            pdf.text(lines[i], margin, cursorY);
            cursorY += lineHeight;
        }

        pdf.save("converted.pdf");
    };
    reader.readAsText(fileInput);
                  }
