const img = document.querySelector('.img')


img.addEventListener('click', (e) => { //append textarea
    e.preventDefault()
    const textArea = document.querySelector('.text')
    console.log('click')
    let text = textArea.value
    console.log(text)
    textArea.value = `${text} Wololo!`
})
