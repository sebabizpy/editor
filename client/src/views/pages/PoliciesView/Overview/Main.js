import Scrollbars from '../../../..//components/Scrollbars';
import { getPoliciesList } from '../../../..//redux/slices/policies';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SortingSelectingHead from './SortingSelectingHead';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import {
  Grid,
  Card,
  CardContent,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer
} from '@material-ui/core';
import SearchNotFound from '../../../../components/SearchNotFound';
import SortingSelectingToolbar from './SortingSelectingToolbar';

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
    label: 'Description'
  },
  {
    id: 'severity',
    numeric: false,
    disablePadding: true,
    label: 'Severity'
  },
  {
    id: 'severity',
    numeric: false,
    disablePadding: true,
    label: 'Affected Assets'
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
  const [orderBy, setOrderBy] = useState('id');

  useEffect(() => {
    dispatch(getPoliciesList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const fetchPolicies = (evt) => {
    // DO a request here to put policies into de database
    console.log('NOT IMPLEMENTED YET');
  };

  const list = [2,0,4,2,3,2,3,4,5,2,3,4,2,2,6]

  return (
    <Grid container spacing={3}>
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
                          <TableCell align="left">{list[index]}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                )}
                {policiesList.length === 0 && <SearchNotFound span={6} />}
              </Table>
            </Scrollbars>
          </CardContent>
        </Card>
      </TableContainer>
    </Grid>
  );
}