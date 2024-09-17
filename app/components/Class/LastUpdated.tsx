import React from 'react';
import { Typography } from '@mui/material';

const LastUpdated: React.FC<{ timestamp: Date | undefined }> = ({ timestamp }) => {
  const formattedDate = timestamp
    ? `${timestamp.getFullYear()}年${timestamp.getMonth() + 1}月`
    : "不明";

  return (
    <div>

    <Typography variant="body2" color="textSecondary">
      この情報は<strong>{formattedDate}</strong>に更新されました。
    </Typography>
    <Typography variant="body2" color="textSecondary">
      さらなる更新が必要な場合は「授業を追加」から更新していただけると幸いです。
    </Typography>

    </div>
  );
};

export default LastUpdated;
