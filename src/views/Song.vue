<template>
  <div class="song">
    <el-card class="sel-card">
      <el-image
        style="float: left; margin-top: -20px; margin-left: -20px; width: 622px;"
        :src="logo"
      ></el-image>
      <div class="songinfo-box">
        <div class="sbox2">
          <h2>{{ title }}</h2>
          <strong>{{ subtitle }}</strong>
          <p>{{ info }}</p>
          <div @click="sendplayid()">
            <font-awesome-icon :icon="['fas','play-circle']" size="3x" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMusic } from "@/plugins/request";
export default {
  name: "song",
  data() {
    return {
      id: "",
      logo: "",
      title: "未知",
      subtitle: "未知",
      info: "未知"
    };
  },
  mounted() {
    this.getMusicInfo();
  },
  methods: {
    getMusicInfo() {
      getMusic(this.$route.params.id).then(res => {
        if (res.data.msg == "ok") {
          this.logo = res.data.res.anime_info.logo;
          this.title = res.data.res.title;
          this.subtitle = res.data.res.anime_info.title;
          this.info = res.data.res.anime_info.desc;
        }
      });
    },
    sendplayid() {
      // eslint-disable-next-line no-console
      //console.log(id);
      this.$emit("my-event", this.$route.params.id);
    }
  },
  watch: {
    $route() {
      this.getMusicInfo();
    }
  }
};
</script>

<style>
.song {
  margin: 100px auto;
  width: 100%;
  /* background-color: #ffffff; */
}

.sel-card {
  width: 90%;
  margin: 0 auto;
}

.songinfo-box {
  position: absolute;
  left: 50%;
  width: 600px;
}

.sbox2 {
  width: 100%;
  text-align: center;
}

.sbox2 p {
  margin-top: 20px;
  margin-bottom: 20px;
  height: 120px;
  overflow-y: auto;
}

.sbox2 svg {
  cursor: pointer;
}
</style>