<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text" v-text="title"></h2>
          <!--<p class="brand-info__intro">医联体&#45;&#45;简介</p>-->
        </div>
        <div class="login-main">
          <h3 class="login-title">管理员登录</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            @keyup.enter.native="dataFormSubmit()"
            hide-required-asterisk
            ref="dataForm"
          >
            <el-form-item prop="UserName">
              <el-input clearable placeholder="帐号" v-model="dataForm.UserName"></el-input>
            </el-form-item>
            <el-form-item prop="Password">
              <el-input clearable placeholder="密码" type="password" v-model="dataForm.Password"></el-input>
            </el-form-item>
            <el-form-item prop="Captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input clearable placeholder="验证码" v-model="dataForm.Captcha"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="img" @click="getCaptcha" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="isLogin"
                @click="dataFormSubmit()"
                class="login-btn-submit"
                type="primary"
              >{{isLogin?'正在登陆':'登陆'}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hex_md5, userList } from "@/utils/md5.js";

export default {
  data() {
    return {
      dataForm: {
        UserName: "",
        Password: "",
        Captcha: "",
        SessionId: ""
      },
      dataRule: {
        UserName: [
          { required: true, message: "帐号不能为空", trigger: "change" }
        ],
        Password: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ],
        Captcha: [
          { required: true, message: "验证码不能为空", trigger: "change" }
        ]
      },
      isLogin: false,
      baseURL: window.SITE_CONFIG["baseUrl"],
      img: ""
    };
  },
  created() {
    this.title = window.SITE_CONFIG["orgName"];
    this.getCaptcha();
  },
  mounted() {
    document.body.style["overflow-y"] = "auto";
    // 如果cookie有账号就从cookie里边取
    let account = this.$cookie.get("account");
    if (account && account !== "") {
      this.dataForm.UserName = account;
    }
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.isLogin = true;
          let params = JSON.parse(JSON.stringify(this.dataForm));
          params.Password = hex_md5(this.dataForm.Password);
          this.$store
            .dispatch("LoginByUserName", params)
            .then(res => {
              console.log(res);
              if (res.data && res.data.Status === 0) {
                let serverTime = new Date(
                  res.data.Data.SERVER_TIME.replace(/-/g, "/")
                );
                let localTime = new Date();
                let timeSpan = localTime - serverTime;
                localStorage.setItem("private_key", res.data.Data.PRIVATE_KEY); // 私钥
                localStorage.setItem(
                  "token_expires_at",
                  res.data.Data.EXPIRES_AT
                ); // token过期时间
                localStorage.setItem("access_token", res.data.Data.ACCESS_KEY); // token
                localStorage.setItem("server_local_timeSpan", timeSpan); // 服务器时间与本地时间差

                this.$router.replace({ name: "home" });
                this.$store.dispatch("getRank").then(); //获取优先级
                this.remenberAccount(); // 记住账号
              } else {
                this.getCaptcha();
                localStorage.setItem("access_token", ""); // token
                this.isLogin = false;
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.isLogin = false;
            });
        }
      });
    },
    remenberAccount() {
      this.$cookie.set("account", this.dataForm.UserName, 5);
    },
    getCaptcha() {
      this.$http({
        url: "/api/Login/GetCode",
        method: "get"
      }).then(res => {
        if (res.data.Status === 0) {
          this.dataForm.SessionId = res.data.Data.SessionId;
          this.img = this.baseURL + res.data.Data.ImgUrl;
        } else {
          this.$message.error(res.data.Message);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.4);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background-image: url(~@/assets/img/manbing.jpg);
    background-size: cover;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
    padding: 30px 500px 30px 30px;
  }
  .brand-info {
    margin: 220px 100px 0 90px;
    color: #fff;
  }
  .brand-info__text {
    text-align: center;
    margin: 0 0 22px 0;
    font-size: 56px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    position: absolute;
    top: 0;
    right: 0;
    padding: 150px 60px 180px;
    width: 470px;
    min-height: 100%;
    background-color: #fff;
  }
  .login-title {
    font-size: 18px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    // margin-top: 10px;
    font-size: 15px;
  }
}
</style>
