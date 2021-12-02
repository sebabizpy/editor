
import Scrollbars from '../../../../components/Scrollbars';
import {
  deleteUser,
  getUserList,
  setUserToEdit,
  onChangeStatus
} from '../../../../redux/slices/user';
import React, { useState, useEffect } from 'react';
import { visuallyHidden } from '@material-ui/utils';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/eva/edit-outline';
import delIcon from '@iconify-icons/eva/trash-2-outline';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import SortingSelectingHead from './SortingSelectingHead';
import Header from './Header';

import {
  Box,
  Table,
  Grid,
  Card,
  CardContent,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import SearchNotFound from '../../../../components/SearchNotFound';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { PATH_GENERAL } from '../../../../routes/paths';
import { DeleteDialog } from '../../../../custom_components/DeleteDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'firstName', label: 'Nombre', alignRight: false },
  { id: 'lastName', label: 'Apellido', alignRight: false },
  { id: 'phone', label: 'Telefono', alignRight: false },
  { id: 'celPhone', label: 'Celular', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },

];

const useStyles = makeStyles(() => ({
  root: {},
  sortSpan: visuallyHidden
}));

// ----------------------------------------------------------------------

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

Main.propTypes = {
  onSelectRow: PropTypes.func,
  edit: PropTypes.bool
};

export function Main({ onSelectRow, edit }) {

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { userList, changed } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [order, setOrder] = useState('asc');
  const [idSelected, setIdSelected] = useState(-1);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { enqueueSnackbar } = useSnackbar();

  if ((!edit) && (TABLE_HEAD.length === 6)) {
    TABLE_HEAD.push({ id: 'actions', label: 'Actions', alignRight: false })
  }

  if (changed !== 'none') {
    enqueueSnackbar(`User ${changed}`, { variant: 'success' });
    dispatch(onChangeStatus('none'));
  }

  useEffect(() => {
    dispatch(getUserList(null));
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const getValue = (event) => {
    let val = event.target.value;
    let element = event.target;
    while (val === undefined) {
      element = element.parentElement;
      val = element.value;
    }
    return val;
  };

  const updateRow = (event) => {
    const selected = getValue(event);
    const userFound = userList.find((user) => {
      if (user.id === Number(selected)) {
        return user;
      }
      return false;
    });
    dispatch(setUserToEdit(userFound));
    history.push(PATH_GENERAL.entities.add_users);
    // setIdSelected(selected);
    // let user = { lastName: 'cosososos ' };
    // dispatch(updateUser({ selected, user }));
  };

  const openDeleteDialog = (event) => {
    event.preventDefault();
    setIdSelected(getValue(event));
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setIdSelected(-1);
    setOpenDialog(false);
  };

  const deleteRow = () => {
    setOpenDialog(false);
    dispatch(deleteUser(idSelected));
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addUser = (evt) => {
    dispatch(setUserToEdit(undefined));
    history.push(PATH_GENERAL.entities.add_users);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  return (
    <>
      {(!edit) && (<>
        <DeleteDialog
          closeDeleteDialog={closeDeleteDialog}
          deleteRow={deleteRow}
          openDialog={openDialog}
        />
        <Header/>
      </>)
      }
      <Grid container mt={2} spacing={3}>
        <TableContainer>
          <Card>
            <CardContent>
              <SortingSelectingToolbar total={userList.length} />
              <Scrollbars>
                <Table size={'small'}>
                  <SortingSelectingHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                    rowCount={userList.length}
                  />
                  {userList.length > 0 && (
                    <TableBody>
                      {stableSort(userList, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow
                              hover
                              key={index}
                              tabIndex={-1}
                              role="checkbox"
                              className={classes.row}
                              onClick={(evt) => {
                                console.log(`Row ${row}`)
                                if (onSelectRow) {
                                  onSelectRow(row);
                                }
                              }}
                            >
                              <TableCell align="left">{row.id}</TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                {row.firstName}
                              </TableCell>
                              <TableCell align="left">{row.lastName}</TableCell>
                              <TableCell align="left">{row.phone}</TableCell>
                              <TableCell align="left">{row.celPhone}</TableCell>
                              <TableCell align="left">{row.role}</TableCell>
                              {(!edit) && (
                                <TableCell align="center">
                                  <IconButton
                                    onClick={updateRow}
                                    value={row.id}
                                    id={'edit'}
                                  >
                                    <Icon
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
                                </TableCell>)}
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
                  {userList.length === 0 && <SearchNotFound span={8} />}
                </Table>
              </Scrollbars>
              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
                  component="div"
                  count={userList.length}
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

export default Main;
