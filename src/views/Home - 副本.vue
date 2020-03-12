<template>
    <div class="home-container">
        <div class="home-content">
            <!-- 首页
            <input type="text">
            {{this.$store.state.login.str}} -->


            <el-form :inline="true">
                <el-form-item label="文件上传">
                    <el-input size="small" v-model="fileName" :readonly='true' placeholder="文件名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload
                    ref="upload"
                    action="#"
                    accept=".xls,.xlsx"
                    :file-list="fileList"
                    :show-file-list="false"
                    :beforeUpload="beforeAvatarUpload"
                    :http-request="httpRequest"
                    >
                    <el-button size="small" type="primary">上传文件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>


        </div>
    </div>
</template>

<script>

export default {
    name: 'home',
    data(){
        return {
            fileName: '',
            fileList:[]
        }
    },
    created(){},
    methods:{
        beforeAvatarUpload(file) {      
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                
            const extension = testmsg === 'xls'
            const extension2 = testmsg === 'xlsx'
            const isLt2M = file.size / 1024 / 1024 < 10
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'warning'
                });
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 10MB!',
                    type: 'warning'
                });
            }

            if(extension || extension2 && isLt2M){
                this.fileName=file.name
            }
            return extension || extension2 && isLt2M
        },
        httpRequest(param) {
            
            let fileObj = param.file // 相当于input里取得的files
            console.log(fileObj);
            
            let fd = new window.FormData()// FormData 对象
            fd.append('file', fileObj)// 文件对象
            
            // let url = url;
            // let config = {
            //     headers: {
            //     'Content-Type': 'multipart/form-data'
            //     }
            // }
            // axios.post(url, fd, config).then(res=>{
            //     if(res.code===0){
            //         this.submitForm();//提交表单
            //     }
            // })
        }


    }
}
</script>

<style scoped>
.home-container {
    padding: 10px;
    padding-top: 5px;
}
.home-content {
    padding: 10px;
    border-radius: 5px;
    background: #fff;
}
</style>