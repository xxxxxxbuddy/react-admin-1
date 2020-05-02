
import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { PwaInstaller } from '../widget';
import { connectAlita } from 'redux-alita';
import { RouteComponentProps } from 'react-router';
import { FormProps } from 'antd/lib/form';
import umbrella from 'umbrella-storage';
import { login } from '../../axios';

const FormItem = Form.Item;
type LoginProps = {
    setAlitaState: (param: any) => void;
    auth: any;
} & RouteComponentProps &
    FormProps;
class Login extends React.Component<LoginProps> {
    componentDidMount() {
        const { setAlitaState } = this.props;
        setAlitaState({ stateName: 'auth', data: null });
    }
    componentDidUpdate(prevProps: LoginProps) {
        // React 16.3+弃用componentWillReceiveProps
        const { auth: nextAuth = {}, history } = this.props;
        // const { history } = this.props;
        if (nextAuth.data && nextAuth.data.uid) {
            // 判断是否登陆
            umbrella.setLocalStorage('user', nextAuth.data);
            history.push('/');
        }
    }
    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.form!.validateFields((err, values) => {
            if (!err) {
                const { setAlitaState } = this.props;
                login({account: values.userName, password: values.password}).then(res => {
                    if (res.code == 1) {
                        let rule = '';
                        if (res.data == 0) {
                            rule = 'admin';
                        } else {
                            rule = 'tenant';
                        }
                        setAlitaState({ funcName: rule, stateName: 'auth' });
                        message.success('登录成功');
                        umbrella.setLocalStorage('user', values.userName);
                    } else {
                        message.error('登录失败');
                        console.error(res.errMsg);
                    }
                }, e => {
                    console.error(e);
                    message.error('登录失败');
                }).catch(e => {
                    console.error(e);
                    message.error('登录失败');
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form!;
        return (
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <span>共享停车位信息管理系统</span>
                        <PwaInstaller />
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                    placeholder="账号"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                    type="password"
                                    placeholder="密码"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>记住我</Checkbox>)}
                            <span className="login-form-forgot" style={{ float: 'right' }}>
                                忘记密码
                            </span>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                style={{ width: '100%' }}
                            >
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth'])(Form.create()(Login));
