// story-script.js

// --- Supabase Client Initialization ---
const SUPABASE_URL = 'https://mgghfytninchasgauqpa.supabase.co'; // PASTE YOUR SUPABASE URL HERE
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZ2hmeXRuaW5jaGFzZ2F1cXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzEyMzgsImV4cCI6MjA3MjMwNzIzOH0.Adst7AX3YROaxU8LY_MEoUy8ICYZYtj3ZD7V--k4SPA'; // PASTE YOUR SUPABASE ANON KEY HERE
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const storyForm = document.getElementById('story-form');
const messageDisplay = document.getElementById('message-display');

// Handle form submission
storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    messageDisplay.textContent = 'Publishing story...';
    messageDisplay.classList.remove('hidden', 'success', 'error');

    const title = document.getElementById('story-title').value;
    const content = document.getElementById('story-content').value;
    const factualHook = document.getElementById('factual-hook').value;
    const genreSelect = document.getElementById('genre');
    const selectedGenres = Array.from(genreSelect.selectedOptions).map(option => option.value);
    
    // Get the current logged-in user's ID
    const { data: { user } } = await supabase.auth.getUser();
    const author_id = user ? user.id : null;

    if (!author_id) {
        messageDisplay.textContent = 'You must be logged in to publish a story.';
        messageDisplay.classList.add('error');
        return;
    }

    // Insert the data into the 'stories' table
    const { error } = await supabase
        .from('stories')
        .insert([
            {
                title,
                content,
                factual_hook: factualHook,
                genre: selectedGenres,
                author_id
            }
        ]);

    if (error) {
        console.error(error);
        messageDisplay.textContent = 'Error publishing story. Please try again.';
        messageDisplay.classList.add('error');
    } else {
        messageDisplay.textContent = 'Story published successfully!';
        messageDisplay.classList.add('success');
        // Clear the form
        storyForm.reset();
    }
});