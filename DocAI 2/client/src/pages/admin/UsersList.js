import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout'
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from "axios"
import { Table } from 'antd';
import dayjs from 'dayjs';

function UsersList() {
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    const getUserData = async() =>{
        try {
            dispatch(showLoading());
            const response = await axios.get("/api/admin/get-all-users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            dispatch(hideLoading());

            if(response.data.success){
                setUsers(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
        }
    }

    useEffect(()=>{
        getUserData();
    },[]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            render: (record, text) => dayjs(record.createdAt).format("DD-MM-YYYY")
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text,record) =>(
                <div className='d-flex'>
                    <h1 className='anchor'>Block</h1>
                </div>
            )
        },
    ]
  return (
    <Layout>
        <h1 className='page-header'>
            Users List
        </h1>
        <Table columns={columns} dataSource={users} />
    </Layout>
  )
}

export default UsersList