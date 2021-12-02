import HeadTable from './HeadTable';
import { Icon } from '@iconify/react';
import ToolbarTable from './ToolbarTable';
import Scrollbars from '../../../../components/Scrollbars';
import {
  deleteAsset,
  getAssetsList,
  setIdSelected
} from '../../../../redux/slices/assets';
import React, { useState, useEffect } from 'react';
import { visuallyHidden } from '@material-ui/utils';
import { useDispatch, useSelector } from 'react-redux';
import editIcon from '@iconify-icons/eva/edit-outline';
import delIcon from '@iconify-icons/eva/trash-2-outline';
import searchIcon from '@iconify-icons/eva/search-fill';
import compassIcon from '@iconify-icons/eva/compass-outline';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Table,
  TableRow,
  TableBody,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TableCell,
  IconButton,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { entity } from '../CreateView';
import SearchNotFound from '../../../../components/SearchNotFound';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { PATH_ASSETS } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: true },
  { id: 'name', label: 'Name', alignRight: true },
  { id: 'host', label: 'Net Address', alignRight: true },
  { id: 'protocol', label: 'Protocol', alignRight: true },
  { id: 'status', label: 'Status', alignRight: true },
  { id: 'actions', label: 'Actions', alignRight: true }
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

function applySortFilter(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

Search.propTypes = {
  onSelectRow: PropTypes.func,
  edit: PropTypes.bool
};

function Search({ onSelectRow, edit }) {
  const history = useHistory();

  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();
  const { assetsList, changed, setAssetToEdit, idSelected } = useSelector(
    (state) => state.asset
  );
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { enqueueSnackbar } = useSnackbar();

  if (changed !== 'none') {
    enqueueSnackbar(`${entity} ${changed}`, { variant: 'success' });
    // dispatch(onChangeStatus('none'));
  }

  if (edit) {
    TABLE_HEAD.push({ id: '' });
  }

  useEffect(() => {
    dispatch(getAssetsList(null));
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    event.preventDefault();
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

  const updateRow = (event) => {
    const selected = getValue(event);
    const assertFound = assetsList.find((asset) => {
      if (asset.id === Number(selected)) {
        return asset;
      }
      return false;
    });
    dispatch(setAssetToEdit(assertFound));
  };

  const openDeleteDialog = (event) => {
    event.preventDefault();
    dispatch(setIdSelected(getValue(event)));
    setOpenDialog(true);
  };

  const goToDetail = (event) => {
    event.preventDefault();
    const id = getValue(event)
    dispatch(setIdSelected(id));
    history.push(PATH_ASSETS.general.detail.replace(':id', id));
  };

  const goToDiscover = (event) => {
    event.preventDefault();
    const id = getValue(event)
    dispatch(setIdSelected(id));
    history.push(PATH_ASSETS.general.discovery.replace(':id', id));
  };

  const closeDeleteDialog = () => {
    dispatch(setIdSelected(-1));
    setOpenDialog(false);
  };

  const deleteRow = () => {
    setOpenDialog(false);
    dispatch(deleteAsset(idSelected));
  };

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    event.preventDefault();
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (key) => {
    setFilterName(key);
    dispatch(getAssetsList(key));
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - assetsList.length) : 0;

  const filteredAssets = applySortFilter(
    assetsList,
    getComparator(order, orderBy)
  );

  const resultNotFound = filteredAssets.length === 0;

  return (
    <Card className={classes.card}>
      <Dialog
        open={openDialog}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Atencion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            &#191; Estas seguro que queres eliminar este registro &#x3F;
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeDeleteDialog}>
            Cancelar
          </Button>
          <Button color="inherit" onClick={deleteRow}>
            Borrar
          </Button>
        </DialogActions>
      </Dialog>

      <ToolbarTable filterName={filterName} onFilterName={handleFilterByName} />

      <Scrollbars>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table size="medium">
            <HeadTable
              order={order}
              classes={classes}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={assetsList.length}
              onRequestSort={handleRequestSort}
              edit={edit}
            />
            <TableBody>
              {filteredAssets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { id, name, host, protocol, status } = row;
                  return (
                    <TableRow
                      hover
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      className={classes.row}
                      onClick={(evt) => {
                        if (onSelectRow) {
                          onSelectRow(row);
                        }
                      }}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        {id}
                      </TableCell>
                      <TableCell align="left">{name}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {host}
                      </TableCell>
                      <TableCell align="left">{protocol}</TableCell>
                      <TableCell align="left">{status}</TableCell>
                      {edit && (
                        <TableCell align="left">
                          <IconButton
                            onClick={updateRow}
                            value={id}
                            id={'edit'}
                          >
                            <Icon width={20} height={20} icon={editIcon} />
                          </IconButton>
                          <IconButton
                            onClick={openDeleteDialog}
                            value={id}
                            id={'delete'}
                          >
                            <Icon
                              disabled
                              value={id}
                              width={20}
                              height={20}
                              icon={delIcon}
                            />
                          </IconButton>
                          {status === 'created' && (
                            <IconButton onClick={goToDiscover(id)} value={id}>
                              <Icon
                                disabled
                                value={id}
                                width={20}
                                height={20}
                                icon={compassIcon}
                              />
                            </IconButton>
                          )}
                          <IconButton onClick={goToDetail} value={id}>
                            <Icon
                              disabled
                              value={id}
                              width={20}
                              height={20}
                              icon={searchIcon}
                            />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {resultNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    <Box sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbars>

      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={assetsList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}

export default Search;
