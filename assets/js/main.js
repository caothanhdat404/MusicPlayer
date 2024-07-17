const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

/*
1.Render
2.Scroll top
3.Play/pause/peek
4.CD rotate
5.Next/Previous
6.Random
7.Next/Repeat when ended
8.Active song
9. Scroll active song into view
10. Play song when click
11.Mute
12．Option
*/

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: '夜にかける',
            singer: 'YOASOBI',
            path: 'assets/music/song1.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: '飛天',
            singer: 'YOASOBI',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'アイドル',
            singer: 'YOASOBI',
            path: './assets/music/song3.mp3',
            image: './assets/img/img3.png'
        },
        {
            name:'あの夢をなぞって',
            singer: 'YOASOBI',
            path: './assets/music/song4.mp3',
            image: './assets/img/img4.jpg'
        },
        {
            name: 'たぶん',
            singer: 'YOASOBI',
            path: './assets/music/song5.mp3',
            image: './assets/img/img5.png'
        },
        {
            name: 'ミスター',
            singer: 'YOASOBI',
            path: './assets/music/song6.mp3',
            image: './assets/img/img6.jpg'
        },
        {
            name: '勇者',
            singer: 'YOASOBI',
            path: './assets/music/song7.mp3',
            image: './assets/img/img7.jpg'
        },
        {
            name: '好きだ',
            singer: 'YOASOBI',
            path: './assets/music/song8.mp3',
            image: './assets/img/img8.jpg'
        },
        {
            name: 'Monster',
            singer: 'YOASOBI',
            path: './assets/music/song9.mp3',
            image: './assets/img/img9.jpg'
        },
        {
            name: '海のまにまに',
            singer: 'YOASOBI',
            path: './assets/music/song10.mp3',
            image: './assets/img/img10.png'
        }
    ],
    //RENDER
    render:function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                    `
        })

        playlist.innerHTML = htmls.join('')
        //END RENDER
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        //Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate( [
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()
        //SCROLL TOP
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //END SCROLL TOP

        //Click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
                
            }
        }

        //Khi song được play
        audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
        }
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Previous song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Random
        randomBtn.onclick = function() {
            if(_this.isRandom) {
                _this.isRandom = false
                randomBtn.classList.remove('active')
            } else {
                _this.isRandom = true
                randomBtn.classList.add('active')
            }
        }

        // Random toggle
        /*
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
         */

        // Next /Repeat song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        repeatBtn.onclick = function() {
            if(_this.isRepeat) {
                _this.isRepeat = false
                repeatBtn.classList.remove('active')
            } else {
                _this.isRepeat = true
                repeatBtn.classList.add('active')
            }
        }
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || !e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',

            })
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let temp
        do {
            temp = this.currentIndex
            this.currentIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === temp)

        this.loadCurrentSong()
    },
    start:function() {
        // Định nghĩa các thuộc tính của object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()

        this.render()

    }
}

app.start()