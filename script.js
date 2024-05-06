// Client

// Get Stored data
let StoredToken = localStorage.getItem('jwtToken');
let username = localStorage.getItem('username');

// Set the username in the HTML
const usernameElement = document.getElementById('username');
usernameElement.textContent = storedUsername;

// Load page and event listeners
document.addEventListener('DOMContentLoaded', () => {
const baseUrl = window.Location.origin;
fetchPosts(baseUrl);

if (stordToken) {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole == 'admin') {
        showAdminFeatures();
    }
}

const from = document.getElementById('new-post-from');
if (from) {
    from.addEventListener('submit', (event) => createPost (event, baseUrl));
}

const loginForm = document.getElementById('login-from');
loginForm.addEventListener('submit', (event) => createPost (event, baseUrl));

const registerForm = document.getElementById('register-from');
registerForm.addEventListener('submit', (event) => createPost (event, baseUrl));
});

// Post details
const postDetailContainer = document.getElementById('post-detail-container');

// Add a listener for detail page
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postid = urlParams.get('post');
    if (postid) {
        showPostDetail(postid);
    }
});

// Fetch posts
async function fetchPosts(baseUrl) {
    const res = await fetch(`${baseUrl}/posts`);
    const data = await res.json();
    const postsList = document.getElementById('post-list');
    const isAdmin = localStorage.getItem('userRole') === 'admin';

    if (postsList) {
        postsList.innerHTML = data.map((post, index) => {
            const deleteButtonStyle = isAdmin ? '' : 'display: none';
            const updateButtonStyle = isAdmin ? '' : 'display: none';

            return `
            <div id="${post.id}" class="post">
            <img
             src="${post.imageUrl}" alt="image" />
            <div class="post-title">
            ${
                index ===0
                ? `<h1><a href="/post/${post._id}">${post.
                    title}</<a></h1>`
              : `<h3><a href="/post/${post._id}">${post.
                title}</<a></h3>`

            }
            </div>
            ${
                index ===0
                ? `<span><p>${post.Author}</p><p>${post.Timestamp}</p></span>`
                :`` 
            }
           
            <div id="admin-buttons">
                <button class="btn" style=${deleteButtonStyle}
                onClick=deletePost('${
                    post._id
                }','${baseUrl}')>Delete</button>
                <button class="btn" style=${deleteButtonStyle}
                onClick=showUpdateForm('${
                    post._id
                }','${post.title}','${post.content}')">Update</button>
            </div>
            ${index === 0 ?'<hr/>' : ''}
            ${index === 0 ?'<h2>All Articles</h2>': ''}

        </div>
            `;
        })
        .join('');
    }
}

async function createPost(event, baseUrl) {
    event.preventDefault();
    const titelInput = document.getElementById('titel');
    const contentInput = document.getElementById('content');
    const imageUrlInput = document.getElementById('image-url');

    // Get the values from the input fields
const title = titelInput.value;
const content = contentInput.value;
const imageUrl = imageUrlInput.value;

// Ensure that inputs are not empty
if (!title || !content || !imageUrl) {
    alert('please fill in all fields.');
    return;
}

const newPost = {
    title,
    content,
    imageUrl,
    author: strordUsername,
    Timestamp: new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }),
};

const headers =new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${stordToken}`,
});
const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(newPost),
};

try {
    const response = await fetch(`${baseUrl}/posts`, requestOptions);
    if (!response.ok) {
        const storedRole = localStorage.getItem('userRole');
        console.log(`Error creating the post: HTTP Status ${response.status}`);

    } else {
        // Clear the input data 
        titelInput.value = '';
        contentInput.value = '';
        imageUrlInput.value = '';
        alert('Create post successfull');
    }
} catch (error) {
    console.log('An error occurd during the fetch:', error);
    alert('Create post fields.');
}
fetchPosts(baseUrl);
}

// Delete post
async function deletePost(postId, baseUrl) {
    const deleteUrl = `${baseUrl}/posts/${postId}`;
    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers:{
                Authorization: `Bearer ${stordToken}`,
            },
        });

        if (response.ok) {
            alert('Delete post successful!');
            fetchPosts(baseUrl);
        } else {
            alert('Delete post fields.');
        }
    }catch (error) {
        console.error(`Error while deleting post: ${error}`);
        alert(`Delete post fields.`);
    } 
}

// Update from 
function showUpdateForm(postId, titel, content) {
    const updateForm = `
    <form id="update-form">
    <input type="text" id="update-title" value="${titel}"/>
    <textarea id="update-content">${content}</textarea>
    <button type="submit">Update post</button>
    </form>
    `;

    const postElement = document.getElementById(postId);
    postElement.innerHTML += updateForm;

    const form = document.getElementById('update-form');
    form.addEventListener('submit', (event) => updateForm(event, postId));
}

// Update post 
async function updatePost(event, postId)  {
    event.preventDefault();
    const titel = document.getElementById('update-title').value;
    const content = document.getElementById('update-content').value;
const baseUrl = window.location.origin;

// ensure that input are not empty
if (!titel || !content) {
    alert('Please fill in all fields.');
    return;
}
 const updatedPost = {
    titel,
    content,
 };

 try {
const response = await fetch(`${baseUrl}/posts/${postId}
`,{
    method: 'PUT',
    headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${stordToken}`,
    },
    body: JSON.stringify(updatePost),
});

