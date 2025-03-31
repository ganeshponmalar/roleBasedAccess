const routes = {
    home: "<h1>Home Page</h1><p>Welcome to our single page application!</p>",
    about: "<h1>About Us</h1><p>This is a simple SPA using JavaScript.</p>",
    contact: "<h1>Contact</h1><p>Email: contact@example.com</p>"
};

function navigateTo(page) {
    document.getElementById("content").innerHTML = routes[page];
}

// Load default page
navigateTo('home');
