import React, { useState } from 'react';
import { TextField, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";


DateTimeRange.propTypes = {
    label: PropTypes.string.isRequired,
    startDateLabel: PropTypes.string,
    endDateLabel: PropTypes.string,
    init: PropTypes.object,
    setInit: PropTypes.func,
    end: PropTypes.object,
    setEnd: PropTypes.func,
    onValuesSet: PropTypes.func
}

DateTimeRange.defaultProps = {
    startDateLabel: "Start Date",
    endDateLabel: "End Date"
}

const useStyles = makeStyles({
    box: {
        border: "1px solid #DCE0E4",
        borderRadius: "10px",
        '&:hover': {
            borderColor: "#212B36",
        },
    },

});

export default function DateTimeRange({ useCb, label, startDateLabel = "Start Date", endDateLabel = "End Date", setInit, setEnd, init, end, isChecked }) {

    const classes = useStyles();

    const [checked, setChecked] = useState(isChecked)

    let mt = 2
    let ml = 1
    if (useCb) {
        mt = 0
        ml = 0
    }

    return (
        <Box p={1} mt={1} className={classes.box} >
            {useCb &&
                <Checkbox
                    checked={checked}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(event) => {
                        setChecked(event.target.checked)
                    }}
                />
            }
            <Typography ml={ml} color="#A9B4BE" gutterBottom variant="h10" align="center">
                {label}
            </Typography>
            <Grid container mt={mt} direction="column" >
                <Grid item mb={2} xs={6} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            renderInput={(props) => {
                                return (<TextField size="small" fullWidth
                                    {...props}
                                />)
                            }}
                            value={ init || new Date()}
                            disabled={useCb && !checked}
                            label={startDateLabel}
                            onChange={(date) => {
                                setInit(date)
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={6} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            renderInput={(props) => {
                                return (<TextField size="small" fullWidth
                                    {...props}
                                />)
                            }}
                            value={end || new Date()}
                            disabled={useCb && !checked}
                            label={endDateLabel}
                            onChange={(date) => {
                                setEnd(date)
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </Box>
    );
}