<template>
  <div id="app">
    <div @postplayid="getPlay"></div>
    <transition name="fade">
      <div style="z-index:-99999999;" v-if="back_show">
        <div
          class="back_img_box"
          :style="{'background': 'url('+ back_img +') no-repeat center center'}"
        ></div>
      </div>
    </transition>
    <div class="header">
      <img class="Logo" src="./assets/logo.png" height="100%" alt="Logo" />
      <div id="nav">
        <router-link to="/">主页</router-link>
        <router-link to="/search">搜索</router-link>
        <router-link to="/about">关于</router-link>
      </div>
    </div>
    <div class="view">
      <router-view @my-event="getMyEvent" ref="childrenmode" />
      <div style="width: 100%; height: 300px;"></div>
    </div>
    <el-backtop
      bottom="400"
      visibility-height="80"
      target=".page-component__scroll .el-scrollbar__wrap"
    ></el-backtop>
    <audio @timeupdate="updateTime" autoplay :src="this.audio_src" ref="audio"></audio>
    <div class="player-bar">
      <div id="progress" @click="clickrunfatbar" ref="runfatbar">
        <div class="load" v-bind:style="{width: loadhealth+'%'}"></div>
        <div ref="runbar" v-bind:style="{width: health+'%'}" id="now">
          <div class="now-circular"></div>
        </div>
      </div>
      <div class="player-control">
        <el-image class="cover" :src="cover_img" fit="cover">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
        <div class="songinfo">
          <div @click="goSongInfo()" class="song-title">
            <strong>{{ songtitle }}</strong>
          </div>
          <div @click="searchAlbum()" class="song-album">{{ album }}</div>
        </div>
        <div class="playtime">
          <div class="od_bnt">
            <el-tooltip
              class="item"
              effect="dark"
              :content="'音量：'+this.audiovolume+'%'"
              placement="top-start"
            >
              <el-popover placement="top" width="160" v-model="volumevisible">
                音量：{{ audiovolume+"%" }}
                <el-slider v-model="audiovolume" @change="changevolume" :show-tooltip="false"></el-slider>
                <font-awesome-icon slot="reference" :icon="['fas','volume-down']" size="1x" />
              </el-popover>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="this.playmodetips" placement="top">
              <font-awesome-icon
                @click="playmode_toggle()"
                :icon="['fas', this.playmodeset]"
                size="1x"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="收藏" placement="top">
              <font-awesome-icon @click="share()" :icon="['far','heart']" size="1x" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分享" placement="top">
              <font-awesome-icon @click="share()" :icon="['fas','share']" size="1x" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置" placement="top">
              <font-awesome-icon @click="settings()" :icon="['fas','cog']" size="1x" />
            </el-tooltip>
          </div>
          {{ playtime }} / {{ allplaytime }}
        </div>
        <div class="player_ctrl_bnt">
          <el-tooltip class="item" effect="dark" content="上一首" placement="top-start">
            <font-awesome-icon @click="play_up()" :icon="['fas','chevron-left']" size="3x" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="this.statustips" placement="top">
            <font-awesome-icon
              ref="playbnt"
              @click="play_toggle()"
              :icon="['far',this.statusico]"
              size="3x"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下一首" placement="top-end">
            <font-awesome-icon @click="play_next()" :icon="['fas','chevron-right']" size="3x" />
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMusic } from "@/plugins/request";
export default {
  name: "app",
  data() {
    return {
      playmode: "random",
      playmodeset: "random",
      back_show: false,
      volumevisible: false,
      cover_img: "/img/logo.png",
      back_img_url: "",
      back_img: "",
      audio_src: "",
      health: 0,
      loadhealth: 0,
      currentTime: 0,
      statusico: "play-circle",
      songtitle: "未在播放",
      album: "未知",
      playtime: "NaN:NaN",
      allplaytime: "NaN:NaN",
      thisid: "",
      statustips: "播放",
      playmodetips: "随机播放",
      audiovolume: parseInt(localStorage.getItem("audiovolume"))
    };
  },
  created() {
    localStorage.removeItem("back_img");
  },
  mounted() {
    if (!localStorage.getItem("audiovolume")) {
      localStorage.setItem("audiovolume", parseInt(60));
      this.$refs.audio.volume =
        parseInt(localStorage.getItem("audiovolume")) / 100;
      this.audiovolume = 60;
    } else {
      this.volume = parseInt(localStorage.getItem("audiovolume"));
      this.$refs.audio.volume =
        parseInt(localStorage.getItem("audiovolume")) / 100;
    }
    this.getMusicdata();
  },
  methods: {
    goSongInfo() {
      this.$router.push({path:'/song/'+this.thisid});
    },

    searchAlbum() {
      this.$router.push({path:'/search/'+ encodeURIComponent(this.album)});
    },

    changevolume() {
      localStorage.setItem("audiovolume", this.audiovolume);
      this.$refs.audio.volume =
        parseInt(localStorage.getItem("audiovolume")) / 100;
    },

    getBase64(url) {
      //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
      var Img = new Image(),
        dataURL = "";
      Img.src = url;
      Img.setAttribute("crossOrigin", "anonymous");
      Img.onload = function() {
        //要先确保图片完整获取到，这是个异步事件
        var canvas = document.createElement("canvas"), //创建canvas元素
          width = Img.width, //确保canvas的尺寸和图片一样
          height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
        dataURL = canvas.toDataURL("image/jpeg"); //转换图片为dataURL
        //this.back_img = dataURL;
        localStorage.setItem("back_img", dataURL);
        // eslint-disable-next-line no-console
        //console.log(this.back_img);
      };
    },

    getMusicdata(id) {
      getMusic(id).then(res => {
        if (res.data.msg == "ok") {
          this.audio_src = res.data.res.play_url;
          this.$refs.audio.load;
          this.cover_img = res.data.res.anime_info.logo.replace(
            /^http/,
            "https"
          );
          this.songtitle = res.data.res.title;
          this.album = res.data.res.anime_info.title;
          this.back_img_url = res.data.res.anime_info.bg;
          this.thisid = res.data.res.id;
          // eslint-disable-next-line no-console
          console.log("ID: " + res.data.res.id);
          this.back_img = this.getBase64(this.back_img_url);
        }
      });
    },

    updateTime(e) {
      if (!localStorage.getItem("back_img")) {
        //todo
      } else {
        this.back_img = localStorage.getItem("back_img");
        setTimeout((this.back_show = true), 1000);
      }
      this.currentTime = e.target.currentTime; //获取audio当前播放时间
      this.loadtime = this.$refs.audio.buffered; //获取加载进度
      this.health = (this.currentTime / this.$refs.audio.duration) * 100;
      if (this.$refs.audio.buffered.length != 0) {
        this.loadhealth =
          (((this.$refs.audio.buffered.end(
            this.$refs.audio.buffered.length - 1
          ) *
            100) /
            this.$refs.audio.duration) *
            100) /
          100;
      }
      this.am =
        Math.floor((this.$refs.audio.duration / 60) % 60) < 10
          ? "0" + Math.floor((this.$refs.audio.duration / 60) % 60)
          : Math.floor((this.$refs.audio.duration / 60) % 60);
      this.as =
        Math.floor(this.$refs.audio.duration % 60) < 10
          ? "0" + Math.floor(this.$refs.audio.duration % 60)
          : Math.floor(this.$refs.audio.duration % 60);
      this.m =
        Math.floor((this.currentTime / 60) % 60) < 10
          ? "0" + Math.floor((this.currentTime / 60) % 60)
          : Math.floor((this.currentTime / 60) % 60);
      this.s =
        Math.floor(this.currentTime % 60) < 10
          ? "0" + Math.floor(this.currentTime % 60)
          : Math.floor(this.currentTime % 60);
      this.ret = this.m + ":" + this.s;
      this.aret = this.am + ":" + this.as;
      // eslint-disable-next-line no-constant-condition
      this.playtime = this.ret;
      this.allplaytime = this.aret;
      if (this.$refs.audio.ended) {
        //当检测到播放结束时执行动作
        this.statusico = "play-circle";
        this.statustips = "播放";
        localStorage.removeItem("back_img");
        this.back_show = false;
        if (this.playmode == "random") {
          this.getMusicdata();
        }
        if (this.playmode == "loop") {
          this.getMusicdata(this.thisid);
        }
        //setTimeout((this.back_show = false), 1300);
      }
      if (this.$refs.audio.paused != true) {
        this.statusico = "pause-circle";
        this.statustips = "暂停";
      } else {
        this.statusico = "play-circle";
        this.statustips = "播放";
      }
    },

    play_toggle() {
      if (this.statusico == "play-circle") {
        this.play();
      } else {
        this.pause();
      }
    },

    playmode_toggle() {
      if (this.playmode == "random") {
        this.playmode = "loop";
        this.playmodetips = "单曲循环";
        this.playmodeset = "undo";
      } else {
        this.playmode = "random";
        this.playmodetips = "随机播放";
        this.playmodeset = "random";
      }
    },

    clickrunfatbar(e) {
      const music = this.$refs.audio; // 音频所在对象
      const barWidth = e.pageX / this.$refs.runfatbar.offsetWidth; // 计算点击位置相对父元素总宽的比例
      this.$refs.runbar.style.width = `${barWidth * 100}%`; // 进度条应所在的比例总宽
      music.currentTime = music.duration * barWidth; // 计算点击时应播放所在的时间
    },

    getMyEvent: function(id) {
      this.getPlay(id);
    },

    getPlay(id) {
      // eslint-disable-next-line no-console
      console.log(id);
      localStorage.removeItem("back_img");
      this.back_show = false;
      this.getMusicdata(id);
    },

    play() {
      if (!this.audio_src) {
        this.getMusicdata();
      }
      this.$refs.audio.play();
      this.statusico = "pause-circle";
      this.statustips = "暂停";
    },
    pause() {
      this.$refs.audio.pause();
      this.statusico = "play-circle";
      this.statustips = "播放";
    },
    play_next() {
      localStorage.removeItem("back_img");
      this.back_show = false;
      this.getMusicdata();
    },
    play_up() {
      //todo
    },
    share() {
      //todo
    },
    settings() {}
  }
};
</script>>

