import Scrollbars from '../../../../../components/Scrollbars';
import { getVulnerabilitysList , setVulnerability } from '../../../../../redux/slices/vulnerabilities';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SortingSelectingHead from './SortingSelectingHead';
import { useHistory } from 'react-router-dom';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import {camelCase} from 'change-case';
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
import { Icon } from '@iconify/react';
import findIcon from '@iconify-icons/eva/search-outline';
import Label from '../../../../../custom_components/Label';
import PropTypes from 'prop-types';
import { PATH_COMPLIANCE } from '../../../../../routes/paths';

const TABLE_HEAD = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Advisory Id'
  },
  {
    id: 'advisory_title',
    numeric: false,
    disablePadding: false,
    label: 'Advisory Title'
  },
  {
    id: 'last_updated',
    numeric: false,
    disablePadding: true,
    label: 'Last Updated'
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
  const history = useHistory();
  const dispatch = useDispatch();

  const { vulnerabilityList } = useSelector((state) => state.vulnerability);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

  useEffect(() => {
    dispatch(getVulnerabilitysList());
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - vulnerabilityList.length) : 0;

  return (
    <>
      <Grid container spacing={3}>
        <TableContainer>
          <Card>
            <CardContent>
              <SortingSelectingToolbar total={vulnerabilityList.length}/>
              <Scrollbars>
                <Table size={'small'}>
                  <SortingSelectingHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                    rowCount={vulnerabilityList.length}
                  />
                  {vulnerabilityList.length > 0 && (
                    <TableBody>
                       {stableSort(vulnerabilityList, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        ).map((row, index) => {
                        return (
                          <TableRow hover tabIndex={-1} key={row.advisory_id}>
                            <TableCell align="left">{row.advisory_id}</TableCell>
                            <TableCell align="left">
                              {row.advisory_title}
                            </TableCell>
                            <TableCell align="left">{row.last_updated}</TableCell>
                            <TableCell align="left">{row.affected_assets}</TableCell>
                            <TableCell align="center">
                                <IconButton
                                  onClick={() => {
                                    dispatch(setVulnerability(row));
                                    history.push(
                                      PATH_COMPLIANCE.compliance.vulnerability
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
                  {vulnerabilityList.length === 0 && <SearchNotFound span={6} />}
                </Table>
              </Scrollbars>
              <Box sx={{ position: 'relative' }}>
              <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
                  component="div"
                  count={vulnerabilityList.length}
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
