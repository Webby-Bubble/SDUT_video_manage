<template>
    <transition name="etoak">
        <div class="shortVideoManage" v-show="show">
            <el-form :inline="true" :model="queryShortVideoForm" class="demo-form-inline">
                <el-form-item label="视频内容">
                    <el-input v-model="queryShortVideoForm.videoContent" placeholder="视频内容模糊搜索"></el-input>
                </el-form-item>
                <el-form-item label="视频状态">
                    <el-select v-model="queryShortVideoForm.videoStatus" placeholder="视频状态">
                        <el-option label="违规" value="3"></el-option>
                        <el-option label="未审核" value="1"></el-option>
                        <el-option label="正常" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryAllShortVideoList()">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    :data="shortVideoList"
                    border
                    style="width: 100%">
                <el-table-column
                        label="用户头像"
                        width="180">
                    <template slot-scope="scope">
                        <el-image style="height: 80px;width: 80px" :src="scope.row.userPic"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="发布者"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="videoContent"
                        label="短视频内容">
                </el-table-column>
                <el-table-column
                        label="视频播放">
                    <template slot-scope="scope">
                        <el-button @click="showVideoPlay(scope.row.videoPath)" icon="el-icon-video-play" type="text">点击播放视频</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="likeCount"
                        label="视频获赞量">
                </el-table-column>
                <el-table-column
                        label="视频状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.videoStatus === 2?'success':'danger'" >
                            {{scope.row.videoStatus === 2?'正常':scope.row.videoStatus ===1?'未审核':scope.row.videoStatus ===3?'违规':'已下架'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120px"
                        label="操作">
                    <template slot-scope="scope">
                            <el-popconfirm
                                    :title="title"
                                    :cancel-button-text="cancelText"
                                    :confirm-button-text="confirmText"
                                    @confirm="confirm(scope.row)">
                                <el-button slot="reference" type="text" @click="showVideoEdit(scope.row)" icon="el-icon-edit" size="small">操作</el-button>
                            </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    style="margin-bottom: 30px;margin-top: 30px"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[6, 8, 10, 12]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <el-dialog :close-on-click-modal="false" title="视频查看" :visible.sync="showShortVideoVisiable">
                <video width="100%" height="800px" controls :src="videoPath"></video>
            </el-dialog>

            <!--审核短视频-->
            <el-dialog center :close-on-click-modal="false" title="视频审核" :visible.sync="showExamineVisiable">
                <div class="reportName">
                    <div class="hzTitle">发布人:</div>
                    <div style="margin-left: 10px;margin-top: -2px"><el-tag size="small">{{examineForm.userName}}</el-tag></div>
                </div>
                <div>
                    <div  class="hzTitle">视频内容:</div>
                    <div class="reportContent">{{examineForm.videoContent}}</div>
                </div>

                <div>
                    <div  class="hzTitle">被审核视频</div>
                    <div >
                        <video height="500px" width="100%" :src="examineForm.videoPath" controls></video>
                    </div>
                </div>
                <div>
                    <div  class="hzTitle">视频封面</div>
                    <div>
                        <el-image
                                style="width: 130px; height: 130px;margin-right: 20px;margin-top: 10px"
                                :src="examineForm.videoCover"
                                :preview-src-list="imgs">
                        </el-image>
                    </div>
                </div>

                <div class="buttonBottom" >
                    <el-button type="danger" @click="examineResult(3)">有违规</el-button>

                    <el-button slot="reference" type="success" @click="examineResult(2)">通过</el-button>
                </div>
            </el-dialog>


        </div>
    </transition>
</template>

<script>
    export default {
        name: "ShortVideoManage",
        data() {
            return {
                showExamineVisiable:false,//短视频视频审核
                queryShortVideoForm:{
                    videoContent:'',
                    videoStatus:''
                },
                title:'',
                confirmText:'',
                cancelText:'',
                videoPath:'',
                showShortVideoVisiable:false,
                showShortVideoOptionVisiable:false,
                pageNum:1,
                pageSize:6,
                total:0,
                show: false,
                shortVideoList: [],
                shortVideoOptionForm:{
                    videoStatus:'',
                },
                examineForm:{},//视频审核对象
                imgs:[]
            }
        },
        methods:{
            examineResult(status){
                this.$http.get('/rst-video/manager/examineResult',{params:{
                        id:this.examineForm.id,
                        status:status
                    }}).then(res=>{
                        if(res.data.code === 200){
                            if(status === 2){
                                this.$message.success('审核通过')
                                this.showExamineVisiable = false
                                this.queryAllShortVideoList()
                            }else {
                                this.$message.success('存在违规')
                                this.showExamineVisiable = false
                                this.queryAllShortVideoList()
                            }

                        }else {
                            this.$message.success('审核失败')
                            this.showExamineVisiable = false
                            this.queryAllShortVideoList()
                        }
                })
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.queryAllShortVideoList()
            },
            handleCurrentChange(pageNum){
                this.pageNum = pageNum
                this.queryAllShortVideoList()
            },
            confirm(row){
                if(row.videoStatus === 1){
                    this.showExamineVisiable = true
                    this.imgs.push(row.videoCover)
                    this.examineForm = {...row}

                }else {
                    //正常改为违规  违规改为正常
                    let videoStatus = row.videoStatus === 2?3:2
                    this.$http.get('/rst-video/manager/updateShortVideoStatus',{params:{
                            videoStatus:videoStatus,
                            id:row.id
                        }}).then(res=>{
                        if(res.data.code === 200){
                            this.$message.success('操作成功')
                            this.queryAllShortVideoList()
                        }else {
                            this.$message.error('操作失败')
                        }
                    })
                }

            },
            showVideoEdit(row){
                if(row.videoStatus === 1){
                    this.confirmText = '去审核'
                    this.cancelText = '取消'
                    this.title = '此视频暂未审核，前往审核页面'
                }else if(row.videoStatus === 2){
                    this.confirmText = '下架'
                    this.cancelText = '取消'
                    this.title = '您需要下架此视频吗？'
                }else if(row.videoStatus === 3){
                    this.confirmText = '恢复正常'
                    this.cancelText = '取消'
                    this.title = '您需要将此视频恢复正常吗？'
                }
                this.shortVideoOptionForm = {...row}

            },
            showVideoPlay(videoPath){
              this.showShortVideoVisiable = true
              this.videoPath =  videoPath
            },
            queryAllShortVideoList(){
                this.$http.get('/rst-video/video/queryAllShortVideo',{params:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                        videoContent:this.queryShortVideoForm.videoContent,
                        videoStatus:this.queryShortVideoForm.videoStatus
                    }}).then(res=>{
                    this.shortVideoList = res.data.data.rows
                    this.show = true
                    this.total = res.data.data.total
                })
            }
        },
        created() {
            this.queryAllShortVideoList()
        }
    }
</script>

<style scoped>
    .etoak-enter-active,.etoak-leave-active{
        transition: all 1.5s;
    }
    .etoak-enter,.etoak-leave-to{
        opacity:0;
        transform: translateX(30px);
    }
    @import url("ShortVideoManage.css");
</style>