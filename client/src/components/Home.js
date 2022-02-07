import React, { useEffect, useState } from 'react';
import TablePagination from '@mui/material/TablePagination';
import Card from '@mui/material/Card';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CardContent from '@mui/material/CardContent';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Checkbox, FormControlLabel , IconButton, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();
export default function Home() {
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    fetchPaginated(newPage, playlistPerPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setPlaylistsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
    fetchPaginated(0, parseInt(event.target.value, 10))
  };
  
  const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  const [childrenSongs, setChildrenSongs] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [playlistPerPage, setPlaylistsPerPage] = useState(1);
  const [noPages, setNoPages] = useState(10);
  const [currentPlaylists, setCurrentPlaylists] = useState([]);
  const [reversedOrder, setReversedOrder] = useState(false);
  const [filtru1, setFiltru1] = useState("");
  const [filtru2, setFiltru2] = useState("");
  const [col, setCol] = useState("");

  const fetchPaginated = async (newPage, limit,url) => {
    let how = '';
    let colSort = (col && col != "") ? `&sort=${col}` : '';
    if (colSort != '') how = reversedOrder ? '&how=DESC' : '&how=ASC';
    let f1 = filtru1 ? `&descriere=${filtru1}` : '';
    let f2 = filtru2 ? `&data=${filtru2}` : '';
    let p = (filtru1 || filtru2) ? 0 : newPage;
    setCurrentPage(p); 
    let route = url != null ? url :`${SERVER}/playlists/?page=${p}${colSort}${how}${f1}${f2}&pageSize=${limit}`;
    localStorage.setItem('currentPage',currentPage);
    console.log(currentPage)
    localStorage.setItem('playlistPerPage',playlistPerPage);
    localStorage.setItem('url',route);
    const res = await fetch(route);
    const data = await res.json();
    if (data.count == 0) toast.error(`Filtrare incorecta!`);
    else {
      setCurrentPlaylists(data.rows);
      setNoPages(data.count)
    }
  };
  const fetchSongs = async (id) => {
    const res = await fetch(`${SERVER}/songs/playlists/${id}`);
    const data = await res.json();
    if (data.length > 0) setChildrenSongs(data);
    else { toast.error(`Playlist-ul nu are melodii!`); setChildrenSongs([]) }
  };

  useEffect(() => {
    let url = localStorage.getItem('url') ?localStorage.getItem('url') : null ;
    let cp = localStorage.getItem('currentPage');
    console.log(cp)
    if(cp) setCurrentPage(cp);
    let ppp = localStorage.getItem('playlistPerPage');
    if(ppp) setPlaylistsPerPage(ppp); 
    if(url) setPlaylistsPerPage(parseInt(url.charAt(url.length - 1)))
    fetchPaginated(currentPage, playlistPerPage,url);
  }, []);

  const deletePlaylist = (key) => {
    fetch(`${SERVER}/playlists/${key}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        fetchPaginated(currentPage, playlistPerPage);
      });
  }
  const deleteCopil = (idCopil, idParinte) => {
    fetch(`${SERVER}/songs/${idCopil}/playlists/${idParinte}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        fetchSongs(idParinte);
      });
  }

  const exportToCSV = async () => {
    const res = await fetch(`${SERVER}/playlists/export`);
    const playlists = await res.json();
    for (let d of playlists) {
      if (d.Songs.length > 0) {
        let string = '';
        for (let song of d.Songs) {
          string += `${song.titlu},${song.stil},${song.url},`;
        }
        d.Songs = string;
      }
    }
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(playlists);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, 'playlists' + fileExtension);
  }
  const importExcel = (e) => {
    try{
    const file = e.target.files[0];
    import('xlsx').then(xlsx => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = xlsx.read(e.target.result, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
        const cols = data[0];
        data.shift();
        let _importedData = data.map(d => {
          return cols.reduce((obj, c, i) => {
            obj[c] = d[i];
            return obj;
          }, {});
        });
        for(let item of _importedData){
          if(item.Songs){
            let array = item.Songs.split(',');
            console.log(array)
            let children = [];
            for(let i=0;i<array.length-1;i+=3){
              children.push({
                titlu: array[i], stil:array[i+1],url:array[i+2]
              })
            }
            item.Songs=children;
          }
        }        
        console.log(JSON.stringify(
          _importedData
        ))
        fetch(`${SERVER}/playlists/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:
            JSON.stringify(
              _importedData
            ),
        })
          .then((data) => {
            toast.success(`Import reusit!`)
            fetchPaginated(currentPage, playlistPerPage)
          })
          .catch((e) => toast.error(`Import nereusit! ${e}`));
      };
      reader.readAsArrayBuffer(file);
    });}catch{
    }
  }
  const exportPdf = async () => {
    const cols = [
      { camp: 'descriere', atribut: 'descriere' },
      { camp: 'data', atribut: 'data' },
      { camp: 'Songs', atribut: 'melodii' }
    ];
    const exportColumns = cols.map(col => ({ title: col.atribut, dataKey: col.camp }));
    const res = await fetch(`${SERVER}/playlists/export`);
    const data = await res.json();
    for (let d of data) {
      if (d.Songs.length > 0) {
        let string = '';
        for (let s of d.Songs) {
          string += `${s.titlu} - ${s.stil} - ${s.url}; `;
        }
        d.Songs = string;
      }
    }
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, data);
        doc.save('playlists.pdf');
      })
    })
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main id='main'>
        <Box
          sx={{ bgcolor: 'background.paper', pt: 4, pb: 6, }}>
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {`Playlist-urile tale`}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              <IconButton color="secondary" onClick={() => navigate('/add')}>
                <AddIcon />Adauga playlist
              </IconButton> &nbsp;&nbsp;
              <IconButton color="secondary" onClick={exportToCSV}>
                <SystemUpdateAltIcon />&nbsp;Exporta xlsx
              </IconButton>
              <IconButton color="secondary" onClick={exportPdf}>
                <PictureAsPdfIcon />&nbsp;Exporta pdf
              </IconButton>
              <label htmlFor="upload-photo">
                <input
                  style={{ display: 'none' }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                  accept='.xlsx'
                  onChange={importExcel}
                />
                <Button color="secondary" variant="contained" component="span">
                <AddIcon />Importa date
                </Button>
              </label>
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="md" >
          <TextField sx={{ py: 0, mt: -2 }}
            label=" descriere" variant="standard" id='descriere'
            onChange={(e) => setFiltru1(e.target.value)} />
          <IconButton color="secondary" onClick={() => fetchPaginated(currentPage, playlistPerPage)}>
            <SearchIcon />
          </IconButton>
          <TextField sx={{ ml: 2, mt: -2 }}
            label=" data" variant="standard" id='data'
            onChange={(e) => setFiltru2(e.target.value)} />
          <IconButton color="secondary" onClick={() => fetchPaginated(currentPage, playlistPerPage)}>
            <SearchIcon />
          </IconButton>
          <Button onClick={() => { setCol('descriere'); fetchPaginated(currentPage, playlistPerPage); }} variant='outlined'>Sorteaza descriere</Button>
          <FormControlLabel  sx={{ ml: 1 }}
            control={
              <Checkbox
                onChange={() => { setReversedOrder(!reversedOrder); }}
              />
            }
            label="Desc"
          />
          <TablePagination
            component="div"
            count={noPages}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={playlistPerPage}
            rowsPerPageOptions={[1, 2, 4, 6]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Container>
        <Container sx={{ py: 0, mb: 5 }} maxWidth="md">
          <Grid container spacing={4}>
            {currentPlaylists.map((item, i) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  style={{ cursor: 'pointer' }}>
                  <IconButton color="secondary">
                    <EditIcon onClick={() => navigate(`/edit/${item.id}`)} /> &nbsp;&nbsp;
                    <DeleteForeverIcon onClick={() => { deletePlaylist(item.id) }} /> &nbsp;&nbsp;&nbsp;
                    <PreviewIcon onClick={() => { fetchSongs(item.id) }} />
                  </IconButton>
                  <CardMedia
                    component="img"
                    image="./play.jpg"
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="p"
                      component="h5"
                      style={{ textAlign: 'center' }}
                    >
                      {item.id}. {item.descriere} - {new Date(item.data).getDate()}.{new Date(item.data).getMonth() + 1}.{new Date(item.data).getFullYear()}
                    </Typography>
                    <Button size="small" fullWidth onClick={() => { navigate(`/add/${item.id}/copil`) }} variant="outlined">adauga melodie</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Container sx={{ py: 0, mt: 5, mb: 5 }} maxWidth="md">
          {childrenSongs[0] && (<Typography
            component="h3"
            variant="h4"
            align="left"
            color="blue"
            gutterBottom
            sx={{ paddingTop: 5, paddingBottom: 0 }}
          >
            {`Melodiile playlistului ${childrenSongs[0].PlaylistId}`}
          </Typography>)}
          <Grid container spacing={4} sx={{ py: 0, mt: 1, mb: 5 }} >
            {childrenSongs && childrenSongs.map((childItem, i) => (
              <Grid item key={childItem.id} xs={10} sm={4} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  style={{ cursor: 'pointer' }}
                > <IconButton color="secondary">
                    <EditIcon onClick={() => navigate(`/edit/${childItem.PlaylistId}/copil/${childItem.id}`)} /> &nbsp;&nbsp;
                    <DeleteForeverIcon onClick={() => { deleteCopil(childItem.id, childItem.PlaylistId) }} /> &nbsp;&nbsp;&nbsp;
                  </IconButton>
                  <CardMedia
                    component="img"
                    image="./song.png"
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      style={{ textAlign: 'center' }}
                    >
                      {childItem.titlu} - {childItem.stil} - {childItem.url}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
