const startBtn = document.getElementById('start')
const cards = document.querySelectorAll('.card')
const timeController = document.getElementById('time-list')
const timeEl = document.getElementById('time')
const boardEl = document.getElementById('board')
const modalWindow = document.querySelector('.modal')
const finishButtons = document.querySelector('.modal__finish-buttons')
const modal = document.querySelector('.modal__score')
const getResults = document.querySelector('.btn-results')
let time = 0
let score = 0
let idSetInterval
let timeValue
let bestResults = []
let resultWindow

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
    let size
    const circle = document.createElement('div')
    circle.classList.add('circle')
    const mediaQuery = window.matchMedia('(max-width: 1000px)')
    if (mediaQuery.matches) {
        size = getRandomNum(50,100)
    }else{
        size= getRandomNum(5, 50)
    }
    console.log(size)

    const {width, height} = boardEl.getBoundingClientRect()
    circle.style.width = circle.style.height = size + 'px'
    circle.style.background = randomColor()

    const x = getRandomNum(0, width - size)
    const y = getRandomNum(0, height - size)
    circle.style.left = x + 'px'
    circle.style.top = y + 'px'
    boardEl.append(circle)
    let maxSize= getComputedStyle(circle)
    let a = maxSize.getPropertyValue('borderRadius')
    console.log(a)

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
    bestResults=[timeValue,score]
    if (localStorage.getItem('bestResults')) {
        const existScore = JSON.parse(localStorage.getItem('bestResults'))
        console.log(existScore)
        localStorage.setItem('bestResults', JSON.stringify([...existScore, bestResults]))
    } else {
        localStorage.setItem('bestResults', JSON.stringify([bestResults]))
    }
    let results = JSON.parse(localStorage.getItem('bestResults'))
    console.log(results)
    showModal()
    document.querySelector('.circle').remove()
}

function showModal() {
    modalWindow.classList.add('active')
    finishButtons.addEventListener('click', restart)

}

getResults.addEventListener('click', () => {
    console.log(1111)
     resultWindow = document.createElement('div')
    resultWindow.classList.add('modal')
    resultWindow.classList.add('result-list')
    boardEl.append(resultWindow)
    modalWindow.classList.remove('active')
    let resultList = JSON.parse(localStorage.getItem('bestResults'))
    console.log(resultList)
    let elements = resultList.map(e => {
        console.log(e)
        return `
        <li class="score-element">
        Время: ${e[0]} - Счет: ${e[1]}
</li>
        `
    }).slice(-8).join('')
    console.log(elements)
    resultWindow.innerHTML = `
<div class="result-buttons">
 <button  class=' modal__button btn-restart'>Играть снова</button>
 <button  class=' modal__button btn-delete-store'>Удалить результаты</button>
 <button  class=' modal__button btn-to-main-page'>На главную</button>
 </div>
    <ul>
    ${elements}
</ul>
    `

        resultWindow.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-restart')) {
                resultWindow.classList.remove('result-list')
                resetGame()
                startGame()
            } else if (e.target.classList.contains('btn-to-main-page')) {
                resultWindow.classList.remove('result-list')
                resetGame()
                timeEl.parentNode.style.display = 'block'
                cards.forEach((e) => e.classList.remove('up'))
            }else if (e.target.classList.contains('btn-delete-store')) {
                delete  localStorage.bestResults
                resultWindow.innerHTML = `
<div class="result-buttons">
 <button  class=' modal__button btn-restart'>Играть снова</button>
 <button  class=' modal__button btn-delete-store'>Удалить результаты</button>
 <button  class=' modal__button btn-to-main-page'>На главную</button>
 </div>
 `
            }
        })

})

function restart(e) {
    if (e.target.classList.contains('btn-to-main-page')) {
        resetGame()
        timeEl.parentNode.style.display = 'block'
        cards.forEach((e) => e.classList.remove('up'))
    } else if (e.target.classList.contains('btn-restart')) {
        this.removeEventListener('click', restart)
        resultWindow &&   resultWindow.classList.contains('result-list')&&resultWindow.classList.remove('result-list')
        resetGame()
        startGame()

    }
    modalWindow.classList.remove('active')
}

function resetGame() {
    time = timeValue
    score = 0
    timeEl.parentNode.style.display = 'block'
}

function randomColor() {
    return `rgb(${getRandomNum(0, 255)},${getRandomNum(0, 255)},${getRandomNum(0, 255)}`
}