//variables//
let background
let postBackground
let fontColor
let fontSize
let color
let colorBtn
const userId = getCookieValue('userId')
const settingsURL = `/settings/getSettings/${userId}`

//script//
applySettings()


//functions//
//access data from cookie
function getCookieValue(name){
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
      return match[2]
    }
}

//apply settings
async function applySettings(){
    try{
        let  user = await fetch(settingsURL)
        user = await user.json()

        switch(user[0].settings[0]){
            case 'default':
                background = 'white'
                postBackground = 'rgba(168, 168, 168, 0.137)'
                fontColor = 'black'
                break
            case 'dim':
                background = 'rgba(0, 0, 0, 0.74)'
                postBackground = 'rgb(88, 88, 88)'
                fontColor = 'white'
                break
            case 'lightsOut':
                background = 'black'
                postBackground = 'rgb(32, 32, 32)'
                fontColor = 'white'
                break
        }
        fontSize = user[0].settings[1]
        color = user[0].settings[2]
        colorBtn = user[0].settings[2]


        document.documentElement.style.setProperty('--background-color', background)
        document.documentElement.style.setProperty('--post-background-color', postBackground)
        document.documentElement.style.setProperty('--font-color', fontColor)
        document.documentElement.style.setProperty('--font-size', fontSize)
        document.documentElement.style.setProperty('--color', color)
        document.documentElement.style.setProperty('--color-btn', colorBtn)
    }catch(err){console.error(err)}
    
}