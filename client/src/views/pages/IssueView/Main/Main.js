import Scrollbars from '../../../../components/Scrollbars';
import { setIssue } from '../../../../redux/slices/issues';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import SortingSelectingHead from './SortingSelectingHead';
import { camelCase } from 'change-case';

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
import { getIssuesList } from '../../../../redux/slices/issues';
import Label from '../../../../custom_components/Label';
import PropTypes from 'prop-types';
import findIcon from '@iconify-icons/eva/search-fill';

let TABLE_HEAD = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'title'
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

Main.propTypes = {
  editing: PropTypes.bool,
  onSelectRow: PropTypes.func
};

export default function Main({ editing, onSelectRow }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const { issueList } = useSelector((state) => state.issue);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [asset, setAsset] = useState(undefined);
  const [open, setOpen] = useState(undefined);

  if (editing && TABLE_HEAD.length === 3) {
    TABLE_HEAD.push({
      id: 'actions',
      numeric: false,
      disablePadding: false,
      label: 'Actions'
    });
  }

  if (!editing && TABLE_HEAD.length === 4) {
    TABLE_HEAD = TABLE_HEAD.slice(0, 3);
  }

  useEffect(() => {
    dispatch(getIssuesList(undefined));
    dispatch(setIssue(undefined));
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const onSelectedRow = (asset) => {
    setAsset(asset);
    dispatch(getIssuesList(asset));
    setOpen(false);
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
      ? Math.max(0, (1 + page) * rowsPerPage - (issueList?.length | 0))
      : 0;

  return (
    <>
      <Grid container mt={2} spacing={3}>
        <TableContainer>
          <Card>
            <CardContent>
              <SortingSelectingToolbar
                open={open}
                total={issueList?.length | 0}
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
                    rowCount={issueList?.length | 0}
                  />
                  {(issueList?.length | 0) > 0 && (
                    <TableBody>
                      {stableSort(issueList, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.token}
                              onClick={(evt) => {
                                if (onSelectRow) {
                                  onSelectRow(row);
                                }
                              }}
                            >
                              <TableCell align="left">{row.title}</TableCell>
                              <TableCell align="left">
                                {row.createdAt}
                              </TableCell>
                              <TableCell align="left">
                                <IssueStatus status={row.status} />
                              </TableCell>
                              {editing && (
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      dispatch(setIssue(row));
                                      history.push(
                                        PATH_REMEDIATION.remediation
                                          .create_issues
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
                              )}
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
                  {(issueList?.length | 0) === 0 && <SearchNotFound span={6} />}
                </Table>
              </Scrollbars>
              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
                  component="div"
                  count={issueList?.length | 0}
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
    'OPEN',
    'WIP',
    'CANCELED',
    'RESOLVED'
  ])
};

function IssueStatus({ status }) {
  let color = 'info';
  let statusName = 'OPEN';

  if (status === 'RESOLVED') {
    color = 'success';
    statusName = 'RESOLVED';
  }
  
  if (status === 'WIP') {
    color = 'warning';
    statusName = 'IN PROGRESS';
  }

  if (status === 'CLOSED') {
    color = 'error';
    statusName = 'CLOSED';
  }
  return (
    <Label variant={'filled'} color={color}>
      {statusName}
    </Label>
  );
}
