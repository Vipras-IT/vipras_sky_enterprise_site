/* eslint-disable react/prop-types */
import { Modal } from 'antd';
import { Spinner } from 'react-bootstrap';

const Loading = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      maskClosable={false}
      closable={false}
      footer={null}
      width={80}
      centered={true}
    >
      <Spinner animation="border" variant="danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Modal>
  );
};

export default Loading;
