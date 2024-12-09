document.addEventListener('DOMContentLoaded', () => {
    // Check the user's role in localStorage
    const userRole = localStorage.getItem('role');
  

    if (userRole === 'student' || userRole === null) {
      console.warn('Access denied. Redirecting to home page...');
      window.location.href = 'index.html';
    }
  });


var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');


$fileInput.on('dragenter focus click', function () {
    $droparea.addClass('is-active');
});


$fileInput.on('dragleave blur drop', function () {
    $droparea.removeClass('is-active');
});

$fileInput.on('change', function () {
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();

    if (filesCount === 1) {

        var fileName = $(this).val().split('\\').pop();
        $textContainer.text(fileName);
    } else {

        $textContainer.text(filesCount + ' files selected');
    }
});

const BUCKET_NAME = 'feed'; 

async function handleButtonClick3() {
    try {

        const name = document.getElementById('lt').value;
        const desc = document.getElementById('shortdesc').value;
        const fileInput = document.getElementById('atharva');
        const file = fileInput.files[0]; // File selected by the user


        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const filePath = `${Date.now()}-${file.name}`;


        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading file:', uploadError.message);
            alert('File upload failed.');
            return;
        }


        const { data: publicURLData, error: publicURLError } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        if (publicURLError) {
            console.error('Error fetching public URL:', publicURLError.message);
            alert('Failed to fetch file URL.');
            return;
        }

        const publicURL = publicURLData.publicUrl;


        const { error: insertError } = await supabase
            .from('feed') 
            .insert({
                author: localStorage.getItem('name'),
                name: name,
                desc: desc,
                img_url: publicURL,
                auth_email: localStorage.getItem("email"),
                approved: false,
            });

        if (insertError) {
            console.error('Error inserting data:', insertError.message);
            alert('Failed to insert data into the database.');
            return;
        }

        alert('File uploaded and data inserted successfully.');
    } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred.');
    }
}
