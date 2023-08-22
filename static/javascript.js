var fileOrder = []; // Array to store the order of checked files

        function showChosenFiles() {
          var fileInput = document.querySelector('input[type="file"]');
          var chosenFiles = fileInput.files;

          var chosenFilesDiv = document.getElementById("chosenFilesDiv");
          chosenFilesDiv.innerHTML = "";

          var form = document.createElement("form");

          for (var i = 0; i < chosenFiles.length; i++) {
            var file = chosenFiles[i];
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "fileCheckbox";
            checkbox.value = file.name;
            checkbox.classList.add("checkbox-style");

            var label = document.createElement("label");
            label.textContent = file.name;

            var lineBreak = document.createElement("br");

            form.appendChild(checkbox);
            form.appendChild(label);
            form.appendChild(lineBreak);
          }

          chosenFilesDiv.appendChild(form);

          // Update the fileOrder array based on checkbox order
          var fileCheckboxes = document.querySelectorAll(
            'input[name="fileCheckbox"]'
          );
          fileOrder = [];

          fileCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener("change", function () {
              if (this.checked) {
                fileOrder.push(this.value); // Add the file name to the fileOrder array
              } else {
                var index = fileOrder.indexOf(this.value);
                if (index !== -1) {
                  fileOrder.splice(index, 1); // Remove the file name from the fileOrder array
                }
              }
              console.log(fileOrder);

              // Call the function to display the selected order
              displaySelectedOrder();
            });
          });
        }

        function displaySelectedOrder() {
          var selectedOrderElement = document.getElementById("selectedOrder");
          selectedOrderElement.innerHTML = ""; // Clear the existing content

          fileOrder.forEach(function (fileName) {
            var fileItem = document.createElement("div");
            fileItem.textContent = fileName;
            selectedOrderElement.appendChild(fileItem); // Append the file names to the selectedOrderElement
          });
        }

        // Submit form and merge files
        document
          .getElementById("myForm")
          .addEventListener("submit", function (event) {
            event.preventDefault();

            var fileInput = document.querySelector('input[type="file"]');
            var chosenFiles = fileInput.files;

            // Sort the chosen files based on the selected order
            var sortedFiles = [];
            fileOrder.forEach(function (fileName) {
              var fileIndex = Array.from(chosenFiles).findIndex(
                (file) => file.name === fileName.trim()
              );
              sortedFiles.push(chosenFiles[fileIndex]);
            });

            // Create a FormData object
            var formData = new FormData();

            // Append the sorted files to the FormData object
            for (var i = 0; i < sortedFiles.length; i++) {
              formData.append("files[]", sortedFiles[i]);
            }

            fetch("/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("File upload failed");
                }
                return response.blob();
              })
              .then((blob) => {
                // Create a download button for the merged file
                var downloadButton = document.createElement("button");
                downloadButton.textContent =
                  "Click here to download the merged file";
                downloadButton.classList.add("download-button");
                downloadButton.classList.add("btn");

                // Set the download button behavior
                downloadButton.addEventListener("click", function () {
                  var downloadLink = document.createElement("a");
                  downloadLink.href = URL.createObjectURL(blob);
                  downloadLink.download = "merged_workbook.xlsx";
                  downloadLink.style.display = "none";
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                });

                // Append the download button to the desired element
                var downloadButtonDiv = document.getElementById("downloadLink");
                downloadButtonDiv.innerHTML = "";
                downloadButtonDiv.appendChild(downloadButton);
              })
              .catch((error) => {
                console.error(error);
                alert("File upload failed");
              });
          });
          //Alert function 
          function myFunction() {
          alert("Please don't refress merging is in process!");
        }    