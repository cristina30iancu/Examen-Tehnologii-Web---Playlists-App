import { useState } from 'react';
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
function AdaugaCopil (){
  const navigate = useNavigate();
  const { id } = useParams();
  const [titlu, settitlu] = useState('');
  const [url, seturl] = useState('');
  const [stil, setstil] = useState('');
  const stiluri = ['POP', 'ALTERNATIVE','ROCK','JAZZ','FOLK'];
  const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${SERVER}/songs/playlists/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            titlu: titlu, 
            stil: stil,
            url:url
           }),
        })
          .then((res) => res.json())
          .then((data)=>{
            if(data.error || !data.message)toast.error(`Adaugare melodie ${titlu} esuata!`)
            else toast.success(`Melodie ${titlu} adaugata cu succes!`)
          }).catch((e)=>toast.error(`Adaugare melodie ${titlu} esuata!`));
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
            Adauga o melodie
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
                id="titlu"
                label="titlu"
                name="titlu"
                autoComplete="titlu"
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
                label="stil"
                renderInput={(params) => <TextField {...params} label="stil" />}
                onInputChange={(event, newInputValue) => {
                  setstil(newInputValue);
                }}
              />
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
              onClick = {
                  ()=>  navigate('/')
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

export default AdaugaCopil;