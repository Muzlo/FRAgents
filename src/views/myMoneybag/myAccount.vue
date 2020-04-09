<template>
  <div class="myAccount">
    <el-form :inline="true" :rules="rules" ref="form" :model="formInline" class="demo-form-inline" label-width="200px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" prop="agentLinkmang">
            <el-input v-model="formInline.agentLinkmang" placeholder="联系人" class="pr-30"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号" prop="agentMobile">
            <el-input v-model="formInline.agentMobile" placeholder="手机号" class="pr-30"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="开户行名称/支付宝">
            <el-input v-model="formInline.bankName" placeholder="开户行名称/支付宝" class="pr-30"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行卡号/支付宝">
            <el-input v-model="formInline.bankCardno" placeholder="银行卡号/支付宝" class="pr-30"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="12">
          <el-form-item label="省份">
            <el-select
            v-model="formInline.agentProv"
            placeholder="请选择"
            filterable
            @change="citySearchFn"
          >
                <el-option
                v-for="item in province"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                ></el-option>
            </el-select>

          </el-form-item>





        </el-col>

        <el-col :span="12">
          <el-form-item label="城市">
            <el-select v-model="formInline.agentCiity" placeholder="请选择">
              <el-option v-for="item in city" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="联系电话">
            <el-input v-model="formInline.agentTel " placeholder="联系电话" class="pr-30"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="详细地址">
            <el-input type="textarea" rows="2" cols="22" v-model="formInline.agentAddress " placeholder="详细地址" class="pr-30"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6" :offset="10">
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            </el-form-item>
        </el-col>
 
      </el-row>

    </el-form>

  </div>
</template>

<script>


export default {
  name: "myAccount",
  data() {
    return {
      formInline: {
        agentLinkmang:null,
        agentMobile:null,
        bankName:null,
        bankCardno:null,
        agentProv:null,
        agentCiity:null,
        agentTel:null,
        agentAddress:null
      },
      rules:{
          agentLinkmang:[
            { required: true, message: '必填信息', trigger: 'blur' },
          ],
          agentMobile:[
            { required: true, message: '必填信息', trigger: 'blur' },
          ],
      },
      province: null, //省份
      city: null, //城市
    };
  },
  methods: {
    //获取账户信息
    async getMyInfoFn() {
      try {
        let data = await this.$axios.post(
          "/fr/MyWallet/getMyAgentMs",
          this._qs.stringify({
            userId:localStorage.getItem("userid"),
            agentId:localStorage.getItem("agentid"),
            userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
          })
        );
        if (data.errcode == 0) {
          this.formInline={
            agentLinkmang:data.data.data.agentlinkmang,
            agentMobile:data.data.data.agentmobile,
            bankName:data.data.data.bankname,
            bankCardno:data.data.data.bankcardno,
            agentProv:data.data.data.agentprov,
            agentCiity:data.data.data.agentciity,
            agentTel:data.data.data.agenttel,
            agentAddress:data.data.data.agentaddress
          }
          if(this.formInline.agentProv){
            this.citySearchFn(this.formInline.agentProv);
          }
        }
      } catch (err) {
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    //处理字符串省市
    dealProvinceCity(data) {
      let str = data.lst;
      let provinceDeal = new Array();
      str = str.split("</option>");
      let len = str.length;
      str.splice(len - 1, 1);
      str.forEach((item, index) => {
        let provinceDealJson = {};
        provinceDealJson.name = item.split(">")[1];
        provinceDeal[index] = provinceDealJson;
      });
      return provinceDeal;
    },
    //获取省份
    async getProvince() {
      try {
        let data = await this.$axios.post("/fr/MyAgent/cardArea");
        if (data.errcode == 0) {
          this.province = this.dealProvinceCity(data);
        }
      } catch (err) {
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    //获取对应城市
    async citySearchFn(val) {
      try {
        let data = await this.$axios.post(
          "/fr/MyAgent/cardCity",
          this._qs.stringify({
            area: val
          })
        );
        if (data.errcode == 0) {
          this.city = this.dealProvinceCity(data);
        }
      } catch (err) {
        this.$message.error("服务器异常，请稍后再试！");
      }
    },

    onSubmit(formName) {
        let paramsObj={
            userName:JSON.parse(localStorage.getItem("userLoginInfo")).username,
            userId:localStorage.getItem("userid"),
            agentId:localStorage.getItem("agentid"),
            ...this.formInline
        }

        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            try{
                let data = await this.$axios.post("/fr/MyWallet/updMyAgentMs",this._qs.stringify(paramsObj)); 
                data.errcode==0?this.$message.success(data.errmsg):this.$message.warning(data.errmsg)
            }catch(err){
                this.$message.error("服务器异常，请稍后再试！");
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });



    }
  },
  created() {
    this.getMyInfoFn();

  },
  mounted(){
    this.getProvince();
  },
  computed: {}
};
</script>

<style scoped>
.myAccount >>> .pr-30 input,
.myAccount >>> .pr-30 textarea {
  padding-right: 30px !important;
}
</style>