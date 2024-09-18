document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const showSigninLink = document.getElementById('show-signin');
    const showSignupLink = document.getElementById('show-signup');

    // Toggle between Sign Up and Sign In forms
    showSigninLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.style.display = 'none';
        signinForm.style.display = 'block';
    });

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        signinForm.style.display = 'none';
        signupForm.style.display = 'block';
    });

    // Handle Sign Up form submission
    document.getElementById('signup').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        // Replace with your signup logic
        console.log(`Sign Up with Email: ${email}, Password: ${password}`);
        alert('Sign Up Successful!');
    });

    // Handle Sign In form submission
    document.getElementById('signin').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        // Replace with your signin logic
        console.log(`Sign In with Email: ${email}, Password: ${password}`);
        alert('Sign In Successful!');
    });
});
