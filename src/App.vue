<template>
  <div id="app">
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
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </div>
    </div>
    <router-view />
    <audio @timeupdate="updateTime" autoplay :src="this.audio_src" ref="audio"></audio>
    <div class="player-bar">
      <div id="progress" @click="clickrunfatbar" ref="runfatbar">
        <div class="load" v-bind:style="{width: loadhealth+'%'}"></div>
        <div ref="runbar" v-bind:style="{width: health+'%'}" id="now">
          <div class="now-circular"></div>
        </div>
      </div>
      <div class="player-control">
        <img class="cover" :src="cover_img" alt="cover" />
        <div class="songinfo">
          <div class="song-title">
            <strong>{{ songtitle }}</strong>
          </div>
          <div class="song-album">{{ album }}</div>
        </div>
        <div class="playtime">
          <div class="od_bnt">
            <el-tooltip class="item" effect="dark" content="收藏" placement="top-start">
              <font-awesome-icon @click="share()" :icon="['far','heart']" size="1x" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分享" placement="top-start">
              <font-awesome-icon @click="share()" :icon="['fas','share']" size="1x" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置" placement="top-start">
              <font-awesome-icon @click="settings()" :icon="['fas','cog']" size="1x" />
            </el-tooltip>
          </div>
          {{ playtime }} / {{ allplaytime }}
        </div>
        <div class="player_ctrl_bnt">
          <el-tooltip class="item" effect="dark" content="上一首" placement="top-start">
            <font-awesome-icon @click="play_up()" :icon="['fas','chevron-left']" size="3x" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="this.statustips" placement="top-start">
            <font-awesome-icon
              ref="playbnt"
              @click="play_toggle()"
              :icon="['far',this.statusico]"
              size="3x"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下一首" placement="top-start">
            <font-awesome-icon
              @click="play_next()"
              :icon="['fas','chevron-right']"
              size="3x"
            />
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
      back_show: false,
      cover_img: "/img/JLOGO.png",
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
      statustips: "播放"
    };
  },
  created() {},
  mounted() {
    this.getMusicdata();
  },
  methods: {
    getMusicdata() {
      getMusic().then(res => {
        if (res.data.msg == "ok") {
          this.audio_src = res.data.res.play_url;
          this.$refs.audio.load;
          this.cover_img = res.data.res.anime_info.logo;
          this.songtitle = res.data.res.title;
          this.album = res.data.res.anime_info.title;
          this.back_img = res.data.res.anime_info.bg;
          this.thisid = res.data.res.id;
          // eslint-disable-next-line no-console
          console.log("ID: " + res.data.res.id);
          setTimeout(this.back_show = true, 1300);
        }
      });
    },

    updateTime(e) {
      this.currentTime = e.target.currentTime; //获取audio当前播放时间
      this.loadtime = this.$refs.audio.buffered; //获取加载进度
      this.health = (this.currentTime / this.$refs.audio.duration) * 100;
      this.loadhealth =
        (((this.$refs.audio.buffered.end(this.$refs.audio.buffered.length - 1) *
          100) /
          this.$refs.audio.duration) *
          100) /
        100;
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
        this.statusico = "play-circle";
        this.statustips = "播放";
        this.getMusicdata();
        setTimeout(this.back_show = false, 1300);
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

    clickrunfatbar(e) {
      const music = this.$refs.audio; // 音频所在对象
      const barWidth = e.pageX / this.$refs.runfatbar.offsetWidth; // 计算点击位置相对父元素总宽的比例
      this.$refs.runbar.style.width = `${barWidth * 100}%`; // 进度条应所在的比例总宽
      music.currentTime = music.duration * barWidth; // 计算点击时应播放所在的时间
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
      this.getMusicdata();
      this.back_show = false;
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 3.5s;
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
  position: relative;
  background-color: #ffffff;
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
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
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
  width: auto;
  height: 100%;
  float: left;
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
}
</style>
