// profile-script.js

// --- Supabase Client Initialization ---
const SUPABASE_URL = 'https://mgghfytninchasgauqpa.supabase.co'; // PASTE YOUR SUPABASE URL HERE
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZ2hmeXRuaW5jaGFzZ2F1cXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzEyMzgsImV4cCI6MjA3MjMwNzIzOH0.Adst7AX3YROaxU8LY_MEoUy8ICYZYtj3ZD7V--k4SPA'; // PASTE YOUR SUPABASE ANON KEY HERE
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const myStoriesContainer = document.getElementById('my-stories-container');
const profileHeader = document.getElementById('profile-header');
const logoutBtn = document.querySelector('.logout-btn');

async function fetchMyStories() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        profileHeader.textContent = 'You must be logged in to view your profile.';
        myStoriesContainer.innerHTML = '';
        return;
    }

    const { data, error } = await supabase
        .from('stories')
        .select(`
            id,
            title,
            factual_hook,
            created_at,
            profiles (username)
        `)
        .eq('author_id', user.id) // Filter by the logged-in user's ID
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching my stories:', error);
        myStoriesContainer.innerHTML = '<p>There was an error loading your stories.</p>';
        return;
    }
    
    if (data.length === 0) {
        myStoriesContainer.innerHTML = '<p>You have not published any stories yet. Start a story!</p>';
    } else {
        data.forEach(story => {
            const card = document.createElement('a');
            card.href = `/story.html?id=${story.id}`;
            card.className = 'trending-card';
            card.innerHTML = `
                <div>
                    <h4>${story.title}</h4>
                    <p>${story.factual_hook || 'No factual hook provided.'}</p>
                </div>
            `;
            myStoriesContainer.appendChild(card);
        });
    }
}

// Handle logout
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = '/'; // Redirect to homepage after logout
    } else {
        console.error('Logout error:', error);
    }
});

document.addEventListener('DOMContentLoaded', fetchMyStories);