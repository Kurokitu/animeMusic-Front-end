<template>
  <div class="search">
    <div class="search-bar">
      <div class="select-box">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="input-box">
        <el-input v-model="serachinput"  @keyup.enter.native="getSerachdata()" placeholder="请输入要搜索的内容"></el-input>
      </div>
      <div class="serach-bnt-box">
        <el-button @click="getSerachdata()" type="primary">搜索</el-button>
      </div>
    </div>
    <div class="SearchOK">
      <el-card :key="item.id" v-for="item in datares" class="box-card">
        <el-image
          style="width: 180px; height: 100px; float:left; margin-top: -20px; margin-left: -20px;"
          :src="item.anime_info.logo"
          fit="cover"
        ></el-image>
        <div class="songinfo">
          <div class="title">
            <strong>{{ item.title }}</strong>
          </div>
          <div class="album">{{ item.anime_info.title }}</div>
        </div>
        <div @click="sendplayid(item.id)" class="card-play">
          <font-awesome-icon :icon="['fas','play-circle']" size="3x" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { SearchTitle, SearchAnime } from "@/plugins/request";
export default {
  name: "serach",
  data() {
    return {
      options: [
        {
          value: "title",
          label: "按歌曲名搜索"
        },
        {
          value: "anime",
          label: "按动漫名搜索"
        }
      ],
      value: "title",
      serachinput: "",
      datares: [],
      title: "未知",
      album: "未知"
    };
  },
  mounted() {},
  methods: {
    getSerachdata() {
      if (this.value == "title") {
        SearchTitle(this.serachinput).then(res => {
          if (res.data.msg == "ok") {
            this.datares = res.data.res;
          }
        });
      }
      if (this.value == "anime") {
        SearchAnime(this.serachinput).then(res => {
          if (res.data.msg == "ok") {
            this.datares = res.data.res;
          }
        });
      }
    },
    sendplayid(id) {
      // eslint-disable-next-line no-console
      //console.log(id);
      this.$emit('my-event',id);
    }
  }
};
</script>

<style>
.search {
  margin: 100px auto;
  width: 100%;
  /* background-color: #ffffff; */
  height: 100%;
}

a {
  color: #42b983;
}

.search-bar {
  width: 60%;
  position: relative;
  top: 0;
  margin: 0 auto;
  height: 100px;
}

.search-bar el-select {
  float: left;
}

.search-bar .select-box {
  float: left;
}

.search-bar .input-box {
  float: left;
  width: 70%;
  margin-left: 20px;
}

.search-bar .serach-bnt-box {
  float: left;
  margin-left: 20px;
}

.search-bar .serach-bnt-box span {
  color: #ffffff;
}

.SearchOK {
  width: 80%;
  position: relative;
  margin: 0 auto;
}

.box-card {
  float: left;
  width: 40%;
  margin-left: 5%;
  margin-top: 20px;
}

.SearchOK .songinfo {
  width: auto;
  float: left;
  line-height: 25px;
  margin-top: -25px;
}

.SearchOK .songinfo .title {
}

.SearchOK .songinfo .album {
}

.card-play {
  float: right;
  margin-top: 5px;
}

.card-play svg{
  cursor: pointer;
}
</style>