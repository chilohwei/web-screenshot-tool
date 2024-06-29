import React, { useState, useCallback } from 'react';
import { Camera, Download, Globe, Smartphone, Monitor } from 'lucide-react';
import {
  Button,
  TextField,
  Alert,
  Typography,
  Container,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  InputAdornment,
  Snackbar,
  Dialog
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3D63DD',
    },
    secondary: {
      main: '#28A745',
    },
    background: {
      default: '#F8F9FA',
    },
    text: {
      primary: '#343A40',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
      color: '#343A40',
    },
    subtitle2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: '#3D63DD',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#2F51B1',
            },
          },
        },
      },
    },
  },
});

const ScreenshotApp = () => {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [device, setDevice] = useState('desktop');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cache, setCache] = useState({});

  const captureScreenshot = useCallback(async (selectedDevice = device) => {
    if (!url.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/)) {
      setError('请输入有效的URL');
      return;
    }

    const cacheKey = `${url}-${selectedDevice}`;
    if (cache[cacheKey]) {
      setImageUrl(cache[cacheKey]);
      return;
    }

    setIsLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, device: selectedDevice }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const blob = await response.blob();
      const newImageUrl = URL.createObjectURL(blob);
      setImageUrl(newImageUrl);
      setCache(prevCache => ({ ...prevCache, [cacheKey]: newImageUrl }));
      setSnackbarOpen(true); // 只在首次获取截图时显示成功提示
    } catch (err) {
      console.error('Error details:', err);
      setError(`获取截图时出错：${err.message || '请检查URL是否正确，并确保网络连接正常。'}`);
    } finally {
      setIsLoading(false);
    }
  }, [url, device, cache]);

  const downloadScreenshot = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `screenshot-${new Date().toISOString()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      captureScreenshot();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
        <Container maxWidth="lg" sx={{ width: '80%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ mb: 4 }}>
            智能网页截图工具
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <TextField
              fullWidth
              label="输入网址"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              InputProps={{
                startAdornment: <Globe size={20} color="#3D63DD" style={{ marginRight: 8 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => captureScreenshot('desktop')}
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Camera />}
                      size="large"
                    >
                      {isLoading ? '处理中' : '获取截图'}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            {imageUrl && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={downloadScreenshot}
                startIcon={<Download />}
                fullWidth
                size="large"
              >
                下载截图
              </Button>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}
            <Box
              sx={{
                width: device === 'mobile' ? 375 : '100%',
                height: device === 'mobile' ? 812 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #3D63DD',
                borderRadius: 2,
                position: 'relative',
                overflow: 'auto',
                backgroundColor: '#ffffff',
                mt: 2
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Captured screenshot"
                  title="点击可查看大图"
                  style={{ width: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'pointer' }}
                  onClick={() => setDialogOpen(true)}
                />
              ) : (
                <Typography variant="body1" color="textSecondary">
                  截图预览区域
                </Typography>
              )}
              {isLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <ToggleButtonGroup
                  value={device}
                  exclusive
                  onChange={(e, newDevice) => {
                    if (newDevice) {
                      setDevice(newDevice);
                      captureScreenshot(newDevice); // 重新获取截图
                    }
                  }}
                  aria-label="设备类型"
                >
                  <Tooltip title="桌面版">
                    <ToggleButton
                      value="desktop"
                      aria-label="桌面版"
                      sx={{
                        p: 0.4, 
                        minWidth: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // 半透明黑色背景
                        color: '#ffffff', // 白色文字
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', // 更深的半透明黑色
                        },
                        '& .label': {
                          display: 'none',
                          ml: 1,
                        },
                        '&:hover .label': {
                          display: 'block',
                        },
                      }}
                    >
                      <Monitor size={16} /> 
                      <Box className="label">桌面版</Box>
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="移动版">
                    <ToggleButton
                      value="mobile"
                      aria-label="移动版"
                      sx={{
                        p: 0.4, 
                        minWidth: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // 半透明黑色背景
                        color: '#ffffff', // 白色文字
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', // 更深的半透明黑色
                        },
                        '& .label': {
                          display: 'none',
                          ml: 1,
                        },
                        '&:hover .label': {
                          display: 'block',
                        },
                      }}
                    >
                      <Smartphone size={16} /> 
                      <Box className="label">移动版</Box>
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message="截图成功"
          />
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <img
              src={imageUrl}
              alt="Enlarged screenshot"
              style={{ width: '100%', height: 'auto' }}
            />
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ScreenshotApp;