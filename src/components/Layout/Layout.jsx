import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import { Suspense } from "react";
import {Avatar, Button, message, Modal, Tooltip} from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useUser } from "../../redux/useUser";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import {UpdateProfileModal} from "../UpdateProfileModal/UpdateProfileModal";

export const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useUser();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleLogout = () => {
        Modal.confirm({
            title: 'Confirm Logout',
            content: 'Are you sure you want to log out?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await dispatch(logoutUser());
                message.success('Logged out successfully');
                navigate('/signin');
            },
        });
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={`${styles.container} ${styles.box_header}`}>
                <h1>Chat Service</h1>
                <div className={styles.block}>
                    <nav>
                        <ul className={styles.navList}>

                            {user ? (
                                <li>
                                    <NavLink
                                        to="/"
                                        className={({isActive}) =>
                                            isActive ? `${styles.link} ${styles.active}` : styles.link
                                        }
                                    >
                                        Chat Room
                                    </NavLink>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <NavLink
                                            to="/signup"
                                            className={({isActive}) =>
                                                isActive ? `${styles.link} ${styles.active}` : styles.link
                                            }
                                        >
                                            Sign Up
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/signin"
                                            className={({isActive}) =>
                                                isActive ? `${styles.link} ${styles.active}` : styles.link
                                            }
                                        >
                                            Login
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                    {user && (
                        <div className={styles.navList}>
                            <Tooltip className={styles.tooltip} title="Update Profile" placement="bottom"
                                     onClick={showModal}>
                                <p>{user?.username}</p>
                                <Avatar style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>
                            </Tooltip>
                            <Button className={styles.link} onClick={handleLogout}>
                                Logout
                            </Button>

                        </div>
                    )}
                </div>
                </div>
            </header>
            <main className={styles.container}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet/>
                </Suspense>
            </main>
            <footer className={styles.footer}>
                <div className={`${styles.container} ${styles.box_footer}` }>
                    <p>Chat Service</p>
                    <p>
                        Created by <a href="https://www.linkedin.com/in/andrii-uvarov/" target="_blank"
                                      rel="noopener noreferrer">Andrey Uvarov</a> &reg;
                    </p>
                    </div>
            </footer>
            {isModalVisible &&
                <UpdateProfileModal
                    visible={isModalVisible}
                    onClose={handleCloseModal}
                    currentUsername={user?.username}
                />}
        </>
    );
};

