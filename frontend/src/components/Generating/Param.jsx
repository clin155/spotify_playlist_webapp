import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { useState } from 'react';

export function Param(props) {
    const [val, setVal] = useState((props.max-props.min)/2 || 0.5);
    const [checked, setChecked] = useState(false);

    const setSlider = (e, vall) => {
        setVal(vall);
        if (checked) {
            props.setParams(old => {
                const gork = {...old};
                gork[`${props.label}`] = val
                return gork
            })
        }
    }

    function setCheck(e) {
        setChecked(e.target.checked)
            props.setParams(old => {
                const gork = {...old};
                if (e.target.checked) {
                    gork[`${props.label}`] = val

                }
                else {
                    delete gork[`${props.label}`]
                }
                return gork
            })
    }

    return (    
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <FormControlLabel control={<Checkbox checked={checked} onChange={setCheck} />} label={props.label} />
        <Slider onChange={setSlider}
        value={val} aria-label="Default" valueLabelDisplay="auto"
        min={props.min ? props.min : 0}
        max={props.max ? props.max : 1}
        step={0.01}
        />
    </Stack>
    )
}