<style>
* {
  padding: 0;
  margin: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-decoration: none;
}

#app {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
}

.view {
  position: absolute;
  top: 75px;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.back_img_box {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -99999999;
}

.header {
  width: 100%;
  height: 75px;
  position: absolute;
  /* background-color: #ffffff; */
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 99999999999;
}

.Logo {
  position: relative;
  left: 20px;
}

#nav {
  width: auto;
  padding: 30px;
  position: absolute;
  top: 0;
  right: 0;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  width: 80px;
  height: 100%;
  margin-right: 20px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.player-bar {
  width: 100%;
  height: 75px;
  position: absolute;
  bottom: 0;
  /* background-color: #ffffff; */
  background-color: rgba(255, 255, 255, 0.85);
}

.player-bar #progress {
  width: 100%;
  height: 4px;
  background-color: #2c3e50;
  cursor: pointer;
}

.player-bar #progress #now {
  background-color: #42b983;
  height: 4px;
  position: absolute;
  left: 0;
  z-index: 1;
}

#now .now-circular {
  width: 8px;
  height: 8px;
  background-color: #42b983;
  border-radius: 50%;
  border-style: solid;
  border-width: 4px;
  border-color: #ffffff;
  -moz-box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4); /* 老的 Firefox */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  right: -8px;
  top: -6px;
  position: absolute;
}

#progress .load {
  background-color: rgba(255, 234, 58, 0.8);
  /* background-color: #ffea3a; */
  height: 4px;
  position: absolute;
  left: 0;
}

.player-bar .player-control {
  width: 100%;
  height: 71px;
  position: absolute;
  bottom: 0;
}

.player-control .cover {
  width: 180px;
  height: 100%;
  float: left;
}

.player-control .image-slot {
  text-align: center;
  margin: 33px auto;
}

.songinfo {
  width: auto;
  padding: 10px;
  float: left;
  line-height: 25px;
}

.player-control .player_ctrl_bnt {
  margin: 0 auto;
  width: 300px;
  text-align: center;
  padding: 10px;
}

.player_ctrl_bnt svg {
  margin-left: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.song-title {
  font-size: 20px;
  cursor: pointer;
}

.song-album {
  cursor: pointer;
}

.playtime {
  font-size: 24px;
  padding: 20px;
  float: right;
}

.od_bnt {
  float: left;
  margin-right: 30px;
}

.od_bnt svg {
  margin-right: 20px;
  cursor: pointer;
}
</style>
