
// Global scope 
const form = document.getElementById('github-form');
const userUl = document.getElementById('user-list');
const repoUl = document.getElementById('respos-list');
const resultHeader = document.createElement('p');
document.getElementById('github-form').appendChild(resultHeader);

// Event listener for form submit
form.addEventListener('submit', function(e) {
    e.preventDefault();
    resultHeader.innerHTML = ''; // clears the previous search's header
    userUl.innerHTML = ''; // clears the previous search's results

    searchTerm = e.target.search.value;
    
    resultHeader.innerHTML = `Showing results for <b>${searchTerm}</b>:`; // sets header for new search

    getUserResults(searchTerm);
    form.reset(); 
})

// GET request to the Search Users API
function getUserResults(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json'
        }
    })
    .then(res => res.json())
    .then(fullResults => fullResults.items.forEach(result => renderUserResults(result)))
}

// Function to display GET results in the DOM, AND to call the Repos API when the "view user's repositories" element is clicked
function renderUserResults(data) {
    console.log(data);

    let userName = document.createElement('h3');
    userName.textContent = data.login;

    let userAvatar = document.createElement('img');
    userAvatar.src = data.avatar_url;
    userAvatar.className = 'avatar';

    let userProfile = document.createElement('a');
    userProfile.href = data.html_url;
    userProfile.textContent = data.html_url;

    let repoToggle = document.createElement('p');
    repoToggle.innerHTML = '<u>>>View user\'s repositories<<</u>';
    repoToggle.className = 'repo-toggle';

    let repoList = document.createElement('ol');
    repoList.hidden = true;

    let resultItem = document.createElement('li');
    userUl.appendChild(resultItem);

    resultItem.className = 'result-card'; 
    resultItem.appendChild(userAvatar);
    resultItem.appendChild(userName);
    resultItem.appendChild(userProfile);
    resultItem.appendChild(repoToggle);
    resultItem.appendChild(repoList);

    repoToggle.addEventListener('click', function() { 
        repoList.innerText = '';
        if (repoList.hidden === true) {
            repoList.hidden = false;
            fetch(`https://api.github.com/users/${data.login}/repos`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/ajson',
                    'Accept': 'application/vnd.github+json'
                }
            })
            .then(res => res.json())
            .then(fullResults => fullResults.map(result => {
                let repoName = result.name;
                let repoItem = document.createElement('li');
                repoItem.className = 'repo-item';
                repoItem.innerText = repoName;
                repoList.appendChild(repoItem);
            }))
        }
        else repoList.hidden = true;
    })
}