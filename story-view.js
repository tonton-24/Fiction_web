// story-view.js

// --- Supabase Client Initialization ---
const SUPABASE_URL = 'https://mgghfytninchasgauqpa.supabase.co'; // PASTE YOUR SUPABASE URL HERE
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZ2hmeXRuaW5jaGFzZ2F1cXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzEyMzgsImV4cCI6MjA3MjMwNzIzOH0.Adst7AX3YROaxU8LY_MEoUy8ICYZYtj3ZD7V--k4SPA'; // PASTE YOUR SUPABASE ANON KEY HERE
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const storyHeading = document.getElementById('story-heading');
const authorName = document.getElementById('author-name');
const publishedDate = document.getElementById('published-date');
const storyText = document.getElementById('story-text');
const errorMessage = document.getElementById('error-message');
const pageTitle = document.getElementById('story-title');

async function fetchStory() {
    // Get the story ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');

    if (!storyId) {
        storyHeading.textContent = 'Error';
        storyText.innerHTML = '<p>No story ID provided in the URL.</p>';
        errorMessage.classList.remove('hidden');
        return;
    }

    const { data: story, error } = await supabase
        .from('stories')
        .select(`
            id,
            title,
            content,
            created_at,
            profiles (username)
        `)
        .eq('id', storyId)
        .single();

    if (error || !story) {
        console.error('Error fetching story:', error);
        errorMessage.classList.remove('hidden');
        return;
    }

    // Format the date
    const date = new Date(story.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Populate the HTML with the story data
    pageTitle.textContent = story.title;
    storyHeading.textContent = story.title;
    authorName.textContent = story.profiles.username;
    publishedDate.textContent = formattedDate;
    storyText.innerHTML = story.content.replace(/\n/g, '<br>'); // Preserve paragraphs
}

document.addEventListener('DOMContentLoaded', fetchStory);