const startBtn = document.getElementById('start')
const cards = document.querySelectorAll('.card')
const timeController = document.getElementById('time-list')
const timeEl = document.getElementById('time')
const boardEl = document.getElementById('board')
const modalWindow = document.querySelector('.modal')
const finishButtons = document.querySelector('.modal__finish-buttons')
const modal = document.querySelector('.modal__score')

let time = 0
let score = 0
let idSetInterval
let timeValue

startBtn.addEventListener('click', handlerStartBtn)

function handlerStartBtn(e) {
    e.preventDefault()
    cards[0].classList.add('up')
}


timeController.addEventListener('click', handlerTimeController)

function handlerTimeController(e) {
    if (e.target.classList.contains('time-list__button')) {
        cards[1].classList.add('up')
        timeValue = parseInt(e.target.dataset.time)
        time = timeValue
        startGame()
    }
}

boardEl.addEventListener('click', handleCircleClick)

function handleCircleClick(e) {

    if (e.target.classList.contains('circle')) {
        score++
        e.target.remove()
        createRandomCircle()
    }
}

function createRandomCircle() {

    const circle = document.createElement('div')
    circle.classList.add('circle')
    const size = getRandomNum(5, 50)

    const {width, height} = boardEl.getBoundingClientRect()
    circle.style.width = circle.style.height = size + 'px'
    circle.style.background = randomColor()

    const x = getRandomNum(0, width - size)
    const y = getRandomNum(0, height - size)
    circle.style.left = x + 'px'
    circle.style.top = y + 'px'
    boardEl.append(circle)
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function setTime(timeGame) {
    timeEl.innerHTML = `00:${timeGame}`
}

function startGame() {
    idSetInterval = setInterval(decTime, 1000)
    createRandomCircle()
    setTime(time)
}

function decTime() {

    if (time == 0) {
        finishGame()
    } else {
        let current = --time
        if (current < 10) {
            current = `0${current}`
        }
        setTime(current)
    }
}

function finishGame() {
    timeEl.parentNode.style.display = 'none'
    clearInterval(idSetInterval)
    modal.innerHTML = `<p>Ваш счет: ${score} </p>`
    showModal()
    document.querySelector('.circle').remove()
}
function showModal(){
    modalWindow.classList.add('active')
    finishButtons.addEventListener('click',restart)

}
function restart(e){
    if(e.target.classList.contains('main-page')){
        location.reload()
    }else if(e.target.classList.contains('restart')){
        this.removeEventListener('click',restart)
        time = timeValue
        score = 0
        startGame()
        timeEl.parentNode.style.display='block'
    }
    modalWindow.classList.remove('active')
}
function randomColor(){
   return `rgb(${getRandomNum(0,255)},${getRandomNum(0,255)},${getRandomNum(0,255)}`
}