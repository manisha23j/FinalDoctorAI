import { Button, Col, Form, Input, Row, TimePicker } from 'antd'
import React from 'react'
import dayjs from 'dayjs'

function DoctorForm({onFinish, initialValues}) {
  return (
    <Form
    layout="vertical"
    onFinish={onFinish}
    initialValues={{
      ...initialValues,
      ...(initialValues && {
        timings: [
          dayjs(initialValues?.timings[0], "HH:mm"),
          dayjs(initialValues?.timings[1], "HH:mm"),
        ],
      }),
    }}
    >
            <h2 className='card-title mt-3'>Personal Information</h2>
            <Row gutter={20}>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="First Name" name="firstName" rules={[{required: true}]}>
                        <Input placeholder='First Name' />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Last Name" name="lastName" rules={[{required: true}]}>
                        <Input placeholder='Last Name' />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Phone No." name="phoneNumber" rules={[{required: true}]}>
                        <Input placeholder='Phone No.' />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item label="Website" name="website">
                        <Input placeholder='Website' />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Address" name="address" rules={[{required: true}]}>
                        <Input placeholder='Address' />
                    </Form.Item>
                </Col>
            </Row>
            <hr/>
            <h2 className='card-title mt-3'>Professional Information</h2>
            <Row gutter={20}>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Specialization" name="specialization" rules={[{required: true}]}>
                        <Input placeholder='Specialization' />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Experience" name="experience" rules={[{required: true}]}>
                        <Input placeholder='Experience (Yrs)' type='number' />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Fee per consultation" name="feePerConsultation" rules={[{required: true}]}>
                        <Input placeholder='Fee per consultation (Rs)' type='number' />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                    required
                    label="Timings"
                    name="timings"
                    rules={[{ required: true }]}
                >
                <TimePicker.RangePicker format="HH:mm"/>
                </Form.Item>
                </Col>
            </Row>
            <div className='d-flex justify-content-end'>
                <Button className='primary-button' htmlType='submit'>SUBMIT</Button>
            </div>
        </Form>
  )
}

export default DoctorForm