import React from "react";

import { Modal } from "antd";

import { useAppSelector } from "../../app/hooks";
import { UserModalType } from "../../app/types/user";

import UserForm from "./userForm";

export function UserModal() {
  const userModalState = useAppSelector((state) => state.userModal);

  return (
    <Modal
      title={
        userModalState.modalType === UserModalType.USER_ADD
          ? "添加用户"
          : "编辑用户"
      }
      open={userModalState.modalType !== UserModalType.DEFAULT}
      footer={[]}
      closable={false}
    >
      <UserForm />
    </Modal>
  );
}

export default UserModal;
