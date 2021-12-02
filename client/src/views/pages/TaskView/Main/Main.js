import Scrollbars from '../../../../components/Scrollbars';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Icon } from '@iconify/react';
import codeFill from '@iconify-icons/eva/code-fill';
import link2Fill from '@iconify-icons/eva/link-2-fill';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import { useGetRunStatusQuery } from '../../../../redux/rtk/automationApi';
import { setInterval, setTasksList } from '../../../../redux/slices/tasks';

import PropTypes from 'prop-types';

const TABLE_HEAD = [
    {
        id: 'craetedAt',
        numeric: false,
        disablePadding: true,
        label: 'Created At'
    },
    {
        id: 'run_id',
        numeric: false,
        disablePadding: true,
        label: 'Run Id'
    },
    {
        id: 'description',
        numeric: false,
        disablePadding: true,
        label: 'Description'
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: true,
        label: 'Status'
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

TaskView.propTypes = {
    run_id: PropTypes.string
};

export default function TaskView({ run_id }) {

    const { interval } = useSelector((state) => state.task);

    // TODO: Atajar los errores
    const { data, error, isLoading, isFetching } = useGetRunStatusQuery(
        run_id,
        {
            pollingInterval: interval
        }
    );

    const tasksList = data?.data
    const bgLen = tasksList?.length > 0 ? tasksList?.length : 0

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);


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
                                            tasksList,
                                            getComparator(order, orderBy)
                                        ).map((row, index) => {
                                            return (
                                                <TableRow hover tabIndex={-1} key={index}>
                                                    <TableCell align="left">
                                                        {row.createdAt}
                                                    </TableCell>
                                                    <TableCell align="left">{row.run_id}</TableCell>
                                                    <TableCell align="left">{row.description}</TableCell>
                                                    <TableCell align="left">{row.status}</TableCell>
                                                    <TableCell align="left">
                                                        <IconButton
                                                            value={row.id}
                                                            id={'re_run'}
                                                        >
                                                            <Icon
                                                                disabled
                                                                value={row.id}
                                                                width={20}
                                                                height={20}
                                                                icon={codeFill}
                                                            />
                                                        </IconButton>
                                                        <IconButton
                                                            value={row.id}
                                                            id={'detail'}
                                                        >
                                                            <Icon
                                                                disabled
                                                                value={row.id}
                                                                width={20}
                                                                height={20}
                                                                icon={codeFill}
                                                            />
                                                        </IconButton>
                                                    </TableCell>
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
    )

}