import Scrollbars from '../../../../../components/Scrollbars';
import { getBugsList } from '../../../../../redux/slices/bugs';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SortingSelectingHead from './SortingSelectingHead';
import { camelCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  IconButton
} from '@material-ui/core';
import SearchNotFound from '../../../../../components/SearchNotFound';
import { LoadingButton } from '@material-ui/lab';
import { Icon } from '@iconify/react';
import codeFill from '@iconify-icons/eva/code-fill';
import link2Fill from '@iconify-icons/eva/link-2-fill';
import SortingSelectingToolbar from './SortingSelectingToolbar';

const TABLE_HEAD = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Bug id'
  },
  {
    id: 'headline',
    numeric: false,
    disablePadding: false,
    label: 'Headline'
  },
  {
    id: 'severity',
    numeric: false,
    disablePadding: true,
    label: 'Severity'
  },
  {
    id: 'known_affected_releases',
    numeric: false,
    disablePadding: true,
    label: 'Affected Releases'
  },
  {
    id: 'affected_assets',
    numeric: false,
    disablePadding: true,
    label: 'Affected Assets'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Actions'
  }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function Main() {

  const dispatch = useDispatch();

  const { bugList } = useSelector(
    (state) => state.bug
  );

  const bgLen = bugList?.length > 0 ? bugList?.length : 0
  console.log("Buglist len " + JSON.stringify(bgLen))
  console.log("Buglist " + JSON.stringify(bugList))



  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(getBugsList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={3}>
      <TableContainer>
        <Card>
          <CardContent>
            <SortingSelectingToolbar total={bgLen} />
            <Scrollbars>
              <Table size={'small'}>
                <SortingSelectingHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onRequestSort={handleRequestSort}
                  rowCount={bgLen}
                />
                {bgLen > 0 && (
                  <TableBody>
                    {stableSort(
                      bugList,
                      getComparator(order, orderBy)
                    ).map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={row.bug_id}>
                          <TableCell align="left"><a href={`https://bst.cloudapps.cisco.com/bugsearch/bug/${row.bug_id}`} rel="noreferrer" target="_blank">{row.bug_id}</a></TableCell>
                          <TableCell align="left">
                            {row.headline}
                          </TableCell>
                          <TableCell align="left">{row.severity}</TableCell>
                          <TableCell align="left">{row.known_affected_releases}</TableCell>
                          <TableCell align="left">{row.affected_assets}</TableCell>
                          {/* <TableCell align="center">

                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                )}
                {bgLen === 0 && <SearchNotFound span={6} />}
              </Table>
            </Scrollbars>
            <Box sx={{ position: 'relative' }}>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={bgLen}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  top: 0,
                  position: { md: 'absolute' }
                }}
              ></Box>
            </Box>
          </CardContent>
        </Card>
      </TableContainer>
    </Grid>
  );
}