import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();
function EditPlaylist() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [descriere, setdescriere] = useState('');
  const [data,setData] = useState('');
  const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  
  useEffect(() => {
    const href = window.location.href;
    const fetchMovie = async () => {
      const res = await fetch(`${SERVER}/playlists/${id}`);
      const data = await res.json();
      setdescriere(data.descriere);
      let deParsat = new Date(data.data);
      setData(deParsat);
      // let month = deParsat.getMonth().toString().length == 1 ? `0${deParsat.getMonth()+1}` : deParsat.getMonth()+1;
      // let day = deParsat.getDate().toString().length == 1 ? `0${deParsat.getDate()}` : deParsat.getDate();
      // let parsed = `${deParsat.getFullYear()}-${month}-${day}`      
    };
    fetchMovie();
  }, []);

  const handleSubmit = () => {
    const id = window.location.href.split('/').at(-1);
    fetch(`${SERVER}/playlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descriere: descriere,
        data:data
      }),
    })
      .then((res) => res.json())
      .then((data) => { 
        toast.success(`Playlist ${descriere} modificat cu succes!`)
      }).catch((e) => toast.error(`Modificare playlist ${descriere} esuata!`));
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
             Editeaza playlistul
            </Typography>
            <Box
              component="form"
              noValidate
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
                value={descriere}
                onChange={(e) => setdescriere(e.target.value)}
              />
              {/* <TextField
                margin="normal"
                required
                fullWidth
                onChange={(e) => setData(e.target.value)}
                id="date"
                label="data"
                type="date"
                value={data}
                defaultValue="2022-01-01"
                autoComplete="data"
              /> */}
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
              <Button
                fullWidth
                type="button"
                variant="contained" color="success"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Salveaza
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

export default EditPlaylist;