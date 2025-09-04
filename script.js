// --- Supabase Client Initialization ---
const SUPABASE_URL = 'https://mgghfytninchasgauqpa.supabase.co'; // PASTE YOUR SUPABASE URL HERE
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZ2hmeXRuaW5jaGFzZ2F1cXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzEyMzgsImV4cCI6MjA3MjMwNzIzOH0.Adst7AX3YROaxU8LY_MEoUy8ICYZYtj3ZD7V--k4SPA'; // PASTE YOUR SUPABASE ANON KEY HERE
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Global Variables (DOM Elements) ---
const promptsContainer = document.getElementById('prompts-container');
const trendingContainer = document.getElementById('trending-container');
const loginBtn = document.querySelector('.login-btn');
const authModal = document.getElementById('auth-modal');
const closeModalBtn = document.querySelector('.close-btn');
const authForm = document.getElementById('auth-form');
const toggleSignupLink = document.getElementById('toggle-signup');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authMessage = document.getElementById('auth-message');
const getInspiredBtn = document.getElementById('get-inspired-btn');
const userActions = document.querySelector('.user-actions');
const startStoryBtn = document.querySelector('.start-story-btn');
const logoutBtn = document.querySelector('.logout-btn');
const profileBtn = document.querySelector('.profile-btn');

let isSigningUp = false; // To toggle between login and signup

// --- Data (Fictional Prompts for now) ---
const prompts = [
    {
        title: "The Echo Fungus",
        description: "What if a newly discovered fungus could upload memories into human brains? Write a story about a historian using it to relive the past."
    },
    {
        title: "Roman Whispers",
        description: "In ancient Rome, the public sewer system was a marvel. What if someone found a way to use it as a communication network for a secret society?"
    },
    {
        title: "The 70,000 Thoughts",
        description: "The average person has 70,000 thoughts a day. Write a story about a character who can read a different person's thoughts every day for a week."
    }
];

// --- Core Functions: UI & Data Fetching ---

/**
 * Updates the visibility of the login, start story, and logout buttons.
 */
async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // User is logged in: show start story, profile, and logout buttons
        loginBtn.classList.add('hidden');
        startStoryBtn.classList.remove('hidden');
        profileBtn.classList.remove('hidden'); 
        logoutBtn.classList.remove('hidden');
    } else {
        // User is not logged in: show the login button
        loginBtn.classList.remove('hidden');
        startStoryBtn.classList.add('hidden');
        profileBtn.classList.add('hidden'); 
        logoutBtn.classList.add('hidden');
    }
}

/**
 * Fetches the most recent stories from Supabase.
 */
async function fetchTrendingStories() {
    const { data, error } = await supabase
        .from('stories')
        .select(`
            id,
            title,
            content,
            created_at,
            factual_hook,
            profiles (username)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error('Error fetching trending stories:', error);
        return [];
    }
    return data;
}

/**
 * Renders the stories on the homepage.
 */
async function populateTrending() {
    trendingContainer.innerHTML = '';
    const stories = await fetchTrendingStories();

    if (stories.length > 0) {
        stories.forEach(story => {
            const card = document.createElement('a');
            card.href = `/story.html?id=${story.id}`;
            card.className = 'trending-card';
            card.innerHTML = `
                <div>
                    <h4>${story.title}</h4>
                    <p>By ${story.profiles.username}</p>
                    <p>${story.factual_hook || 'No factual hook provided.'}</p>
                </div>
            `;
            trendingContainer.appendChild(card);
        });
    } else {
        trendingContainer.innerHTML = '<p>No trending stories yet. Be the first to write one!</p>';
    }
}

/**
 * Renders the static prompts on the homepage.
 */
function populatePrompts() {
    promptsContainer.innerHTML = '';
    prompts.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${prompt.title}</h3>
            <p>${prompt.description}</p>
        `;
        promptsContainer.appendChild(card);
    });
}

// --- Event Listeners and Modal Logic ---

// Open and close the auth modal
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Toggle between login and signup forms
toggleSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSigningUp = !isSigningUp;
    if (isSigningUp) {
        authSubmitBtn.textContent = 'Sign Up';
        toggleSignupLink.textContent = 'Login';
        authMessage.textContent = 'Signing up will create a new account.';
    } else {
        authSubmitBtn.textContent = 'Login';
        toggleSignupLink.textContent = 'Sign Up';
        authMessage.textContent = '';
    }
});

// Handle form submission with Supabase
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    authMessage.textContent = 'Processing...';

    const { data, error } = isSigningUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        authMessage.textContent = error.message;
        console.error(error);
    } else {
        authMessage.textContent = `Success! Check your email to confirm your account.`;
        authModal.style.display = 'none';
        updateUI(); // Update the UI after successful login
    }
});

// Handle logout
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (!error) {
        alert('You have been logged out.');
        updateUI(); // Update the UI after logging out
    } else {
        console.error('Logout error:', error);
    }
});

// "Get Inspired" button functionality
getInspiredBtn.addEventListener('click', () => {
    alert("This button would take you to a page with more prompts or a story creation tool!");
});

// --- Initial Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    populatePrompts();
    populateTrending();
});