import Scrollbars from '../../../../components/Scrollbars';
import {
  deleteCredential,
  getCredentialsList,
  setIdSelected
} from '../../../../redux/slices/credential';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import SortingSelectingHead from './SortingSelectingHead';

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
import SearchNotFound from '../../../../components/SearchNotFound';
import { LoadingButton } from '@material-ui/lab';
import { PATH_GENERAL } from '../../../../routes/paths';
import { Icon } from '@iconify/react';
import Header from './Header';
import delIcon from '@iconify-icons/eva/trash-2-outline';
import { DeleteDialog } from '../../../../custom_components/DeleteDialog';

const TABLE_HEAD = [
  {
    id: 'protocol',
    numeric: false,
    disablePadding: true,
    label: 'Protocol'
  },
  {
    id: 'user',
    numeric: false,
    disablePadding: false,
    label: 'User'
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

export default function SortingSelecting({ edit }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const { credentialList, idSelected } = useSelector(
    (state) => state.credential
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(getCredentialsList(null));
  }, [dispatch]);

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

  const openDeleteDialog = (event) => {
    event.preventDefault();
    dispatch(setIdSelected(getValue(event)));
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    dispatch(setIdSelected(-1));
    setOpenDialog(false);
  };

  const deleteRow = () => {
    setOpenDialog(false);
    dispatch(deleteCredential(idSelected));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - credentialList.length)
      : 0;

  return (
    <>
      <Header/>
      <DeleteDialog
        closeDeleteDialog={closeDeleteDialog}
        deleteRow={deleteRow}
        openDialog={openDialog}
      />
      <Grid container mt={2} spacing={3}>
        <TableContainer>
          <Card>
            <CardContent>
              <SortingSelectingToolbar total={credentialList.length} />
              <Scrollbars>
                <Table size={'small'}>
                  <SortingSelectingHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                    rowCount={credentialList.length}
                  />
                  {credentialList.length > 0 && (
                    <TableBody>
                      {stableSort(credentialList, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.id}>
                              <TableCell align="left">
                                {row.protocol}
                              </TableCell>
                              <TableCell align="left">{row.user}</TableCell>
                              <TableCell align="left">
                                <IconButton
                                  onClick={openDeleteDialog}
                                  value={row.id}
                                  id={'delete'}
                                >
                                  <Icon
                                    disabled
                                    value={row.id}
                                    width={20}
                                    height={20}
                                    icon={delIcon}
                                  />
                                </IconButton>
                              </TableCell>
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
                  {credentialList.length === 0 && <SearchNotFound span={6} />}
                </Table>
              </Scrollbars>
              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
                  component="div"
                  count={credentialList.length}
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
    </>
  );
}
