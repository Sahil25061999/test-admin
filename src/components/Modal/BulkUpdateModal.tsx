import React from "react";
import { Button, Modal } from "antd";

export default function BulkUpdateModal() {
  const [openResponsive, setOpenResponsive] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpenResponsive(true)}>
        Open Modal of responsive width
      </Button>
      <Modal
        title="Modal responsive width"
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </>
  );
}
