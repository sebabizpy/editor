import Scrollbars from '../../../../../components/Scrollbars';
import {
  getConfigsList
} from '../../../../../redux/slices/config';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import SortingSelectingHead from './SortingSelectingHead';
import {
  Grid,
  Card,
  Button,
  Checkbox,
  CardContent,
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import SearchNotFound from '../../../../../components/SearchNotFound';
import { PATH_ASSETS } from '../../../../../routes/paths';

const TABLE_HEAD = [
  {
    id: 'select',
    numeric: false,
    disablePadding: false,
    label: ' '
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'Created'
  },
  {
    id: 'version',
    numeric: false,
    disablePadding: false,
    label: 'Version'
  },
  {
    id: 'detail',
    numeric: false,
    disablePadding: false,
    label: 'Detail'
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


export default function SortingSelecting({ edit }) {
  const history = useHistory();
  const dispatch = useDispatch();

  /* const { configList } = useSelector(
    (state) => state.config
  ); */

  const configList = [{ id: "1", createdDate: "19/02/2020", version: "1", detail: " config asset 1" }, { id: "2", createdDate: "27/08/2021", version: "2", detail: " config asset 1" }]

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(getConfigsList(null));
  }, [dispatch]);

  const onClickCompare = () => {
    history.push(PATH_ASSETS.general.config_compare.replace(":id1", "231").replace(":id1", "22"))

  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getValue = (event) => {
    let val = event.target.value;
    let element = event.target;
    while (val === undefined) {
      element = element.parentElement;
      val = element.value;
    }
    return val;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (configList?.length || 0)) : 0;

  return (
    <>
      <Grid container mt={2} spacing={3}>
        <TableContainer>
          <Card>
            <CardContent>
              <SortingSelectingToolbar total={configList?.length || 0} />
              <Scrollbars>
                <Table size={'small'}>
                  <SortingSelectingHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                    rowCount={configList?.length || 0}
                  />
                  {(configList?.length || 0) > 0 && (
                    <TableBody>
                      {stableSort(configList, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.id}>
                              <TableCell padding="checkbox">
                                <Checkbox />
                              </TableCell>
                              <TableCell align="left">
                                {row.createdDate}
                              </TableCell>
                              <TableCell align="left">{row.version}</TableCell>
                              <TableCell align="left">{row.detail}</TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: 33 * emptyRows
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                  {(configList?.length || 0) === 0 && <SearchNotFound span={6} />}
                </Table>
              </Scrollbars>
              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
                  component="div"
                  count={configList?.length || 0}
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
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => {
                    onClickCompare()
                  }}
                >
                  {'Compare'}
                </Button>
              </Box>
            </CardContent>

          </Card>
        </TableContainer>
      </Grid>
    </>
  );
}
