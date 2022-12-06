const inputAnimate = (inputId) =>{
    document.getElementById(inputId).addEventListener('change', () => {
        if (document.getElementById(inputId).value != "") {
            document.querySelector(`.${inputId}__i`).style.height = "44px"
            document.querySelector(`.${inputId}__i`).style.padding = "20px 10px 10px"
            document.querySelector(`.${inputId}__title`).style.transform = "translateX(-10px) translateY(-34px)"
            document.querySelector(`.${inputId}__title`).style.color = "#45f3ff"
            document.querySelector(`.${inputId}__title`).style.fontSize = "12px"
        }
    })
}

let inputs = []
document.querySelectorAll('input').forEach(el=>inputs.push(el.id))

inputs.forEach(el=>inputAnimate(el))