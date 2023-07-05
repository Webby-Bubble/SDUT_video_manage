<template>
    <transition name="etoak">
        <div class="videoManage" v-show="show">
            <div style="margin-bottom: 20px">
                <el-input
                        style="width: 200px"
                        size="small"
                        placeholder="请输入影视标题"
                        v-model="queryForm.videoTitle">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-select style="margin-left: 30px" size="small" v-model="queryForm.videoKind" placeholder="请选择视频种类">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button @click="getAllVideoList(1)" type="primary" size="mini" style="margin-left: 20px">搜索</el-button>
            </div>

            <el-table
                    :data="videoList"
                    border
                    style="width: 100%">
                <el-table-column  type="expand">
                    <template slot-scope="scope">
                       <el-table
                           :data="scope.row.videoChildrenList"
                           border
                           style="width: 100%">
                           <el-table-column
                                   prop="videoAnthology"
                                   label="集数/期数"
                                   min-width="60px">
                           </el-table-column>
                           <el-table-column
                                   prop="videoPath"
                                   label="选集路径"
                                   min-width="600px">
                           </el-table-column>
                           <el-table-column
                                   fixed="right"
                                   label="操作">
                               <template slot-scope="scope">
                                   <el-button type="text" @click="showXuanJi(scope.row)" icon="el-icon-edit" size="small">编辑</el-button>
                                   <el-button @click="handleClick(scope.row)" icon="el-icon-delete" type="text" size="small" style="color: orangered">删除</el-button>
                               </template>
                           </el-table-column>
                       </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                        label="影视封面"
                        min-width="180">
                    <template slot-scope="scope">
                        <div class="picAndChange">
                            <el-image :src="scope.row.videoCover" style="height: 50px"></el-image>
                            <el-button @click="showVideoCoverVisiable(scope.row.videoCover,scope.row.id)" style="height: 20px;padding-top: 3px;margin-top: 5px">更换封面</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="videoTitle"
                        label="影视标题"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        min-width="100px"
                        label="影视种类">
                    <template slot-scope="scope">
                        {{scope.row.videoKind === 1?'电影':scope.row.videoKind === 2?'电视剧':scope.row.videoKind === 3?'综艺':'动漫'}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="100px"
                        label="影视状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.videoStatus === 0?'danger':'success'">{{scope.row.videoStatus === 0?'未上映':'上映'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="publishTime"
                        label="上映时间"
                        min-width="180px">
                </el-table-column>
                <el-table-column
                        label="影视简介"
                        min-width="400px">
                    <template slot-scope="scope">
                        {{scope.row.videoContent.length >80?scope.row.videoContent.substring(0,80) + '...':scope.row.videoContent}}
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="120px"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showVideoEdit(scope.row)" icon="el-icon-edit" size="small">编辑</el-button>
                        <el-button @click="handleClick(scope.row)" icon="el-icon-delete" type="text" size="small" style="color: orangered">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    style="margin-bottom: 30px"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[6, 8, 10, 12]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <!--修改视频封面-->
            <el-dialog width="30%" center title="更改影视封面" :visible.sync="videoCoverVisiable">
                <el-form :model="videoForm" style="text-align: center">
                    <el-form-item  >
                        <el-upload
                                :action="path + '/uploadVideoCover'"
                                :show-file-list="false"
                                :on-success="success" >
                            <img width="200px" height="300px" v-if="videoForm.videoCover" :src="videoForm.videoCover" class="avatar">
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="videoCoverVisiable = false">取 消</el-button>
                    <el-button type="primary" @click="updateVideoCover()">确 定</el-button>
                </div>
            </el-dialog>

            <!--编辑视频信息-->
            <el-dialog  title="编辑影视信息" width="40%" :visible.sync="videoFormVisiable">
                <el-form :model="videoForm" ref="videoForm" :rules="videoRules">
                    <el-form-item label="影视标题" prop="videoTitle">
                        <el-input v-model="videoForm.videoTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="影视种类" prop="videoKind">
                        <el-select v-model="videoForm.videoKind" placeholder="请选择影视种类">
                            <el-option label="电影" value="1"></el-option>
                            <el-option label="电视剧" value="2"></el-option>
                            <el-option label="综艺" value="3"></el-option>
                            <el-option label="动漫" value="4"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="影视类别" prop="videoTypes">
                        <el-input v-model="videoForm.videoTypes"></el-input>
                    </el-form-item>
                    <el-form-item label="影视导演" prop="director">
                        <el-input v-model="videoForm.director"></el-input>
                    </el-form-item>
                    <el-form-item label="影视演员" prop="stars">
                        <el-input type="textarea" v-model="videoForm.stars"></el-input>
                    </el-form-item>
                    <el-form-item label="上映时间" prop="publishTime">
                        <el-date-picker
                                v-model="videoForm.publishTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择上映日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="影视介绍" prop="videoContent">
                        <el-input type="textarea" v-model="videoForm.videoContent"></el-input>
                    </el-form-item>
                    <el-form-item label="上映状态" prop="videoStatus">
                        <el-select v-model="videoForm.videoStatus" placeholder="请选择影视种类">
                            <el-option label="上映" value="1"></el-option>
                            <el-option label="未上映" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="videoFormVisiable = false">取 消</el-button>
                    <el-button type="primary" @click="updateVideoForm('videoForm')">确 定</el-button>
                </div>
            </el-dialog>

            <!--修改视频选集-->
            <el-dialog width="30%"  title="更改选集" :visible.sync="videoChildVisiable">
                <el-form :model="videoChildForm" ref="videoChildForm" :rules="videoChildRules">
                    <el-form-item  >
                        <el-upload
                                class="upload-demo"
                                :action="path + '/uploadVideoChild'"
                                :on-success="videoChildSuccess"
                                 multiple
                                :limit="1"
                                :on-exceed="videoChildExceed"
                                :file-list="videoChildFileList"
                                >
                            <el-button size="small" type="primary">更换选集</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="当前选集" prop="videoPath">
                        <el-input  v-model="videoChildForm.videoPath"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="videoChildVisiable = false">取 消</el-button>
                    <el-button type="primary" @click="updateVideoChildForm('videoChildForm')">确 定</el-button>
                </div>
            </el-dialog>


        </div>
    </transition>
</template>

<script>
    export default {
        name: "VideoManage",
        data(){
            return{
                pageNum:1,
                pageSize:6,
                total:0,
                videoCoverVisiable:false,//修改视频封面属性
                videoFormVisiable:false,//编辑属性,
                videoChildVisiable:false,//视频选集
                show:false,
                videoList: [],
                video:{

                },
                videoChildForm:{
                    id: '',
                    videoAnthology: '',
                    videoId: '',
                    videoPath:''
                },
                videoChildFileList:[],
                videoChildRules:{
                    videoPath:[
                        {required:true, message: '视频选集不能为空', trigger: 'blur'}
                    ]
                },
                videoForm:{
                    videoCover:'',
                    id:'',
                    videoTitle:'',
                    videoKind:'',
                    videoTypes:'',
                    director:'',
                    stars:'',
                    publishTime:'',
                    videoContent:'',
                    videoStatus:''
                },
                queryForm:{
                    videoKind:'',
                    videoTitle:''
                },
                 options: [{
                     value: 1,
                     label: '电影'
                 }, {
                     value: 2,
                     label: '电视剧'
                 }, {
                     value: 3,
                     label: '综艺'
                 }, {
                     value: 4,
                     label: '动漫'
                 }],
                videoRules:{
                    videoTitle: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    videoKind: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    videoTypes: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    director: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    stars: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    publishTime: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    videoContent: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    videoStatus: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        methods:{
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.getAllVideoList()
            },
            handleCurrentChange(pageNum){
                this.pageNum = pageNum
                this.getAllVideoList()
            },
            updateVideoChildForm(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        this.$http.put('/rst-video/video/updateVideoChild',this.videoChildForm).then(res=>{
                            if(res.data.code === 200){
                                this.$message.success('选集修改成功')
                                this.videoChildVisiable = false
                                this.getAllVideoList()
                            }
                        })
                    }else {
                        this.$message.error('表单数据错误')
                    }
                })
            },
            showXuanJi(videoChild){
                this.videoChildFileList = []
                this.videoChildForm = {...videoChild}
                this.videoChildVisiable = true
            },
            videoChildExceed(){
                this.$message.warning('当前选集只能更改一个')
            },
            videoChildSuccess(response,file,fileList){
                this.videoChildForm.videoPath = response.data
            },
            updateVideoForm(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        this.$http.put('/rst-video/video/updateVideo',this.videoForm).then(res=>{
                            if(res.data.code === 200){
                                this.$message.success('修改成功')
                                this.videoFormVisiable = false
                                this.getAllVideoList()
                            }
                        })
                    }else {
                        this.$message.error('表单数据异常')
                    }
                })
            },
            showVideoEdit(video){
                video.videoKind = video.videoKind + ''
                video.videoStatus = video.videoStatus + ''
                this.videoForm = {...video}
                this.videoFormVisiable = true
            },
            updateVideoCover() {
                let params =  new URLSearchParams()
                params.append('videoCover',this.videoForm.videoCover)
                params.append('videoId',this.videoForm.videoId)
                this.$http.post('/rst-video/video/updateVideoCover',params).then(res => {
                    if(res.data.code === 200){
                        this.videoCoverVisiable =false
                        this.$message.success('视频封面修改成功')
                        this.getAllVideoList()
                    }
                })
            },
            showVideoCoverVisiable(videoCover,videoId){
                this.videoCoverVisiable = true
                this.videoForm.videoCover = videoCover
                this.videoForm.videoId = videoId
            },
            success(response,file,fileList){
                this.videoForm.videoCover = response.data
            },
            getAllVideoList(pageNum){
                if(pageNum) this.pageNum =pageNum
                this.$http.get('/rst-video/video/getAllVideos',{params:{
                        //role:JSON.parse(sessionStorage.getItem('user')).role,
                        role:1,
                        videoKind:this.queryForm.videoKind,
                        videoTitle:this.queryForm.videoTitle,
                        pageNum:this.pageNum,
                        pageSize:this.pageSize

                    }}).then(res=>{
                    this.videoList = res.data.data.rows
                    this.pageNum = res.data.data.pageNum
                    this.total = res.data.data.total
                    this.show = true
                })
            }
        },
        created() {
            this.getAllVideoList()
        }
    }
</script>

<style scoped>
    .picAndChange{
        display: flex;
        flex-direction: column;
        align-items: center;

    }
    .etoak-enter-active,.etoak-leave-active{
        transition: all 1.5s;
    }
    .etoak-enter,.etoak-leave-to{
        opacity:0;
        transform: translateX(30px);
    }
</style>