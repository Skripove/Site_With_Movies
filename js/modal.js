const myModal = document.querySelector("#myModal");
const modalContent = document.querySelector(".modal-content");

const closeBtn = document.querySelector(".modal-close");

let modalPosterImg = document.querySelector(".modal-info__poster");
let modalEtc = document.querySelector(".modal-info__etc");
let modalH1 = document.querySelector(".modal-info__text h1");
let modalP = document.querySelector(".modal-info__text p");
//let modalTrailer = document.querySelector(".modal-trailer");

closeBtn.addEventListener("click", () => {
    myModal.style.display = "none";
    let removeArr = document.querySelectorAll(".modal-trailer");
    removeArr.forEach(v => {
        v.remove();
    });

    let removeText = document.querySelectorAll(".modal-trailer-text");
    removeText.forEach(v => {
        v.remove();
    });
});

window.addEventListener("click", (evt) => {
    if (evt.target == myModal) {
        myModal.style.display = "none";
        let removeArr = document.querySelectorAll(".modal-trailer");
        removeArr.forEach(v => {
            v.remove();
        });

        let removeText = document.querySelectorAll(".modal-trailer-text");
        removeText.forEach(v => {
            v.remove();
        });
    }
});