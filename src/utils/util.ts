import { message } from 'ant-design-vue';
import { DicData } from '@/api/interface'

export const downLoadFile = (data: BlobPart, filename: string) => {
  const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = href;
  link.download = filename;

  // fix Firefox
  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(link.href);
};

export const commonFunc = (func, data, extra = () => { }) => {
  func(data).then(res => {
    message.success(res.data.message);
    extra();
  });
};

export const dicData = (dicList: DicData[] = [], record: any) => {
  if (dicList.length === 0) {
    return record
  } else {
    return dicList.find(v => v.value === record)?.name
  }
};
