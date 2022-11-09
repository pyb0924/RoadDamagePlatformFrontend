import {Modal} from 'antd';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function showErrorModal(err: any, title: string): void {
  const content = err.data !== undefined ? err.data.message : '内部错误';
  Modal.error({
    title,
    content,
  });
}