if (response.ok) {
    alert('Update post successful!');
    fetchPosts(baseUrl);
} else {
    alert('Update post fields.');
}
}catch (error) {
console.error(` An error occured durind the fetch: ${error}`);
alert(`Delete post fields.`);
  }
}

// Register user
async function registerUser(event, baseUrl)  {
    event.preventDefault();
    const usernameInput = document.getElementById
    ('register-username').value;
    const passwordInput = document.getElementById
    ('register-password').value;
    const roleInput = document.getElementById
    ('register-role').value;

    const username = usernameInput.value;
    const passord = passwordInput.value;
    const role = roleInput.value;

// ensure that input are not empty
if (!username || !passord || !role) {
    alert('Please fill in all fields.');
    return;
}
 const newUser = {
    username,
    passord,
    role,
 };


const res = await fetch(`${baseUrl}/register`,{
    method: 'POST',
    headers:{
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
});

const data = await res.json();

if (response.ok) {
    alert('Registered post successful!');
    // Clear input fields
    usernameInput.value = '';
    passwordInput.value = '';
    roleInput.value = '';
} else {
    alert('Registration fields.');
}
}

// Loging user
async function registerUser(event, baseUrl)  {
    event.preventDefault();
    const usernameInput = document.getElementById
    ('login-username').value;
    const passwordInput = document.getElementById
    ('login-password').value;
    
    const username = usernameInput.value;
    const passord = passwordInput.value;

if (!username || !passord ) {
    alert('Please fill in all fields.');
    return;
}
 const User = {
    username,
    passord,
   
 };


const res = await fetch(`${baseUrl}/login`,{
    method: 'POST',
    headers:{
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(User),
});

const data = await res.json();

if (data.success) {
    localStorage.setItem('jwtToken', data.token);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('username', username);

    // Close the hamburge menu if open
    linksContainer.classList.toggle('active');
    hamburger.classList.toggle('active');

//    Clear input fields
    usernameInput.value = '';
    passwordInput.value = '';
    
    location.reload();

    if(data.role === 'admin') {
        showAdminFeatures();
    }
} else {
    alert('Login fields.');
}
}

// Admin features
function showAdminFeatures() {
    const newPostDiv = document.getElementById('new-post-div');
    if (newPostDiv) {
        newPostDiv.style.display = 'flex';
    }

    const allBtns = document.querySelectorAll('btn');
    allBtns.forEach((btn) => {
        if (btn) {
          btn.style.display = 'block';
        }
    });
}


// Logout
document.addEventListener('DOMContentLoaded', () =>{
    const baseUrl = window.location.origin;
    const registerDiv = document.getElementById('register-div');
    const loginDiv = document.getElementById('login-div');
    const logoutDiv = document.getElementById('logout-div');
    const logoutButton = document.getElementById('logout-button');

    if (stordToken) {
        registerDiv.style.display = 'none';
        loginDiv.style.display = 'none';
        logoutDiv.style.display = 'flex';
        logoutButton.addEventListener('click', () => {
         localStorage.removeItem('jwtToken');
         localStorage.removeItem('userRole');
         localStorage.removeItem('username');
         location.reload();

        });
    } else{
        registerDiv.style.display = 'flex';
        loginDiv.style.display = 'flex';
        logoutDiv.style.display = 'none';

    }
});