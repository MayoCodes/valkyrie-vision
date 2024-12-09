function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
    const headerElement = document.getElementById("yourHeaderId"); 
}

const login = document.getElementById("login__");
const pfp = document.querySelector(".action");

      if (localStorage.getItem("name") === null) {
        // Show button if "name" is null
        login.style.display = "block";
        pfp.style.display = "none";
      } else {
        // Show image if "name" has a value
        pfp.style.display = "block";
        login.style.display = "none";
        const name = document.getElementById("publicName"); // Get the element by its ID
        name.textContent = localStorage.getItem("name");
        const role = document.getElementById("publicRole");
        role.textContent = localStorage.getItem("role");
        $("#email_").attr("href", "mailto:" + localStorage.getItem("email")); 
                            

      }

const supabase = window.supabase.createClient(
    'https://bwvyahntnavakwtnyivm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dnlhaG50bmF2YWt3dG55aXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyODYxMDQsImV4cCI6MjA0ODg2MjEwNH0.CeDo8wpoeLbvHYBva7BfFPXY153VG1Sdm9btQmsGK38'
);

// Function to handle the Supabase operation
async function handleButtonClick() {
    // Get values from input and select
    const name = document.getElementById("name-entr").value;
    const pswrd = document.getElementById("password-entr").value;
    const email = document.getElementById("email-entr").value;
    const role = document.getElementById("role").value;
    const randomInt = Math.floor(Math.random() * 7)+1;
    const pfpId = "0" + randomInt.toString();

    // Validate inputs
   // if (!role || !name || !email || !pswrd) {
       //alert('Please provide all information before submiting!');
        //return;
    //}
    try {
        // Insert data into the 'abc' table
        const { error: insertError } = await supabase
            .from('profile')
            .insert({ name: name, password: pswrd, email: email,  pfpID: parseInt(pfpId, 10), role: role});

        if (insertError) {
            console.error('Error inserting data:', insertError);
            return;
        }

        // Fetch data from the 'abc' table
        const { data, error: fetchError } = await supabase.from('profile').select();

        if (fetchError) {
            console.error('Error fetching data:', fetchError);
        } else {
            console.log('Fetched data:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

async function handleButtonClick1() {
    // Get values from input and select
    const pswrdLog = document.getElementById("password1-entr").value;
    const emailLog = document.getElementById("email1-entr").value;

    // Validate inputs
    if (!emailLog || !pswrdLog) {
        alert('Please provide all information before submitting!');

    }

    try {

        const { data: profileEntries, error: fetchError } = await supabase.from('profile').select();

        if (fetchError) {
            location.reload();
            return;
        }


        const user = profileEntries.find(
            (entry) => entry.email === emailLog && entry.password === pswrdLog
        );

        if (user) {
            localStorage.setItem("name", user.name);
            localStorage.setItem("pfpid", user.pfpID); 
            localStorage.setItem("email", user.email);
            localStorage.setItem("role", user.role);
            location.reload();
        } else {
            alert('Incorrect email or password. Please try again.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred. Please try again.');
    }
}

async function signOut() {
    

    try {
        
        localStorage.clear();
        location.reload();

    } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred. Please try again.');
    }
}



document.getElementById('fetch-button').addEventListener('click', handleButtonClick);
document.getElementById('login').addEventListener('click', handleButtonClick1);