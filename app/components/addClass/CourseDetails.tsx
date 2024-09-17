import React from 'react';
import { Grid, TextField } from '@mui/material';
import { CourseData } from './types'; // types.tsファイルを作成し、CourseData型を定義

interface CourseDetailsProps {
  data: CourseData | null;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ data }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="授業科目名"
        variant="outlined"
        value={data?.cN || ''}
        disabled
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="担当教員"
        variant="outlined"
        value={data?.ins || ''}
        disabled
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="科目開講学部・学科"
        variant="outlined"
        value={data?.dpt || ''}
        disabled
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="対象学年"
        variant="outlined"
        value={data?.tYr || ''}
        disabled
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="シラバスURL"
        variant="outlined"
        value={data?.sUrl || ''}
        disabled
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="開講学期・曜日・時間割・教室"
        variant="outlined"
        value={data?.sched || ''}
        disabled
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="授業の形態"
        variant="outlined"
        value={data?.fmt || ''}
        disabled
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="単位"
        variant="outlined"
        value={data?.crd || ''}
        disabled
      />
    </Grid>
    {data?.note && (
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="備考"
          variant="outlined"
          value={data.note || ''}
          disabled
        />
      </Grid>
    )}
   
  </Grid>
);

export default CourseDetails;
