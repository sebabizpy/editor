import Scrollbars from '../../../../components/Scrollbars';
import { getPoliciesList } from '../../../../redux/slices/policies';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SortingSelectingHead from './SortingSelectingHead';
import { camelCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router';
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
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/eva/edit-outline';
import delIcon from '@iconify-icons/eva/trash-2-outline';
import Label from '../../../../custom_components/Label';
import PropTypes from 'prop-types';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import Header from './Header';
import { DeleteDialog } from '../../../../custom_components/DeleteDialog'
import { setIdSelected, deletePolicy } from '../../../../redux/slices/policies';

const TABLE_HEAD = [
  {
    id: 'id',
    numeric: true,
    disablePadding: true,
    label: 'Id'
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Cescription'
  },
  {
    id: 'severity',
    numeric: false,
    disablePadding: true,
    label: 'Severity'
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

  const policies = useSelector((state) => state.policies);
  const history = useHistory();
  const { policiesList } = policies;

  const [order, setOrder] = useState('asc');
  const [openDialog, setOpenDialog] = useState(false);

  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(getPoliciesList());
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

  const closeDeleteDialog = () => {
    dispatch(setIdSelected(-1));
    setOpenDialog(false);
  };

  const openDeleteDialog = (event) => {
    event.preventDefault();
    dispatch(setIdSelected(getValue(event)));
    setOpenDialog(true);
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

  return (
    <>
      <DeleteDialog
        closeDeleteDialog={closeDeleteDialog}
        deleteRow={deletePolicy}
        openDialog={openDialog}
      />
      <Header />
      <Grid container mt={2} spacing={3}>
        <TableContainer>
          <Card>
            <CardContent>
              <SortingSelectingToolbar />
              <Scrollbars>
                <Table size={'small'}>
                  <SortingSelectingHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                    rowCount={policiesList.length}
                  />
                  {policiesList.length > 0 && (
                    <TableBody>
                      {stableSort(
                        policiesList,
                        getComparator(order, orderBy)
                      ).map((row, index) => {
                        return (
                          <TableRow hover tabIndex={-1} key={row.id}>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">
                              {row.description}
                            </TableCell>
                            <TableCell align="left">{row.severity}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={openDeleteDialog}
                                value={row.id}
                                id={'edit'}
                              >
                                <Icon
                                  disabled
                                  value={row.id}
                                  width={20}
                                  height={20}
                                  icon={editIcon}
                                />
                              </IconButton>
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
                    </TableBody>
                  )}
                  {policiesList.length === 0 && <SearchNotFound span={6} />}
                </Table>
              </Scrollbars>
              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
                  component="div"
                  count={policiesList.length}
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

IssueStatus.propTypes = {
  status: PropTypes.oneOf([
    'NEW',
    'PENDING_APPROVAL',
    'IN_PROGRESS',
    'CANCELED',
    'RESOLVED'
  ])
};

function IssueStatus({ status }) {
  let color = 'info';
  if (status === 'RESOLVED') {
    color = 'success';
  }
  if (status === 'PENDING_APPROVAL') {
    color = 'warning';
  }
  if (status === 'CANCELED') {
    color = 'error';
  }
  return (
    <Label variant={'filled'} color={color}>
      {camelCase(status)}
    </Label>
  );
}
