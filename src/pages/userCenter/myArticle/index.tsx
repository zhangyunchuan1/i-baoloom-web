import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import Http from '@/tool/http';
import { toast } from 'material-react-toastify';
import './index.scss';
import { Select, DatePicker, Dropdown, Menu } from 'antd';
const { Option } = Select;

const MyArticleComp: React.FC = (props) => {
  const [articleList, setArticleList] = useState<Array<any>>([]);
  const [articleTypes, setArticleTypes] = useState<Array<any>>([])
  const [type, setType] = useState("0");
  const [status, setStatus] = useState("0");
  const [year, setYear] = useState("0");
  const [mouth, setMouth] = useState("0");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>({});
  const pageSize = 10;
  const initArticleList = () => {
    let params = {
      type: type, 
      status: status, 
      year: year, 
      mouth: mouth, 
      sort: "createTime", 
      pageSize: pageSize, 
      page: 1
    };
    setLoading(true);
    Http.post('/article/queryMyArticleList', params).then((res: any) => {
      setLoading(false);
      if (res.status === 200) {
        setArticleList(res.data.data);
        setTotal(res.data.total);
        setPage(1);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  //获取文章类型
  const getArticalType = () => {
    Http.post('/article/articleType').then((res: any) => {
      if (res.status === 200) {
        setArticleTypes(res.data);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const handleUpdateArticleStatus = (id:string, status:string ) => {
    let params = {
      status,
      id
    };
    Http.post('/article/updateArticleStatus' ,params).then((res: any) => {
      if (res.status === 200) {
        toast.success("更新成功！", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        initArticleList();
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const changePageData = () => {
    console.log("分页：", page);
    let params = {
      type: type, 
      status: status, 
      year: year, 
      mouth: mouth, 
      sort: "createTime", 
      pageSize: pageSize, 
      page: page+1
    };
    setLoading(true);
    Http.post('/article/queryMyArticleList', params).then((res: any) => {
      setLoading(false);
      if (res.status === 200) {
        setArticleList(articleList.concat(res.data.data));
        setTotal(res.data.total);
        setPage(page +1);
        console.log("分页----：", page);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const handleChangeYear = (e: any, year: any) => {
    setYear(year);
  }

  const handleSelectArticle = (e: boolean, article: any) => {
    if(e){
      setSelectedArticle(article);
    }
  }

  const handleGoToEditArticle = () => {
    history.push({
      pathname: '/layout/editArticle',
      query: {
        id: selectedArticle.id
      }
    });
  }

  useEffect(() => {
    initArticleList();
    getArticalType();
  }, []);

  const renderMenu = (id: string, status: string) => {
    return (
      <Menu>
        <Menu.Item onClick={handleGoToEditArticle}>
          <span>编辑</span>
        </Menu.Item>
        {(status === "1" || status === "4") && (<Menu.Item onClick={()=>handleUpdateArticleStatus(id, "2")}><span>设为私密</span></Menu.Item>)}
        {(status === "2" || status === "4") && (<Menu.Item onClick={()=>handleUpdateArticleStatus(id, "1")}><span>设为公开</span></Menu.Item>)}
        {status != "4" && (<Menu.Item onClick={()=>handleUpdateArticleStatus(id, "4")}><span>删除</span></Menu.Item>)}
      </Menu>
    );
  }
  return (
    <div className="my-article-comp">
      <div className="search-head">
        <DatePicker placeholder="年" picker="year" style={{ width: "80px", marginRight: "20px" }} onChange={handleChangeYear} />
        <Select placeholder="月" style={{ width: "60px", marginRight: "20px" }} onChange={(mouth: any)=>{setMouth(mouth)}}>
          <Option value="0">全部</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
          <Option value="6">6</Option>
          <Option value="7">7</Option>
          <Option value="8">8</Option>
          <Option value="9">9</Option>
          <Option value="10">10</Option>
          <Option value="11">11</Option>
          <Option value="12">12</Option>
        </Select>
        <Select placeholder="分类" style={{ width: "90px", marginRight: "20px" }} onChange={(type: any)=>{setType(type)}}>
          <Option value="0" key={-1}>全部</Option>
          {articleTypes.map((item,index) => {
            return (
              <Option value={item.type} key={index}>{item.lable}</Option>
            )
          })}
        </Select>
        <Select placeholder="状态" style={{ width: "90px", marginRight: "20px" }} onChange={(status: any)=>{setStatus(status)}}>
          <Option value="0">全部</Option>
          <Option value="1">公开</Option>
          <Option value="2">私密</Option>
          <Option value="3">草稿</Option>
          <Option value="4">已删除</Option>
        </Select>
        <div className="search-btn" onClick={initArticleList}>查询</div>
      </div>
      <div className="article-list">
        {articleList.map((item:any, index:number) => {
          return (
            <div className="article-item" key={index}>
              <div className="title-time">
                <p className="title">
                  <span className={`tag ${item.status === '1' ? "opened" : item.status === '2' ? "private" : item.status === '3' ? "draft" : item.status === '4' ? "delete" : ""}`}>
                    {item.status === '1' ? "公开" : item.status === '2' ? "私密" : item.status === '3' ? "草稿" : item.status === '4' ? "已删除" : ""}
                  </span>
                  {item.title}
                </p>
                <span className="time">{item.createTime}</span>
              </div>
              <div className="num-option">
                <div className="num">
                  阅读 {item.views} · 评论 {item.comments}
                </div>
                <div className="option">
                  <span>查看数据</span>
                  <Dropdown overlay={renderMenu(item.id ,item.status)} placement="bottomRight" arrow onVisibleChange={(e)=>{handleSelectArticle(e, item)}}>
                    <span>操作</span>
                  </Dropdown>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {loading ? (<div className="bot-noMore">加载中...</div>) : (articleList.length < total ? (<div className="bot-load" onClick={changePageData}>点击加载更多</div>) : (<div className="bot-noMore">没有更多了</div>))}
      
    </div>
  )
}

export default MyArticleComp;