import React, {useState} from 'react';
import {Button, Card, Form, Input, message, Select, Space, Upload} from "antd";
import {genChartByAiAsyncMqUsingPost} from "@/services/taobi/chartController";
import {useForm} from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import {PageContainer} from "@ant-design/pro-components";

/**
 * 添加图表页面（异步）
 * @constructor
 */
const AddChartAsyncPage: React.FC = () => {

  const [form] = useForm();
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
    // 调用后端接口
    const params = {
      ...values,
      file: undefined
    }
    try {
      const res = await genChartByAiAsyncMqUsingPost(params, {}, values.file.file.originFileObj)
      // console.log(res)
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        //重置表单字段到它们的初始状态
        form.resetFields();
      }
    } catch (e:any) {
      message.error('分析失败,' + e.message);
    }
    setSubmitting(false);
  };


  return (
    <PageContainer className="add-chart-async-page">
      <Card title="智能分析">
        <Form
          form={form}
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
    </PageContainer>
  );
};
export default AddChartAsyncPage;
