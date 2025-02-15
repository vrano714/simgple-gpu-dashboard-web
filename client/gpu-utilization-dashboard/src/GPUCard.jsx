import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import LinearWithValueLabel from './LinearProgress';

export default function GPUCard({host, info}) {
  let icon;
  if (info["util(compute)"].replace(" %", "") < 25) {
    icon = <DirectionsWalkIcon />;
  } else if (info["util(compute)"].replace(" %", "") < 50) {
    icon = <PedalBikeIcon />;
  } else if (info["util(compute)"].replace(" %", "") < 75) {
    icon = <DirectionsCarIcon />;
  } else {
    icon = <RocketLaunchIcon />;
  }

  const vram_ratio = info["VRAM(used)"].replace(" MiB", "")*100 / info["VRAM(total)"].replace(" MiB", "");

  const poll_time_millis = Date.parse(info.poll_time.split(".")[0]);
  // 5 mins = 5 x 60 x 1000 millis
  const is_old_data = Date.now() - poll_time_millis >= 1000 * 60 * 5 ? true: false;

  return (
    <Card key={host} sx={{ minWidth: 220, backgroundColor: info.bgColor }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {host} {icon}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
          {info.name}<br />
          {"(" + info["VRAM(total)"] + ")"}
        </Typography>
        <Typography variant="subtitle2" color="secondary">
          Util(compute): {info["util(compute)"]}
        </Typography>
        <LinearWithValueLabel progress={info["util(compute)"].replace(" %", "")} />
        <Typography variant="subtitle2" color="secondary">
          Util(VRAM): {info["util(vram)"]}
        </Typography>
        <LinearWithValueLabel progress={info["util(vram)"].replace(" %", "")} />
        <Typography variant="body2">
          <b>VRAM pressure</b><br />
          (used): {info["VRAM(used)"]}<br />
          (free): {info["VRAM(free)"]}
        </Typography>
        <LinearWithValueLabel progress={vram_ratio} />
        <Typography variant="body2" gutterBottom={true}>
        <b>{info.temp}&#8451;</b> (Fan: {info.fan_speed})
        </Typography>
        <Typography variant="body2" color={is_old_data?"error":"textPrimary"}>
          Poll time: {info.poll_time.split(".")[0]} { is_old_data?"(old)":"" }
        </Typography>
      </CardContent>
    </Card>
  );
}