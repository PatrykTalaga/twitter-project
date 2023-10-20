const loadPostURL = `http://localhost:3000/API/loadPosts/3/1/{}`


const loadPostsBtn = document.querySelector('#loadPostsBtn')
loadPostsBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    console.log('click loadPostsBtn')

    try{
        let  posts = await fetch(loadPostURL)
        posts = await posts.json()
        /* console.log('posts: ' + posts[1].user +' : '+ typeof(posts)) */
        posts.forEach(post => {
            /* console.log('post: ' + post.user +' : '+ typeof(post)) */
            let newPost = document.querySelector('.new-post')

            let postDiv = document.createElement('div')
            postDiv.classList.add('post')
            
            let headerP = document.createElement('p')
            headerP.classList.add('post-header')
            headerP.innerText = post.user

            let postText = document.createElement('p')
            postText.innerText = post.postText

            postDiv.append(headerP, postText)
            newPost.append(postDiv)

            });

    }catch(err){
        console.error(err)
    }
    

    
    
    /* posts.forEach(post => {
        let newPost = document.querySelector('.new-post')

        let postDiv = document.createElement('div')
        postDiv.classList.add('post')

        let headerP = document.createElement('p')
        headerP.classList.add('post-header')

        let postText = document.createElement('p')
    }); */

})





/* <% posts.forEach( post => { %>
    <div class="post">
        <p class="post-header"><%= post.user %><span class="grey-text"><%= " @" + post.userId %></span></p>
        <p><%= post.postText %></p>
        <div class="date-text"><%= "Edited: " + post.editedAt %></div>

        <% if(post.postImagePath != null){ %>
            <img src="<%= post.postImagePath %>" width="500" height="600">
        <% } %>

        <% if(post.userId == userId){ %>
            <form action="/home/editPost/<%= post._id %>" method="GET">
                <button type="submit">Edit</button>
            </form>
            <form method="POST" action="/home/deletePost/<%= post._id %>?_method=DELETE" >
                <button type="submit">Delete</button>
            </form>
        <% } %>
    </div>
<% }) %> */




const img = document.querySelector('.img')

img.addEventListener('click', (e) => { //append textarea
    e.preventDefault()
    const textArea = document.querySelector('.text')
    console.log('click')
    let text = textArea.value
    console.log(text)
    textArea.value = `${text} Wololo!`
})
