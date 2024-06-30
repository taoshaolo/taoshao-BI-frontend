import React, {useEffect, useRef, useState} from 'react';
import {deleteChartUsingPost, listMyChartByPageUsingPost} from "@/services/taobi/chartController";
import {Avatar, Button, Card, Col, Divider, List, message, Popconfirm, Result, Tooltip} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";
import {QuestionCircleOutlined, SyncOutlined} from "@ant-design/icons";
import {PageContainer} from "@ant-design/pro-components";


/**
 * 我的图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {

  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  }

  const enum Status {
    WAIT = 0,
    RUNNING = 1,
    SUCCEED = 2,
    FAILED = 3,
  }


  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const {initialState, setInitialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  // 添加一个用于存储定时器的引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach(data => {
            if (data.status === Status.SUCCEED) {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('获取图表失败')
      }
    } catch (e: any) {
      message.error('获取图表失败，' + e.message)
    }
    setLoading(false);
  }

  // 刷新按钮的点击事件处理器
  const handleRefresh = () => {
    setIsSpinning(true); // 开始旋转
    // 假设刷新操作需要1秒时间
    setTimeout(() => {
      setIsSpinning(false); // 停止旋转
    }, 500);
    loadData();
  }

  // 定时自动刷新的逻辑
  useEffect(() => {
    // 设置定时器，例如每5秒刷新一次
    const timerId = setInterval(loadData, 5000);
    timerRef.current = timerId;
    return () => {
      clearInterval(timerRef.current!);
      timerRef.current = null;
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [searchParams])

  /**
   * 点击删除按钮的回调函数
   * @param record
   */
  const handleRemove = async (record: API.DeleteRequest) => {
    try {
      const res = await deleteChartUsingPost({
        id: record.id,
      });
      if (res.code === 0) {
        message.success('删除成功');
        loadData();
      } else {
        message.error('删除失败');
      }
    } catch (e: any) {
      message.error('删除失败，' + e.message)
    }
  }

  return (
    <PageContainer className="my-chart-page">
      <div>
        <Search placeholder="请输入图表名称" loading={loading} enterButton onSearch={(value) => {
          //设置搜索条件
          setSearchParams({
            //初始化
            ...initSearchParams,
            name: value,
          })
        }}/>
      </div>
      <div className="margin-16"/>
      <Tooltip title="刷新">
        <Button
          onClick={handleRefresh}
          ghost
          type="text"
          shape="circle"
        >
          <SyncOutlined spin={isSpinning}/>
        </Button>
      </Tooltip>

      <div className="margin-16"/>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize: pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item
            key={item.id}
          >
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar}/>}
                title={item.name}
                description={item.chartType ? ('图表类型：' + item.chartType) : undefined}
              />
              <>
                {
                  item.status === Status.WAIT && <>
                    <Result
                      status="warning"
                      title="图表待生成"
                      subTitle={item.execMessage ?? '当前图表生成繁忙，请耐心等待'}
                    />
                  </>
                }
                {
                  item.status === Status.RUNNING && <>
                    <Result
                      status="info"
                      title="图表生成中"
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === Status.SUCCEED && <>
                    <div className="margin-16"/>
                    <p>{'分析目标：' + item.goal}</p>
                    <div className="margin-16"/>
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)}/>
                    <Divider style={{color: 'blue'}}>分析结论</Divider>
                    <p>{item.genResult}</p>
                  </>
                }
                {
                  item.status === Status.FAILED && <>
                    <Result
                      status="error"
                      title="图表生成失败"
                      subTitle={item.execMessage}
                    />
                  </>
                }
              </>
              <Col push={19}>
                <Popconfirm
                  title="提示"
                  description="确认删除该数据吗？"
                  icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                  onConfirm={() => {
                    handleRemove({id: item.id});
                  }}
                >
                  <Button danger>删除</Button>
                </Popconfirm>
              </Col>
            </Card>

          </List.Item>
        )}
      />
    </PageContainer>
  );
};
export default MyChartPage;
