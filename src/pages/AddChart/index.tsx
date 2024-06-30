import React, {useState} from 'react';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import {genChartByAiUsingPost} from "@/services/taobi/chartController";
import ReactECharts from 'echarts-for-react';
import {PageContainer} from "@ant-design/pro-components";

/**
 * 添加图表页面
 * @constructor
 */
const AddChartPage: React.FC = () => {

  const [chart, setChart] = useState<API.BiResponse>()
  const [option, setOption] = useState<any>()
  const [submitting, setSubmitting] = useState<boolean>(false)

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // console.log('表单内容 ', values);
    if (submitting) {
      return;
    }
    setSubmitting(true)
    setChart(undefined)
    setOption(undefined)
    // 调用后端接口
    const params = {
      ...values,
      file: undefined
    }
    try {
      const res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj)
      // console.log(res)
      if (!res?.data) {
        message.error('图表生成失败,' + e.message);
      } else {
        message.success('图表生成成功');
        const chartOption = JSON.parse(res.data.genChart ?? '')
        if (!chartOption) {
          throw new Error('图表代码解析错误')
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e:any) {
      message.error('图表生成失败,' + e.message);
    }
    setSubmitting(false);
  };


  return (
    <PageContainer className="add-chart-page">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form
              name="addChart"
              labelAlign={"left"}
              labelCol={{span: 5}}
              wrapperCol={{span: 18}}
              onFinish={onFinish}
              initialValues={{}}
            >
              <Form.Item
                /* name 对应后端请求参数*/
                name="goal"
                label="分析目标"
                rules={[{required: true, message: '请输入分析目标!'}]}
              >
                <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况"/>
              </Form.Item>
              <Form.Item
                name="name"
                label="图表名称"
                rules={[{required: true, message: '请输入图表名称!'}]}
              >
                <Input placeholder="请输入图表名称"/>
              </Form.Item>
              <Form.Item
                name="chartType"
                label="图表类型"
              >
                <Select placeholder="请选择图表类型" allowClear>
                  <Option value="折线图">折线图</Option>
                  <Option value="柱状图">柱状图</Option>
                  <Option value="饼图">饼图</Option>
                  <Option value="雷达图">雷达图</Option>
                  <Option value="散点图">散点图</Option>
                  <Option value="堆叠图">堆叠图</Option>

                </Select>
              </Form.Item>

              <Form.Item
                name="file"
                label="原始数据"
              >
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传excel文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{span: 16, offset: 4}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="可视化图表">
            {
              option ? <ReactECharts option={option}/> : <div>请先在左侧进行提交</div>
            }
            <Spin spinning={submitting}/>
          </Card>

          <Divider/>

          <Card title="分析结论">
            {chart?.genResult ?? <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting}/>
          </Card>

        </Col>
      </Row>
    </PageContainer>
  );
};
export default AddChartPage;
