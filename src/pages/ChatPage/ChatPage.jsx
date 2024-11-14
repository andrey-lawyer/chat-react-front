import { useEffect, useRef, useState } from "react";
import { Button, Input, List, Space, Spin, message } from "antd";
import { useDispatch } from "react-redux";
import { useUser } from "../../redux/useUser";
import {currentUser, userDetails} from "../../redux/userSlice";
import { SendOutlined } from "@ant-design/icons";

export const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const socketRef = useRef(null);
    const dispatch = useDispatch();
    const { user, loading } = useUser();

    console.log(user);
    useEffect(() => {
        if (!user) {
        dispatch(currentUser())
        }
        // if (user && !user?.id) {
        //  dispatch(userDetails(user?.username))
        // };
    }, [ ]);

    useEffect(() => {
        if (!user) return;
        socketRef.current = new WebSocket('ws://localhost:8080/api/ws/chat');

        socketRef.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        socketRef.current.onmessage = (event) => {
            if (event.data.startsWith("Error:")) {return message.error(event.data) }

            const data = JSON.parse(event.data);

            if (data?.isDeleted) {
                // Обработка удаления сообщения
                setMessages((prevMessages) =>
                    prevMessages.filter(message => message.id !== data.id)
                );
            } else {
                // Обработка нового сообщения
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socketRef.current.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };

        return () => {
            socketRef.current.close();
        };
    }, [user]);

    const sendMessage = () => {
        if (content) {
            if (socketRef.current.readyState === WebSocket.OPEN) {
                const messageToSend = {
                    text: content
                };
                socketRef.current.send(JSON.stringify(messageToSend));
                setContent('');
            } else {
                console.log('WebSocket is not open. Current state:', socketRef.current.readyState);
            }
        }
    };

    const deleteMessage = (id) => {
        if (socketRef.current.readyState === WebSocket.OPEN) {
            const messageToDelete = {
                deleteId: id
            };
            socketRef.current.send(JSON.stringify(messageToDelete));
        }
    };

    return (
        loading ? (
            <Spin spinning={loading} />
        ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
                <List
                    header={<div>Chat Messages</div>}
                    bordered
                    dataSource={messages}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<Button onClick={() => deleteMessage(item.id)}>Delete</Button>]}
                        >
                            <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{item.username}:</span>{" "}
                            <span>{item.content}</span>
                            <span style={{ fontSize: '0.8em', color: 'gray', marginLeft: '8px' }}>
                                ({item.timestamp})
                            </span>
                        </List.Item>
                    )}
                />
                <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPressEnter={sendMessage}
                    placeholder="Type a message"
                />
                <Button type="primary" icon={<SendOutlined />} onClick={sendMessage}>
                    Send
                </Button>
            </Space>
        )
    );
};

