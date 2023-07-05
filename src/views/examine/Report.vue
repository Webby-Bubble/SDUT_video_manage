<template>
    <div class="report">

        <el-table
                :data="reportList"
                border
                style="width: 100%">
            <el-table-column
                    prop="reportUserName"
                    label="举报人"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="videoTitle"
                    label="视频标题"
                    width="180">
            </el-table-column>

            <el-table-column
                    prop="reportContent"
                    label="举报内容">
            </el-table-column>
            <el-table-column
                    label="审核状态">
                <template slot-scope="scope">
                    <span :style="scope.row.reportStatus === 1?'color:red':'color:green'" >
                        {{scope.row.reportStatus === 1?'待审核':'已审核'}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="举报时间">
            </el-table-column>
            <el-table-column
                    min-width="120px"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="showReportDetais(scope.row)" :icon="scope.row.reportStatus === 1?'el-icon-edit':'el-icon-view' " size="small">{{scope.row.reportStatus === 1?'去审核':'查看结果'}}</el-button>
                    <el-button @click="handleClick(scope.row)" icon="el-icon-delete" type="text" size="small" style="color: orangered">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="举报审核"  :center="true" :visible.sync="showReportVisible">
            <div v-if="reportForm.examineStatus === 1" class="iconfont icon-shenhechenggong examineSuccess"></div>
            <div v-if="reportForm.examineStatus === 2" class="iconfont icon-shenheshibai examineSError"></div>
            <div class="reportName">
                <div class="hzTitle">举报人:</div>
                <div style="margin-left: 10px;margin-top: -2px"><el-tag size="small">{{reportForm.reportUserName}}</el-tag></div>
            </div>
            <div>
                <div  class="hzTitle">举报内容:</div>
                <div class="reportContent">{{reportForm.reportContent}}</div>
            </div>
            <div class="reportName">
                <div  class="hzTitle">视频标题:</div>
                <div class="reporTitle">{{reportForm.videoTitle}}</div>
            </div>
            <div>
                <div  class="hzTitle">被审核视频</div>
                <div >
                    <video height="500px" width="100%" :src="reportForm.videoPath" controls></video>
                </div>
            </div>
            <div>
                <div  class="hzTitle">被举报图片</div>
                <div>
                    <el-image
                            v-for="(item,index) in reportForm.reportImgs" :key="index"
                        style="width: 130px; height: 130px;margin-right: 20px;margin-top: 10px"
                        :src="item"
                        :preview-src-list="reportForm.reportImgs">
                    </el-image>
                </div>
            </div>
            <div>
                <div class="hzTitle">审核信息</div>
                <el-input
                        v-if="reportForm.reportStatus === 1"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入审核结果信息"
                        v-model="examineResult.examineContent">
                </el-input>
                <div v-if="reportForm.reportStatus === 2" style="background-color: #caf4e1;padding: 10px;margin-top: 10px">{{reportForm.examineContent}}</div>
            </div>
            <div class="buttonBottom" v-if="reportForm.reportStatus === 1">
                <el-button type="success" @click="updateExamineResult(2)">驳回（无违规）</el-button>
                <el-popover
                        placement="bottom"
                        title="提示"
                        width="200"
                        trigger="hover"
                        content="确认违规后，此视频将会被下架处理。、
                        并会发送邮件给m1835139063@163.com的用户通知审核结果。">
                    <el-button slot="reference" type="warning" @click="updateExamineResult(1)">有违规</el-button>
                </el-popover>
            </div>
        </el-dialog>

        <el-pagination
                style="margin-bottom: 30px;margin-top: 40px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[4, 6, 8, 12]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "report",
        data(){
            /* 定义初始化变量 */
            return{
                examineResult:{
                    id:'',
                    reportUserName:'',
                    videoTitle:'',
                    examineStatus:'',
                    reportStatus:'',
                    examineContent:'',
                    email:'m18396889032@163.com',
                    //这两个字段用来后端判断去更改影视还是短视频的状态
                    videoId:'',
                    shortVideoId:''
                },
                pageNum:1,
                pageSize:6,
                total:0,
                reportList:[],
                showReportVisible:false,
                reportForm:{

                }
            }
        },
        /* 定义事件函数 */
        methods:{
            //有违规
            updateExamineResult(status){
                this.examineResult.reportUserName = this.reportForm.reportUserName
                this.examineResult.videoTitle = this.reportForm.videoTitle
                this.examineResult.videoId = this.reportForm.videoId
                this.examineResult.shortVideoId = this.reportForm.shortVideoId
                if(status === 1){
                    //举报成功
                    this.examineResult.examineStatus = 1
                }else {
                    //举报失败
                    this.examineResult.examineStatus = 2
                }

                //完成审核
                this.examineResult.reportStatus = 2

                //举报id
                this.examineResult.id = this.reportForm.id
                this.$http.post('/rst-video/video/updateReportExamine',this.examineResult).then(res=>{
                        if(res.data.code === 200 ){
                            this.$message.success("审核完成~")
                            this.examineResult.examineContent = ''
                            this.showReportVisible = false
                            this.queryAllReportInfoList()
                        }
                })

            },
            showReportDetais(report){
                this.showReportVisible = true
                this.reportForm = {...report}
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.queryAllReportInfoList()
            },
            handleCurrentChange(pageNum){
                this.pageNum = pageNum
                this.queryAllReportInfoList()
            },
            queryAllReportInfoList(){
                this.$http.get('/rst-video/video/queryAllReportInfoList',{params:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize
                    }}).then(res=>{
                    this.reportList = res.data.data.rows
                    this.pageNum = res.data.data.pageNum
                    this.total = res.data.data.total
                })
            }
        },
        /* vue的生命周期函数
           当页面加载完毕就会执行created里面的函数
        */
        created() {
            this.queryAllReportInfoList()
        }
    }
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>
    @import url("Report.css");
</style>