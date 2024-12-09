
  async function sendMessage() {
    try {
      // Get the full URL and extract the part after '#'
    const urlHash = window.location.hash.substring(1); // Removes the '#' symbol

    if (!urlHash || isNaN(urlHash)) {
      console.error('Invalid or missing ID in URL hash');
      alert('Invalid or missing ID in the URL. Please check the URL and try again.');
      return;
    }
    emailjs.init({
        publicKey: "J7PUkV7gPzR2ksuxC",
      }); // Replace YOUR_PUBLIC_KEY with your actual key


    const articleId = parseInt(urlHash, 10); // Convert hash part to an integer
    console.log('Extracted Article ID:', articleId);
      // Step 2: Fetch the article from the 'feed' table with the matching ID
      const { data: feedData, error: feedError } = await supabase
        .from('feed')
        .select('author, auth_email')
        .eq('id', articleId)
        .single();
      if (feedError || !feedData) {
        console.error('Error fetching feed data:', feedError.message);
        return;
      }
  
      const { author, auth_email } = feedData;
      console.log(auth_email);
  
      // Step 4: Get the message from the textarea with id 'msg'
      const messageContent = document.getElementById('msg').value;
  
      if (!messageContent) {
        console.error('Message content is empty');
        return;
      }
  
      // Step 5: Send an email using emailjs (replace with your emailjs user ID, service ID, and template ID)
      const emailjsResponse = await emailjs.send("service_obrhlbd","template_icmr6sp",{
        from_name: localStorage.getItem("name"),
        message: messageContent,
        reply_to: localStorage.getItem("email"),
        to_email: auth_email,
        });
  
      if (emailjsResponse.status === 200) {
        console.log('Email sent successfully');
        alert('Your message has been sent!');
      } else {
        console.error('Error sending email:', emailjsResponse);
        alert('There was an error sending your message.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  }
  
  // Call the function when the script is loaded
  
  