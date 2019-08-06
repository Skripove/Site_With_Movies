let genreId; //выбранный жанр
let page; //страница
let ajaxInProgress = false; //ajax выполняется?

const genresList = document.querySelector(".genres");
const movieBox = document.querySelector(".movie-box");

let xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function() {
    ajaxInProgress = true;
    if (this.readyState === this.DONE) {
        let genresArr = JSON.parse(this.responseText).genres;
        ajaxInProgress = false;
        genresArr.forEach((v) => {
            addNewGenre.call(v);
        });
    }
});
xhr.open("GET", "https://api.themoviedb.org/3/genre/movie/list?language=ru-RU&api_key=87fbe9b6f9a82c88238c98fe85935d88");
xhr.send();


//добавление нового жанра
function addNewGenre() {
    let li = document.createElement('li');
    li.setAttribute('class', `genres__item`);
    li.innerHTML = `${this.name}`;
    li.idGenre = `${this.id}`;
    genresList.append(li);
}

//обработчики для жанров
genresList.addEventListener("click", function(event) {
    let target = event.target; // где был клик?
    if (target.tagName != 'LI' || !target.hasOwnProperty("idGenre")) return; // не на LI или нет св-ва? Не интересует
    genreId = target.idGenre;
    let tmp = document.querySelector(".genre-active");
    if (tmp)
        tmp.classList.remove("genre-active");
    target.classList.add("genre-active");
    requestMovies(target);
});

//запрос фильмов
function requestMovies(elem) {
    page = 1;
    movieBox.innerHTML = "";
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
        ajaxInProgress = true;
        if (this.readyState === this.DONE) {
            let moviesList = JSON.parse(this.responseText).results;
            ajaxInProgress = false;
            moviesList.forEach((v) => {
                addNewMovie.call(v);
            });
        }
    });
    xhr.open("GET", `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${page}&include_adult=false&sort_by=popularity.desc&language=ru-RU&api_key=87fbe9b6f9a82c88238c98fe85935d88`);
    xhr.send();
}

//Добавление фильма
function addNewMovie() {
    let li = document.createElement('li');
    li.setAttribute('class', `movie-box__item`);
    let overview = this.overview == "" ? "Описание отсутствует..." : this.overview;
    li.innerHTML = `<img src="http://image.tmdb.org/t/p/w500${this.poster_path}" width="50%" alt="Изображение"><h3>${this.title}</h3><p>${overview}</p>`;
    li.idMovie = `${this.id}`;
    movieBox.append(li);
}

//добавление фильмов при прокрутке 
window.addEventListener('scroll', function() {
    if ((this.window.scrollY + this.window.innerHeight) >= movieBox.clientHeight && !ajaxInProgress) {
        page++;
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            ajaxInProgress = true;
            if (this.readyState === this.DONE) {
                let moviesList = JSON.parse(this.responseText).results;
                ajaxInProgress = false;
                moviesList.forEach((v) => {
                    addNewMovie.call(v);
                });
            }
        });
        xhr.open("GET", `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${page}&include_adult=false&sort_by=popularity.desc&language=ru-RU&api_key=87fbe9b6f9a82c88238c98fe85935d88`);
        xhr.send();
    }
});

//обработчики для фильмов
movieBox.addEventListener("click", function(event) {
    let target = event.target; // где был клик?
    if (target.tagName != 'LI' || !target.hasOwnProperty("idMovie")) return; // не на LI или нет св-ва? Не интересует
    reqestAllInfoAboutMov(target.idMovie);
});

//запрос полробной информации по фильму
function reqestAllInfoAboutMov(idMov) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
        ajaxInProgress = true;
        if (this.readyState === this.DONE) {
            myModal.style.display = "block";
            let movieInfo = JSON.parse(this.responseText);
            ajaxInProgress = false;
            showInModal(movieInfo);
            requestTrailer(idMov);
        }
    });
    xhr.open("GET", `https://api.themoviedb.org/3/movie/${idMov}?language=ru-RU&api_key=87fbe9b6f9a82c88238c98fe85935d88`);
    xhr.send();
}

//показать в модальном окне
function showInModal(obj) {
    let companies = obj.production_companies.map((v) => { return v.name }).join(', ');
    let countries = obj.production_countries.map((v) => { return v.name }).join(', ');
    let genres = obj.genres.map((v) => { return v.name }).join(', ');
    let overview = obj.overview == "" ? "Описание отсутствует..." : obj.overview;

    modalPosterImg.src = `http://image.tmdb.org/t/p/w500${obj.poster_path}`;
    modalEtc.innerHTML = `<b>Производство:</b> <i>${companies}</i>
    <br><b>Страна:</b> <i>${countries}</i>
    <br><b>Жанр:</b> <i>${genres}</i>
    <br><b>Продолжительность:</b> <i>${obj.runtime} мин.</i>
    <br><b>Оценка:</b> <i>${obj.vote_average}</i>`;
    modalH1.innerHTML = `${obj.title}`;
    modalP.innerHTML = `${overview}`;
}

function requestTrailer(idMov) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
        ajaxInProgress = true;
        if (this.readyState === this.DONE) {
            let movieTrailerArr = JSON.parse(this.responseText).results;
            ajaxInProgress = false;
            showTrailer(movieTrailerArr);
        }
    });
    xhr.open("GET", `https://api.themoviedb.org/3/movie/${idMov}/videos?language=ru-RU&api_key=87fbe9b6f9a82c88238c98fe85935d88`);
    xhr.send();
}

function showTrailer(arr) {
    if (arr.length != 0) {
        arr.forEach((v, i) => {
            let text = document.createElement('h1');
            text.className = "modal-trailer-text";
            text.innerHTML = `Трейлер ${i+1}`;
            let frame = document.createElement('iframe');
            frame.setAttribute("src", `https://www.youtube.com/embed/${v.key}`);
            frame.className = "modal-trailer";
            frame.setAttribute("frameborder", "0");
            frame.setAttribute("allowfullscreen", "allowfullscreen");
            modalContent.append(text);
            modalContent.append(frame);
        });
    }
}