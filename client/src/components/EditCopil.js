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
import 'react-toastify/dist/ReactToastify.css';
import { Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();
function EditCopil() {
  const navigate = useNavigate();
  const { id, idCopil } = useParams();
  const [titlu, settitlu] = useState('');
  const [stil, setstil] = useState('');
  const [url, seturl] = useState('');
  const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  const stiluri =  ['POP', 'ALTERNATIVE','ROCK','JAZZ','FOLK'];
  
  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`${SERVER}/songs/${idCopil}/playlists/${id}`);
      const data = await res.json();
      settitlu(data.titlu);
      setstil(data.stil);
      seturl(data.url)
    };
    fetchMovie();
  }, []);

  const handleSubmit = () => {
    const href = window.location.href;
    const idCopil = href.split('/').at(-1);
    const idParinte = href.split('/').at(-3);
    fetch(`${SERVER}/songs/${idCopil}/playlists/${idParinte}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titlu: titlu,
        stil: stil,
        url:url
      }),
    })
      .then((res) => res.json())
      .then((data)=>{
        if(data.error || !data.message)toast.error(`Actualizare melodie ${titlu} esuata!`)
        else toast.success(`Melodie ${titlu} actualizata cu succes!`)
      }).catch((e)=>toast.error(`Actualizare melodie ${titlu} esuata!`));
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
             Editeaza melodia
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
                id="titlu"
                label="titlu"
                name="titlu"
                autoComplete="titlu"
                value={titlu}
                onChange={(e) => settitlu(e.target.value)}
              />
               <TextField
                margin="normal"
                required
                fullWidth
                id="url"
                label="url"
                name="url"
                autoComplete="url"
                value={url}
                onChange={(e) => seturl(e.target.value)}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={stiluri}
                margin="normal"
                required
                fullWidth
                name="stil"
                value={stil}
                label="stil"
                renderInput={(params) => <TextField {...params} label="stil" />}
                inputValue={stil}
                onInputChange={(event, newInputValue) => {
                  setstil(newInputValue);
                }}
              />
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

export default EditCopil;