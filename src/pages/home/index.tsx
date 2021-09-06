import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from 'antd';
import { history } from 'umi';
import './index.scss';
import Http from '@/tool/http';
import { ToastContainer, toast } from 'material-react-toastify';
import ArticaleCard from '../../components/ArticaleCard';
import empty_bg from '@/images/empty-bg.png';

const HomePage: React.FC = (props) => {
  const [menuFixed, setMenuFixed] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState<Array<any>>([]);
  const dataListRef = useRef<Array<any>>();
  const [hasMore, setHasMore] = useState(true);
  let _page = 1;
  let _total = 0;
  const pageSize = 3;

  useEffect(()=>{
    dataListRef.current = dataList;
  }, [dataList]); // 依赖的值dataList 改变了 才出发里面的值

  useEffect(() => {
    getArticalType();
    window.addEventListener('scroll', bindHandleScroll);
    return () => {
      window.removeEventListener('scroll', bindHandleScroll);
    }
  }, [])

  //获取文章类型
  const getArticalType = () => {
    Http.post('/article/articleType').then((res: any) => {
      if (res.status === 200) {
        setTypes(res.data);
        setSelectedType(res.data[0].type);
        getArticaleByType(res.data[0].type, 1);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  //获取文章
  const getArticaleByType = (type: string, page: number) => {
    let params = {
      type: type,
      sort: "createTime",
      page: page,
      pageSize
    };
    setLoading(true);
    Http.post('/article/queryArticleByType', params).then((res: any) => {
      if (res.status === 200) {
        let { data, total, page } = res.data;
        if(data.length > 0){
          let _dataList = dataListRef.current || [];
          let newDataList = _dataList.concat(data);
          setDataList(newDataList);
          _page = page;
          _total = total;
          if(total == newDataList.length){
            setHasMore(false);
          }
        }else{
          setHasMore(false);
        }
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
      setLoading(false);
    });
  }

  const bindHandleScroll = (e: any) => {
    let height = e.srcElement.documentElement.scrollTop;
    if(height >= 30){
      setMenuFixed(true);
    }else{
      setMenuFixed(false);
    }
  }

  const handleSelectedType = (type: string) => {
    setDataList([]);
    setHasMore(true);
    _page = 1;
    _total = 0;
    setSelectedType(type);
    getArticaleByType(type, 1);
    if(document.documentElement.scrollTop > 30){
      document.documentElement.scrollTop = 30;
    }
  }

  const handleLoadMore = () => {
    let params = {
      type: selectedType,
      sort: "createTime",
      page: _page+1,
      pageSize
    };
    console.log(params);
    getArticaleByType(selectedType, _page+1);
    setLoading(true);
  }

  return (
    <div className="page-home">
      <div className="home-content">
        <div className="main">
          <div className={menuFixed ? "categorys menuFixed" : "categorys"} id="home-category">
            <ul>
              {types.map((item,index)=>{
                return (
                  <li className={selectedType == item.type ? "menu-Selected":""} key={index} onClick={()=>handleSelectedType(item.type)}>{item.lable}</li>
                )
              })}
            </ul>
          </div>
          <div className={menuFixed ? "main-content main-content-top" : "main-content"}>
            {dataList.map((data,index)=>{
              return (
                <ArticaleCard key={index} data={data} />
              )
            })}
            <Skeleton loading={loading} active>
              {hasMore ?(
                <div className="load-more" onClick={handleLoadMore}>加载更多</div>
              ): dataList.length > 0 ? (
                <div className="no-more">没有更多了</div>
              ) : (
                <div className="artical-empty">
                  <img className="empty" src={empty_bg} alt="" />
                  <p>该板块还没有内容哦，快来发布吧！</p>
                </div>
              )}
            </Skeleton>
          </div>
        </div>
        <div className="left-content">
          <div className="hot-plate">
            <h3>热门板块</h3>
            <div className="hot-list">
              <div className="plate-item">
                <div className="plate-icon"></div>
                <div className="plate-left">
                  <p>任务大厅</p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
