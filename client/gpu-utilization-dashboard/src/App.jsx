import * as React from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';

import GPUCard from './GPUCard';

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // include both floor and ceil
}

function generateRandomColor(saturation, lightness) {
  // generate random color using hsl
  // hue should be in 0 to 360
  // saturation and value should be in 0 to 100 (%)
  const hue = getRandomIntInclusive(0, 360);
  const c = "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
  return c;
}

export default function App() {
  const [dataToShow, setDataToShow] = React.useState({});
  React.useEffect(() => {
    let ignore = false;
    const bgColor = {};
    fetch('/data')
    // when runing on local machine, use the following line instead of the above line
    // fetch('http://127.0.0.1:9999/data')
      .then(response => response.json())
      .then(data => {
        if (!ignore){
          Object.keys(data).map((k, i) => {
            const hostname = k.split("#")[0];
            if (! (hostname in bgColor)) {
              const c = generateRandomColor(100, 95);
              bgColor[hostname] = c;
            }
            data[k]["bgColor"] = bgColor[hostname];
          });
          console.log(data)
          setDataToShow(data);
        }
      });
      return () => {
        ignore = true;
      };
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 2 }}>
          {Object.keys(dataToShow).map((k, i) => {
            return (
              <Grid size={{ xs: 12, md: 4, lg: 3, xl: 2 }} key={k}>
                <GPUCard host={k} info={dataToShow[k]}/>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Container>
  );
}
