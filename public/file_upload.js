/*
p 
 -handle the drag and drop from the html
i
    -event
o
    -process file
proces
create function
pass in event


-drop file & send to the server


*/


function fileValidation() {

    const fileToValidate = document.querySelector('#fileInput');
    console.log(fileToValidate, "file-val-check");
    const filePath = fileToValidate.value;

    let allowedExtensions = /(\.txt|\.doc|\.docx|\.pdf)$/i;;

    if (!allowedExtensions.exec(allowedExtensions)) {
        alert('Invalid File Type: Please upload a .txt, .doc. docx, or .pdf file type');
        fileInput.value = '';
        return false;
    }
}


function dropHandler(event) {

    event.preventDefault();

    //Validates file on drop
    fileValidation();

    let file;

    if (event.dataTransfer.items.length === 1 ) {

        const uploadedFile = event.dataTransfer.items[0]
        let file = item.getAsFile();
            
        



    }


    else {
        [...event.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
        });
    }



    //file name
    const fileName = file.name;

	const formData = new FormData();


    formData.append('Name', fileName.value);
	

    


    /*
	fetch(http://127.0.0.1:5000/ap, 
		method: 'POST',
		body: formData

    */


    return file;

}


/*
  <!-- File Upload -->
      <form id="uploadForm" enctype="multipart/form-data">
        <div id="dropZone" ondrop="dropHandler(event)" ondragover="dragOverHandler(event);" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
          <input type="file" id="fileInput" name="file" class="hidden" accept=".txt,.doc,.docx,.pdf">
          <div class="space-y-2">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="text-gray-600">
              <span class="font-medium">Click to upload</span> or drag and drop
            </div>
            <p class="text-xs text-gray-500">TXT, DOC, DOCX, PDF</p>
          </div>
        </div>
      </form>



*/



//prevent broswer default behavior
function dragOverHandler(event) {
    event.preventDefault();
}





