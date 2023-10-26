const loadPostURLSidebar = `http://localhost:3000/API/loadPosts`

//variables//
const postsNumberSidebar = 10


//script//
loadPostsSidebar(postsNumberSidebar)

//functions//
//send API request for posts and render them as HTML elements
async function loadPostsSidebar(limit=5, skip=0, filter=""){
    const loadPostURLParams = loadPostURLSidebar + `/${limit}/${skip}/{${filter}}`
    try{
        let  posts = await fetch(loadPostURLParams)
        posts = await posts.json()
        posts.forEach(post => {
            let sidebarPosts = document.querySelector('.sidebarPosts')

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

            sidebarPosts.append(postDiv)
        });
    }catch(err){
        console.error(err)
    }
}