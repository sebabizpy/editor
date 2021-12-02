import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
  className: PropTypes.string,
  span: PropTypes.number
};

function SearchNotFound({ searchQuery = '', className, span, ...other }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell align="center" colSpan={span}>
          <Box sx={{ py: 3 }}>
            <Box className={className} {...other}>
              <Typography gutterBottom align="center" variant="subtitle1">
                Nothing Found.
              </Typography>
              <Typography variant="body2" align="center">
                {searchQuery === '' && <>there are no results.</>}
                {searchQuery !== '' && (
                  <>
                    We search for <strong>&quot;{searchQuery}&quot;</strong>
                    check your query.
                  </>
                )}
              </Typography>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export default SearchNotFound;
