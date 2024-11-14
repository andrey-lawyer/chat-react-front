import { useEffect } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/userSlice';

const { Title } = Typography;

export const UpdateProfileModal = ({ visible, onClose, currentUsername }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({ username: currentUsername || '', password: '' });
    }, [currentUsername, form]);

    const onFinish = async (values) => {
        const updateData = { newUsername: values.username, password: values.newPassword };
        await dispatch(updateUser(updateData));
        onClose();
        form.resetFields();
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                key={"form"}
                form={form}
                name="updateProfile"
                onFinish={onFinish}
                layout="vertical"
            >
                <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>Update Your Profile</Title>

                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="New Username" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="New Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Profile
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
