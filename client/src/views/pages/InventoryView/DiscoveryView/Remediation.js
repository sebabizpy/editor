import { merge } from 'lodash';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { fNumber } from '../../../../utils/formatNumber';
import { ApexChartsOption } from '../../../../components/Charts/Apexcharts';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 200;
const LEGEND_HEIGHT = 40;

const useStyles = makeStyles((theme) => ({
  root: {},
  chart: {
    height: CHART_HEIGHT,
    marginTop: theme.spacing(1),
    '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
      overflow: 'visible'
    },
    '& .apexcharts-legend': {
      height: LEGEND_HEIGHT,
      alignContent: 'center',
      position: 'relative !important',
      borderTop: `solid 1px ${theme.palette.divider}`,
      top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
    }
  }
}));

// ----------------------------------------------------------------------

Remediation.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired
};

function Remediation({ className, data, ...other }) {
  const classes = useStyles();
  const theme = useTheme();


  const chartData = [Number(data.OPEN), Number(data.WIP), Number(data.CLOSED),Number(data.RESOLVED)];
  const chartOptions = merge(ApexChartsOption(), {
    colors: [
      "#EE1D23",
      "#FEC10C",
      "#3366FF",
      "#59981B",
    ],
    labels: ['Open', 'WIP','Closed', 'Resolved'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: function (seriesName) {
            return '';
          }
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            value: {
              formatter: function (val) {
                return fNumber(val);
              }
            },
            total: {
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
                return fNumber(sum);
              }
            }
          }
        }
      }
    }
  });

  return (
    <Card className={clsx(classes.root, className)} {...other}>
      <CardHeader title="Remediation" />
      <div dir="ltr">
        <ReactApexChart
          type="donut"
          series={chartData}
          options={chartOptions}
          height={180}
          className={classes.chart}
        />
      </div>
    </Card>
  );
}

export default Remediation;
