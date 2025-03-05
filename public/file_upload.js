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



*/


function dropHandler(event) {
    console.log("file or files dropped");
    event.preventDefault();

    if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {
            if (item.kind === "file") {
                const file = item.getAsFile();
                console.log(`… file[${i}].name = ${file.name}`);
            }
        });
    }


    else {
        [...event.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
        });
    }
}






function dragOverHandler(event) {
    event.preventDefault();
}