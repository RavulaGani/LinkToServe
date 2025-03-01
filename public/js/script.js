const log = document.querySelector('#log')
const reg = document.querySelector('#reg')
const logBtn = document.querySelector('#logBtn')
const regBtn = document.querySelector('#regBtn')

regBtn.addEventListener('click', ()=>{
    reg.classList.remove('hidden')
    reg.classList.add('block')
    log.classList.add('hidden');
    log.classList.remove('block');
    
})

logBtn.addEventListener('click', ()=>{
    log.classList.remove('hidden')
    log.classList.add('block')
    reg.classList.remove('block');
    reg.classList.add('hidden');
})
