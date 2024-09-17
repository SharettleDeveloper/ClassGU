import React from 'react';
import { Alert, Grid } from '@mui/material';

interface AlertsProps {
  success: string | null;
  error: string | null;
}

const Alerts: React.FC<AlertsProps> = ({ success, error }) => (
  <>
    {success && (
      <Grid item xs={12}>
        <Alert severity="success" style={{ marginTop: '20px' }}>
          {success}
        </Alert>
      </Grid>
    )}
    {error && (
      <Grid item xs={12}>
        <Alert severity="error" style={{ marginTop: '20px' }}>
          {error}
        </Alert>
      </Grid>
    )}
  </>
);

export default Alerts;
