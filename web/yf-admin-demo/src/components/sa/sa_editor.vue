<template>
    <div>
        <!-- 图片上传组件辅助-->
        <el-upload
            class="avatar-uploader"
            action=""
            accept="image/jpg, image/jpeg, image/png, image/gif"
            :limit="20"
            :http-request="uploadImg"
            :before-upload="beforeUpload"
            :show-file-list="false">
            <i class="el-icon-plus avatar-uploader-icon" id="uploaderBtn"></i>
        </el-upload>
        <quill-editor
            class="info-editor"
            :value="txt"
            ref="QuillEditor"
            :options="editorOption"
            @change="contentChanged">
        </quill-editor>
    </div>
</template>
<script>
    import { quillEditor } from "vue-quill-editor";
    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";
    import bus from '../common/bus';

    // 工具栏配置
    const toolbarOptions = [
        ['bold', {'color': []}, {'align': []}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        [{'list': 'ordered'}, {'list': 'bullet'}],

        ['italic', {'background': []}, 'underline', 'strike'],
        [{'font': []}],

        ['blockquote', 'code-block'],
//        ['link', 'image', 'video']
        ['link', 'image']
    ];

    export default {
        props: {
            content: {
                type: String,
            },
            change: {
                type:Function
            }
        },
        components: {
            quillEditor
        },
        computed: {
            txt(){
                return this.content;
            }
        },
        data() {
            return {
                editorOption: {
                    placeholder: '请输入内容',
                    theme: 'snow', //主题风格
                    modules: {
                        toolbar: {
                            container: toolbarOptions, // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        document.querySelector('#uploaderBtn').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                }, // 富文本编辑器配置
            }
        },
        mounted(){

        },
        methods: {
            // 上传图片前
            beforeUpload(res, file) {
                const isImg = res.type === 'image/jpg' || res.type === 'image/png' || res.type === 'image/jpeg';
                const isLt1M = res.size / 1024 / 1024 < 1;
                if (!isImg) {
                    this.$message.error('支持JPG、PNG格式的图片，大小不得超过1M')
                }
                if (!isLt1M) {
                    this.$message.error('文件最大不得超过1M')
                }
                return isImg && isLt1M
            },
            // 上传图片失败
            uploadError(res, file) {
                this.$message.error('图片插入失败')
            },
            // 上传图片处理过程
            uploadImg(req){
                let formData = new FormData();
                formData.append("file", req.file);
                this.upload({
                    url:"coserve/upload",
                    data: formData
                }).then( res => {
                    let quill = this.$refs.QuillEditor.quill;
                    let length = quill.getSelection().index;
                    quill.insertEmbed(length, 'image', res.result.uri);
                    quill.setSelection(length+1)
                }, res => {
                    this.$message.error("图片上传失败");
                })
            },

            contentChanged(e) {
                if (this.change && (typeof this.change === "function")) {
                    let title = "";
                    let desc = "";
                    if (e.text && e.text.length > 0) {
                        let tLen = e.text.length;
                        for(let i = 0; i < tLen; i ++) {
                            if (i >= e.text.length) {
                                break;
                            }

                            if (e.text[0] === "\n") {
                                e.text = e.tex.substr(1, e.text.length - 1)
                            } else {
                                break;
                            }
                        }

                        let pos = e.text.indexOf("\n",0);
                        if (pos >= 0) {
                            title = e.text.substr(0,pos)
                        } else {
                            if (e.text.length > 128) {
                                title = e.text.substr(0,128)
                            }else {
                                title = e.text
                            }
                        }

                        pos += 1;
                        let descTxt = e.text.substr(pos + 1, e.text.length - pos);
                        let descPos = descTxt.indexOf("\n",0);
                        if (descPos >= pos) {
                            desc = descTxt.substr(pos,descPos);
                            if (desc.length > 255) {
                                desc = desc.substr(0,255)
                            }
                        }
                    }

                    this.change(title, e.html, desc)
                }
            }
        }
    }
</script>

<style scoped>
    .info-editor {
        background-color: white; height: 100%;
    }
    .ql-editor {
        height: calc(100% - 116px); min-height: calc(100% - 116px);
    }
    .ql-container.ql-snow {
        height: calc(100% - 116px); min-height: calc(100% - 116px);
    }
    .avatar-uploader{
        display: none;
    }
</style>