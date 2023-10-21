/* const loadPostURL = `http://localhost:3000/API/loadPosts/3/1/{}` */
const loadPostURL = `http://localhost:3000/API/loadPosts`
/* const limit = 5
const skip = 0
const filter = ""
const loadPostURLParams = loadPostURL + `/${limit}/${skip}/{}${filter}}`
console.log(loadPostURLParams)
console.log('wololo') */
loadPosts(2, 1)
   
const loadPostsBtn = document.querySelector('#loadPostsBtn')
loadPostsBtn.addEventListener('click', async (e) => {
    e.preventDefault()

    loadPosts()
})

/////////////////WOLOLO BTN
const img = document.querySelector('.img')

img.addEventListener('click', (e) => { //append textarea
    e.preventDefault()
    const textArea = document.querySelector('.text')
    console.log('click')
    let text = textArea.value
    console.log(text)
    textArea.value = `${text} Wololo!`
})
/////////////////WOLOLO BTN


//functions
function getCookieValue(name){
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
      return match[2]
    }
}

async function loadPosts(limit=5, skip=0, filter=""){

    const loadPostURLParams = loadPostURL + `/${limit}/${skip}/{${filter}}`
    console.log(loadPostURLParams)
    try{
        let  posts = await fetch(loadPostURLParams)
        posts = await posts.json()
        /* console.log('posts: ' + posts[1].user +' : '+ typeof(posts)) */
        posts.forEach(post => {
            /* console.log('post: ' + post.user +' : '+ typeof(post)) */
            let postBox = document.querySelector('#post-box')

            let postDiv = document.createElement('div')
            postDiv.classList.add('post')

            let headerP = document.createElement('p')
            headerP.classList.add('post-header')
            headerP.innerText = post.user

            let postText = document.createElement('p')
            postText.innerText = post.postText

            postDiv.append(headerP, postText)

            /* console.log('post.postImagePath:  ' + post.postImagePath +' : '+ typeof(post.postImagePath)) */
            if(post.postImagePath != null){
                let postImg = document.createElement('img')
                postImg.setAttribute('src', post.postImagePath)
                postDiv.append(postImg)
            }

            const userId = getCookieValue('userId')
            if(userId == post.userId){
                let ctrlDiv = document.createElement('div')

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