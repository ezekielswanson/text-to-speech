function fileValidation(file) {
  const fileToValidate = file.name;
  console.log(fileToValidate, "file-val-check");

  let allowedExtensions = /(\.txt|\.doc|\.docx|\.pdf)$/i;

  if (!allowedExtensions.exec(fileToValidate)) {
      alert('Invalid File Type: Please upload a .txt, .doc. docx, or .pdf file type');
      fileInput.value = '';
      return false;
  }

  return true;
}

function dropHandler(event) {
  event.preventDefault();
 
  // Setting file var
  let file;

  // Ensure 1 file and validate
  if (event.dataTransfer.items.length === 1) {
      const uploadedFile = event.dataTransfer.items[0];
      file = uploadedFile.getAsFile();
      
      if (!fileValidation(file)) {
          return;
      }
  } else {
      [...event.dataTransfer.files].forEach((file, i) => {
          console.log(`… file[${i}].name = ${file.name}`);
      });
      
      alert('Please upload only one file at a time');
      return;
  }

  // Create form object
  const formData = new FormData();

  // Append the file
  formData.append('file', file);
  
  // Send to server
  fetch('/files/upload', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Upload failed');
      }
      return response.json();
  })
  .then(data => {
      console.log('Upload successful:', data);
      
      // If the file has text content, update the textarea
      if (data.hasTextContent) {
          // Get the text content from the server
          fetch(`/files/${data.fileId}/text`)
              .then(response => response.json())
              .then(textData => {
                  document.querySelector('textarea').value = textData.textContent;
                  alert('File uploaded and text extracted successfully!');
              })
              .catch(error => {
                  console.error('Error getting text:', error);
                  alert('File uploaded but could not retrieve text content.');
              });
      } else {
          alert('File uploaded but no text could be extracted.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Failed to upload file. Please try again.');
  });
}

// Handle click to upload
document.addEventListener('DOMContentLoaded', function() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  
  // Make the dropzone clickable
  if (dropZone) {
      dropZone.addEventListener('click', function() {
          fileInput.click();
      });
  }
  
  // Handle file selection through input
  if (fileInput) {
      fileInput.addEventListener('change', function(event) {
          if (event.target.files.length > 0) {
              const file = event.target.files[0];
              if (fileValidation(file)) {
                  // Create form object
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  // Use the same fetch logic as in dropHandler
                  fetch('/files/upload', {
                      method: 'POST',
                      body: formData
                  })
                  .then(response => response.json())
                  .then(data => {
                      console.log('Upload successful:', data);
                      if (data.hasTextContent) {
                          fetch(`/files/${data.fileId}/text`)
                              .then(response => response.json())
                              .then(textData => {
                                  document.querySelector('textarea').value = textData.textContent;
                                  alert('File uploaded and text extracted successfully!');
                              })
                              .catch(error => console.error('Error getting text:', error));
                      } else {
                          alert('File uploaded but no text could be extracted.');
                      }
                  })
                  .catch(error => {
                      console.error('Error:', error);
                      alert('Failed to upload file. Please try again.');
                  });
              }
          }
      });
  }
});

// Prevent browser default behavior
function dragOverHandler(event) {
  event.preventDefault();
}