import React, {useEffect, useState} from 'react';
import {getLoginUserUsingGet} from "@/services/taobi/userController";
import {useModel} from '@@/exports';
import {Card, Col, Divider, Row} from "antd";
import {CommentOutlined, FieldTimeOutlined, SmileOutlined, UserOutlined, VerifiedOutlined} from "@ant-design/icons";
import moment from "moment";
import {PageContainer} from "@ant-design/pro-components";


const Profile: React.FC = () => {

  const {initialState, setInitialState} = useModel('@@initialState');
  const [data, setData] = useState<API.UserVO>({});


  const getUserInfo = async (id: any) => {
    const res = await getLoginUserUsingGet({
      id: id
    });
    if (res.code === 0) {
      setInitialState((s: any) => ({
        ...s,
        currentUser: res.data
      }));
      setData(res.data)
    }
  }
  useEffect(() => {
    try {
      getUserInfo(initialState?.currentUser?.id);
    } catch (e: any) {
      console.log(e);
    }
  })

  return (
    <PageContainer>
      <Row gutter={24}>
        <Col span={16}>
          <Card title="个人信息" bordered={false}>
            <Row>
              <Col>
                <SmileOutlined /> 头像：
                <img src={data?.userAvatar} style={{textAlign: 'center',width: '50%', borderRadius: '50%'}}/>
              </Col>
            </Row>
            <Divider/>
            <Row>
              <Col>
                <UserOutlined/> 用户名称：{data?.userName}
              </Col>
            </Row>
            <Divider/>
            <Row>
              <Col>
                <CommentOutlined/> 用户账号：{data?.userAccount}
              </Col>
            </Row>
            <Divider/>
            <Row>
              <Col>
                <VerifiedOutlined/> 用户角色：{data?.userRole}
              </Col>
            </Row>
            <Divider/>
            <Row>
              <Col>
                <FieldTimeOutlined/> 注册时间：{moment(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Profile;
