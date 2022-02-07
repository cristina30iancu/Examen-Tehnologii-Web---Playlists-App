import { useState, useEffect, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();
function AddPlaylists() {
  const navigate = useNavigate();
  const today = new Date();
  const [descriere, setdescriere] = useState('');
  const [data, setData] = useState(today);
  const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

  const handleSubmit = (event) => {
    event.preventDefault();
    let atribut = data != 'no' ? data : '2022-07-02';
    fetch(`${SERVER}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descriere: descriere,
        data: atribut
      }),
    })
      .then((res) => {
        if (res.status != 201) toast.error(`Adaugare playlist ${descriere} esuata!`)
        else toast.success(`Playlist ${descriere} adaugat cu succes!`)
      })
      .catch((e) => toast.error(`Adaugare playlist ${descriere} esuata!`));
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={2.5}

        />
        <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LibraryMusicOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Adauga un Playlist
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="descriere"
                label="descriere"
                name="descriere"
                autoComplete="descriere"
                onChange={(e) => setdescriere(e.target.value)}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="data"
                  disablePast
                  value={data}
                  onChange={(newValue) => {
                    setData(newValue);
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
              {/* <TextField
                margin="normal"
                required
                fullWidth
                id="date"
                onChange={(e) => setData(e.target.value)}
                label="data"
                type="date"
                defaultValue="2022-01-01"
                autoComplete="date"
              /> */}
              <Button
                fullWidth
                type="submit"
                variant="contained" color="success"
                sx={{ mt: 3, mb: 2 }}
              >
                Adauga
              </Button>
              <Button
                fullWidth
                type='button'
                variant="outlined" color="error"
                sx={{ mt: 3, mb: 2 }}
                onClick={
                  () => navigate('/')
                }
              >
                Inapoi
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default AddPlaylists;