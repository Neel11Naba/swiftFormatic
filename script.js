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
