import { Icon } from '@iconify/react';
import Scrollbars from '../../../../components/Scrollbars';
import {
    deleteAsset,
    getAssetsList,
    setIdSelected,
    onChangeStatus,
    setAsset
} from '../../../../redux/slices/assets';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import delIcon from '@iconify-icons/eva/trash-2-outline';
import findIcon from '@iconify-icons/eva/search-fill';
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
import { useSnackbar } from 'notistack';
import { PATH_ASSETS } from '../../../../routes/paths';
import { DeleteDialog } from '../../../../custom_components/DeleteDialog';
import PropTypes from 'prop-types';
import Label from '../../../../custom_components/Label';
import { camelCase } from 'change-case';
// ----------------------------------------------------------------------
let TABLE_HEAD = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name'
    },
    {
        id: 'host',
        numeric: false,
        disablePadding: false,
        label: 'Net Address'
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status'
    }
];

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

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


Main.propTypes = {
    editing: PropTypes.bool,
    onSelectRow: PropTypes.func,
}


export default function Main({ editing, onSelectRow }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { assetsList, idSelected, changed } = useSelector(
        (state) => state.asset
    );
    const [page, setPage] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    
    if (editing && TABLE_HEAD.length === 3) {
        TABLE_HEAD.push({
            id: 'actions',
            numeric: false,
            disablePadding: false,
            label: 'Actions'
        });
    } 
    
    if ( !editing && TABLE_HEAD.length === 4 ) {
        TABLE_HEAD = TABLE_HEAD.slice(0,3);
    }

    useEffect(() => {
        dispatch(getAssetsList(null));
    }, [dispatch]);

    if (changed === 'deleted') {
        enqueueSnackbar(`Asset deleted`, { variant: 'success' });
        dispatch(onChangeStatus('none'));
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

    const onIconClick = (event) => {
        event.preventDefault();
        let id = getValue(event);
        let res = assetsList.find((element) => {
            return element.id == id;
        });
        dispatch(setAsset(res));
        history.push(PATH_ASSETS.general.discovery.replace(":id",id));
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
        dispatch(deleteAsset(idSelected));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - assetsList.length) : 0;

    return (
        <>

            <DeleteDialog
                closeDeleteDialog={closeDeleteDialog}
                deleteRow={deleteRow}
                openDialog={openDialog}
            />
            <Grid item spacing={3}>
                <TableContainer>
                    <Card>
                        <CardContent>
                            <SortingSelectingToolbar total={assetsList.length} />
                            <Scrollbars>
                                <Table size={'small'}>
                                    <SortingSelectingHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        onRequestSort={handleRequestSort}
                                        rowCount={assetsList.length}
                                    />
                                    {assetsList.length > 0 && (
                                        <TableBody>
                                            {stableSort(assetsList, getComparator(order, orderBy))
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage
                                                )
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow hover tabIndex={-1} key={row.id}
                                                            onClick={(evt) => {
                                                                if (onSelectRow) {
                                                                    onSelectRow(row);
                                                                }
                                                            }}
                                                        >
                                                            <TableCell align="left">{row.name}</TableCell>
                                                            <TableCell align="left">{row.host}</TableCell>
                                                            <TableCell align="left">
                                                                <AssetStatus status={row.status} />
                                                            </TableCell>
                                                            {editing &&
                                                                <TableCell align="center">
                                                                    <IconButton
                                                                        onClick={onIconClick}
                                                                        value={row.id}
                                                                        id={'find'}
                                                                    >
                                                                        <Icon
                                                                            disabled
                                                                            value={row.id}
                                                                            width={20}
                                                                            height={20}
                                                                            icon={findIcon}
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
                                                            }
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
                                    {assetsList.length === 0 && <SearchNotFound span={6} />}
                                </Table>
                            </Scrollbars>
                            <Box sx={{ position: 'relative' }}>
                                <TablePagination
                                    rowsPerPageOptions={[25, 50, 100]}
                                    component="div"
                                    count={assetsList.length}
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


AssetStatus.propTypes = {
    status: PropTypes.oneOf(['NEW', 'DISCOVERED', 'DISCOVERING'])
};

function AssetStatus({ status }) {
    let color = 'info';
    if (status === 'DISCOVERED') {
        color = 'primary';
    }
    if (status === 'DISCOVERING') {
        color = 'error';
    }
    return (
        <Label variant={'filled'} color={color}>
            {camelCase(status)}
        </Label>
    );
}
