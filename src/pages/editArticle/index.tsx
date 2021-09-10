import React, { useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import { history } from 'umi';
import { httpUrl } from '@/tool/config';
import Http from '@/tool/http';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'material-react-toastify';
import { Select } from 'antd';
const { Option } = Select;
import ReactWEditor from 'wangeditor-for-react';
import SubmitButton from '@/components/SubmitButton';
import './index.scss';

const HomePage: React.FC = (props) => {
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [type, setType] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [subRelLoading, setSubRelLoading] = useState(false);
  const [subDraLoading, setSubDraLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImgUrl, setShowImgUrl] = useState("");
  const [types, setTypes] = useState<Array<any>>([]);

  useEffect(() => {
    getArticalType();
    getArticleDetail();
  },[]);

  const getArticleDetail = () => {
    let id = history.location.query?.id;
    let params = {
      id: id
    };
    Http.post('/article/articleDetail', params).then((res: any) => {
      if (res.status === 200) {
        let { title, content, type, cover } = res.data;
        setTitle(title);
        setHtml(content);
        setType(type);
        setImageUrl(cover || "");
        setShowImgUrl(cover || "");
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const handleChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  //获取文章类型
  const getArticalType = () => {
    Http.post('/article/articleType').then((res: any) => {
      if (res.status === 200) {
        setTypes(res.data);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const beforeUpload = (file: any) => {
    console.log("文件：", file);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info: any) => {
    console.log('1231231231', info)
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      let path = info.file.response.data.articaleCover;
      setUploadLoading(true);
      setImageUrl(path);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) =>{
        setShowImgUrl(imageUrl);
      });
    }
  };

  const handleChangeType = (e: string) => {
    setType(e);
  }

  const getBase64 = (img:any, callback:any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleSubmitRelease = () => {
    if(!title){
      return toast.warning("请输入文章标题！", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    if(!html){
      return toast.warning("请输入文章内容！", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    if(!type){
      return toast.warning("请选择要发布的板块！", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    let id = history.location.query?.id;
    let params = {
      id:id,
      title,
      content: html,
      type,
      cover:imageUrl,
    };
    setSubRelLoading(true);
    Http.post('/article/editArticle', params).then((res: any) => {
      setTimeout(() => {
        if (res.status === 200) {
          toast.success("修改成功！", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setTimeout(() => {
            history.push('/layout/userCenter');
          }, 1000);
        }else{
          toast.error(res.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
        setSubRelLoading(false);
      }, 2000);
    });
  }

  //文章上传内容图片
  const handleUploadImages = (resultFiles:any, insertImgFn:any) => {
    console.log(resultFiles, insertImgFn); 
    let param = new FormData();
    param.append('articaleCover', resultFiles[0]);
    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    }
    Http.post('/article/uploadImg', param, config).then((res: any) => {
      if (res.status === 200) {
        let imgUrl = res.data.articaleCover;
        insertImgFn(imgUrl);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="page-add-article">
      <div className="content-warp">
        <div className="title-content">
          <div className="title-box">
            <input className="title" type="text" value={title} placeholder="请输入标题" onChange={handleChangeTitle} />
          </div>
          <ReactWEditor
            className="wangeditor"
            config={{
              showLinkImg: false,
              uploadImgMaxLength: 1,
              customUploadImg: handleUploadImages
            }}
            value={html}
            onChange={(html: string) => {
              setHtml(html);
            }}
          />
        </div>
        <div className="other-info">
          <h3>文章发布在</h3>
          <Select value={type} onChange={handleChangeType} placeholder="请选择板块">
            {types.map((item,index)=>{
              return (
                <Option value={item.type} key={index}>{item.lable}</Option>
              )
            })}
          </Select>
          <div className="form-item">
            <h3>封面图<span className="select-tip">(非必选)</span></h3>
            <Upload
              name="articaleCover"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={`${httpUrl}/article/uploadImg`}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {showImgUrl ? <div className="upload-img-box" style={{backgroundImage:`url(${showImgUrl})`}}></div> : uploadButton}
            </Upload>
          </div>
          <div className="btn-box">
            <SubmitButton title="保存为草稿" variant="outlined" loading={subDraLoading} onClick={handleSubmitRelease} style={{width: "140px",}} />
            <SubmitButton title="发布" loading={subRelLoading} onClick={handleSubmitRelease} style={{width: "100px",}} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
