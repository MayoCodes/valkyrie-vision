async function fetchApprovedArticles() {
    try {
      // Fetch rows from the 'feed' table where 'approved' is true
      const { data, error } = await supabase
        .from('feed')
        .select('*')
        .eq('approved', true); // Only select rows where approved is true
        console.log(data);
  
      if (error) {
        console.error('Error fetching data:', error.message);
        return;
      }
  
      // Loop through each article and create HTML content
      const container = document.getElementById('articles-container'); // ID of the element where articles will be displayed
  
      data.forEach((article) => {
        const articleHTML = `
        <article>
          <div class="article-wrapper">
            <figure>
              <img src="${article.img_url}" alt="${article.name}" />
            </figure>
            <div class="article-body">
              <h2>${article.name}</h2>
              <p>${article.desc || 'Curabitur convallis ac quam vitae laoreet. Nulla mauris ante, euismod sed lacus sit amet, congue bibendum eros. Etiam mattis lobortis porta. Vestibulum ultrices iaculis enim imperdiet egestas.'}</p>
              <a href="apply.html#${article.id}" class="read-more">
                Apply <span class="sr-only">about ${article.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        `;
  
        // Append the generated HTML to the container
        container.innerHTML += articleHTML;
      });
  
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }
  
  // Call the function to fetch and display the articles
  fetchApprovedArticles();
  