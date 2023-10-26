const loadPostURL = `http://localhost:3000/API/loadPosts`

//variables//
const initialPostsNumber = 5
let postsCounter = initialPostsNumber

//script//
loadPosts(initialPostsNumber)
const loadPostsBtn = document.querySelector('#loadPostsBtn')
loadPostsBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    loadPosts(2, postsCounter)
    postsCounter = postsCounter + 2
})



//functions//
//access data from cookie
function getCookieValue(name){
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
      return match[2]
    }
}

//Send API request for posts and render them as HTML elements
async function loadPosts(limit=5, skip=0, filter=""){
    const loadPostURLParams = loadPostURL + `/${limit}/${skip}/{${filter}}`
    try{
        let  posts = await fetch(loadPostURLParams)
        posts = await posts.json()
        posts.forEach(post => {
            let postBox = document.querySelector('#post-box')

            let postDiv = document.createElement('div')
            postDiv.classList.add('post')

            let headerP = document.createElement('p')
            //<span class="grey-text"><%= " @" + post.userId %>

            headerP.classList.add('post-header')
            headerP.innerText = post.user
            let headerSpan = document.createElement('span')
            headerSpan.classList.add("grey-text")
            headerSpan.innerText = '@' + post.userId
            headerP.append(headerSpan)

            let postText = document.createElement('p')
            postText.innerText = post.postText

            postDiv.append(headerP, postText)

            //if there is image path in database render the image
            if(post.postImagePath != null){
                let postImg = document.createElement('img')
                postImg.setAttribute('src', post.postImagePath)
                postDiv.append(postImg)
            }

            //if post belongs to the current user create edit and delete buttons
            const userId = getCookieValue('userId')
            if(userId == post.userId){
                let ctrlDiv = document.createElement('div')
                ctrlDiv.classList.add('ctrlDiv')

                let editForm = document.createElement('form')
                editForm.setAttribute('action', `/home/editPost/${post._id}`)
                editForm.setAttribute('method', 'GET')
                let editBtn = document.createElement('button')
                editBtn.innerText = "Edit"
                editBtn.setAttribute('type', 'submit')
                editForm.append(editBtn)
                ctrlDiv.append(editForm)
            
                let deleteForm = document.createElement('form')
                deleteForm.setAttribute('action', `/home/deletePost/${post._id}?_method=DELETE`)
                deleteForm.setAttribute('method', 'POST')
                let deleteBtn = document.createElement('button')
                deleteBtn.innerText = "Delete"
                deleteBtn.setAttribute('type', 'submit')
                deleteForm.append(deleteBtn)
                ctrlDiv.append(deleteForm)

                postDiv.append(ctrlDiv)
            }
            postBox.append(postDiv)

            });

    }catch(err){
        console.error(err)
    }
}