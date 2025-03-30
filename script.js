document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tool").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const type = this.getAttribute("data-type");
            alert("Button Clicked: " + type);
            handleConversion(type);
        });
    });
});

function handleConversion(type) {
    let input = document.createElement("input");
    input.type = "file";
    
    if (type === "text-pdf") input.accept = ".txt";
    if (type === "image-pdf") input.accept = "image/*";

    input.addEventListener("change", function () {
        const file = input.files[0];
        if (!file) {
            alert("No file selected!");
            return;
        }
        alert("File Selected: " + file.name);

        if (type === "text-pdf") convertTextToPDF(file);
        if (type === "image-pdf") convertImageToPDF(file);
    });
    
    input.click();
}

function convertTextToPDF(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        alert("Converting: " + file.name);
        
        const { jsPDF } = window.jspdf;
        let pdf = new jsPDF();
        pdf.text(text, 10, 10);
        pdf.save("converted.pdf");
        alert("Download Started!");
    };
    reader.readAsText(file);
}

function convertImageToPDF(file) {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();
    let img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = function () {
        alert("Image Loaded: " + file.name);
        pdf.addImage(img, 'JPEG', 10, 10, 180, 160);
        pdf.save("converted.pdf");
        alert("Download Started!");
    };
            }
