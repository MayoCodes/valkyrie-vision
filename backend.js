document.addEventListener('DOMContentLoaded', () => {
    // Check the user's role in localStorage
    const userRole = localStorage.getItem('role');
  
    // Redirect to the home page if the role is not 'gc'
    if (userRole !== 'gc') {
      console.warn('Access denied. Redirecting to home page...');
      window.location.href = 'index.html'; // Replace 'index.html' with your home page URL
    }
  });

let currentRowId = null; // To store the ID of the current row

// Function to fetch the first row where approved is false
async function checkForUnapproved() {
    try {
        const { data, error } = await supabase
            .from('feed')
            .select('*')
            .eq('approved', false)
            .order('id', { ascending: true }) // Get the first row by ID
            .limit(1);

        if (error) {
            console.error('Error fetching data:', error.message);
            alert('Failed to fetch unapproved rows.');
            return;
        }

        if (data.length === 0) {
            alert('No unapproved rows found.');
            return;
        }

        const row = data[0];
        currentRowId = row.id; // Store the ID of the current row

        // Display row details (modify as needed for your UI)
        const titlea = document.getElementById("dtitle"); 
        const desca = document.getElementById("ddesc"); 

        titlea.textContent = row.name;
        desca.textContent = row.desc;

    } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred while checking for unapproved rows.');
    }
}

// Function to approve the current row
async function approveRow() {
    if (!currentRowId) {
        alert('No row selected to approve.');
        return;
    }

    try {
        const { error } = await supabase
            .from('feed')
            .update({ approved: true })
            .eq('id', currentRowId);

        if (error) {
            console.error('Error approving row:', error.message);
            alert('Failed to approve the row.');
            return;
        }

        alert('Row approved successfully!');
        currentRowId = null; // Clear the current row ID
    } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred while approving the row.');
    }
}

// Function to deny (delete) the current row
async function denyRow() {
    if (!currentRowId) {
        alert('No row selected to deny.');
        return;
    }

    try {
        const { error } = await supabase
            .from('feed')
            .delete()
            .eq('id', currentRowId);

        if (error) {
            console.error('Error deleting row:', error.message);
            alert('Failed to delete the row.');
            return;
        }

        alert('Row deleted successfully!');
        currentRowId = null; // Clear the current row ID
    } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred while denying the row.');
    }
}

// Event listeners for buttons

document.getElementById('approve').addEventListener('click', approveRow);
document.getElementById('deny').addEventListener('click', denyRow);
