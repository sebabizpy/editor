import Scrollbars from '../../../../components/Scrollbars';
import {
  deleteChangeRequest,
  setIdSelected,
  setChangeRequest
} from '../../../../redux/slices/change_request';
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
import { PATH_REMEDIATION } from '../../../../routes/paths';
import { Icon } from '@iconify/react';
import { getChangeRequestsList, getChangeRequestsListByAsset } from '../../../../redux/slices/change_request';
import Label from '../../../../custom_components/Label';
import PropTypes from 'prop-types';
import { ShowUser } from '../../../../custom_components/UserHelper';
import { DeleteDialog } from '../../../../custom_components/DeleteDialog';
import findIcon from '@iconify-icons/eva/search-fill';
import Header from './Header';

const TABLE_HEAD = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'title'
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'description'
  },
  {
    id: 'createdBy',
    numeric: false,
    disablePadding: true,
    label: 'created by'
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created At'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'status'
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: ''
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

export default function Main({ edit }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const { changeRequestList, idSelected } = useSelector(
    (state) => state.change_request
  );

  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [open, setOpen] = useState(false);
  const [asset, setAsset] = useState(undefined);

  useEffect(() => {
    dispatch(getChangeRequestsList(null));
    dispatch(setChangeRequest(undefined));
  }, [dispatch]);

  const onSelectedRow = (asset) => {
    setAsset(asset);
    dispatch(getChangeRequestsListByAsset(asset.id));
    setOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const closeDeleteDialog = () => {
    dispatch(setIdSelected(-1));
    setOpenDialog(false);
  };

  const deleteRow = () => {
    setOpenDialog(false);
    dispatch(deleteChangeRequest(idSelected));
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
      ? Math.max(0, (1 + page) * rowsPerPage - changeRequestList.length)
      : 0;

  return (
    <>
      <Header />
      <DeleteDialog
        closeDeleteDialog={closeDeleteDialog}
        deleteRow={deleteRow}
        openDialog={openDialog}
      />
      <Grid container mt={2} spacing={3}>
        <TableContainer>
          <Card>
            <CardContent>
              <SortingSelectingToolbar
                open={open}
                total={changeRequestList?.length | 0}
                setOpen={setOpen}
                asset={asset}
                onSelectedRow={onSelectedRow}
              />
              <Scrollbars>
                <Table size={'small'}>
                  <SortingSelectingHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                    rowCount={changeRequestList.length}
                  />
                  {changeRequestList.length > 0 && (
                    <TableBody>
                      {stableSort(
                        changeRequestList,
                        getComparator(order, orderBy)
                      )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.token}>
                              <TableCell align="left">{row.title}</TableCell>
                              <TableCell align="left">
                                {row.description}
                              </TableCell>
                              <TableCell align="left">
                                <ShowUser user={row.createdBy} />
                              </TableCell>
                              <TableCell align="left">
                                {new Date(row.createdAt).toDateString()}
                              </TableCell>
                              <TableCell align="left">
                                <ChangeRequestStatus status={row.status} />
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => {
                                    dispatch(setChangeRequest(row));
                                    history.push(
                                      PATH_REMEDIATION.remediation
                                        .create_change_requests
                                    );
                                  }}
                                  value={row.id}
                                  id={'change'}
                                >
                                  <Icon
                                    disabled
                                    value={row.id}
                                    width={20}
                                    height={20}
                                    icon={findIcon}
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
                  {changeRequestList.length === 0 && (
                    <SearchNotFound span={6} />
                  )}
                </Table>
              </Scrollbars>
              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
                  component="div"
                  count={ changeRequestList?.length ? changeRequestList?.length : 0 }
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

ChangeRequestStatus.propTypes = {
  status: PropTypes.oneOf([
    'NEW',
    'PENDING_APPROVAL',
    'IN_PROGRESS',
    'CANCELED',
    'RESOLVED'
  ])
};

function ChangeRequestStatus({ status }) {
  let color = 'info';
  let statusName = 'NEW';
  if (status === 'RESOLVED') {
    color = 'success';
    statusName = 'RESOLVED';
  }
  if (status === 'PENDING_APPROVAL') {
    color = 'warning';
    statusName = 'PENDING APPROVAL';
  }
  if (status === 'IN_PROGRESS') {
    color = 'warning';
    statusName = 'IN PROGRESS';
  }
  if (status === 'CANCELED') {
    color = 'error';
    statusName = 'CANCELED';
  }
  return (
    <Label variant={'filled'} color={color}>
      {statusName}
    </Label>
  );
}
