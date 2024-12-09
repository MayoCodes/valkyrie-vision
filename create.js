document.addEventListener('DOMContentLoaded', () => {
    // Check the user's role in localStorage
    const userRole = localStorage.getItem('role');
  
    // Redirect to the home page if the role is not 'gc'
    if (userRole === 'student') {
      console.warn('Access denied. Redirecting to home page...');
      window.location.href = 'index.html'; // Replace 'index.html' with your home page URL
    }
  });

// File input and drop area interactivity
var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');

// Highlight drag area
$fileInput.on('dragenter focus click', function () {
    $droparea.addClass('is-active');
});

// Back to normal state
$fileInput.on('dragleave blur drop', function () {
    $droparea.removeClass('is-active');
});

// Change inner text
$fileInput.on('change', function () {
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();

    if (filesCount === 1) {
        // Show file name if a single file is selected
        var fileName = $(this).val().split('\\').pop();
        $textContainer.text(fileName);
    } else {
        // Show number of files if multiple files are selected
        $textContainer.text(filesCount + ' files selected');
    }
});

const BUCKET_NAME = 'feed'; // Your Supabase bucket name

// Function to handle button click
async function handleButtonClick3() {
    try {
        // Get values from input fields
        const name = document.getElementById('lt').value;
        const desc = document.getElementById('shortdesc').value;
        const fileInput = document.getElementById('atharva');
        const file = fileInput.files[0]; // File selected by the user

        // Ensure a file is selected
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        // Generate a unique file path
        const filePath = `${Date.now()}-${file.name}`;

        // Upload the file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading file:', uploadError.message);
            alert('File upload failed.');
            return;
        }

        // Fetch the public URL of the uploaded file
        const { data: publicURLData, error: publicURLError } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        if (publicURLError) {
            console.error('Error fetching public URL:', publicURLError.message);
            alert('Failed to fetch file URL.');
            return;
        }

        const publicURL = publicURLData.publicUrl;

        // Insert data into the 'feed' table
        const { error: insertError } = await supabase
            .from('feed') // Replace with your table name
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
