import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { selectUser } from '@containers/Client/selectors';
import { selectUsers } from '@pages/Users/selectors';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import {
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { actionDeleteUser, actionGetUsers, actionResetUsers } from '@pages/Users/actions';

import classes from '@pages/Users/style.module.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { PersonSearch } from '@mui/icons-material';

const Users = ({ user, users, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate, user]);

  useEffect(() => {
    dispatch(actionGetUsers(search, rowsPerPage, page));

    return () => {
      if (users) {
        dispatch(actionResetUsers());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, rowsPerPage]);

  useEffect(() => {
    const timeOutId = setTimeout(() => dispatch(actionGetUsers(search, rowsPerPage, page)), 1000);
    return () => clearTimeout(timeOutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: 'fullName', label: formatMessage({ id: 'app_user_fullName' }), minWidth: 170 },
    { id: 'email', label: formatMessage({ id: 'app_user_email' }), minWidth: 100 },
    {
      id: 'role',
      label: formatMessage({ id: 'app_role_user' }),
      minWidth: 170,
    },
  ];

  return (
    <div className={classes.tableWrap}>
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_user_page_header" />
        </h3>
        <div className={classes.searchInputWrap}>
          <PersonSearch />
          <input className={classes.searchInput} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} className={`${classes.tableHead} ${column.id === 'email' && classes.email}`}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell className={classes.tableHead}>
                <FormattedMessage id="app_action" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.data?.map((row) => (
              <TableRow hover key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell
                      key={column.id}
                      className={`${classes.tableBody} ${column.id === 'email' && classes.email}`}
                    >
                      {value}
                    </TableCell>
                  );
                })}
                <TableCell className={`${classes.tableBody} ${classes.tableAction}`}>
                  <button
                    type="button"
                    className={classes.buttonAction}
                    onClick={() => dispatch(actionDeleteUser(row.id))}
                  >
                    <FormattedMessage id="app_delete_account" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {users?.data?.length === 0 && (
              <TableRow hover>
                <TableCell colSpan={4}>
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">
                      <FormattedMessage id="app_404" />
                    </Alert>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={classes.tablePagination}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={users?.totalRows || 0}
        rowsPerPage={rowsPerPage}
        page={users ? page : 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

Users.propTypes = {
  intl: PropTypes.object,
  user: PropTypes.object,
  users: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  users: selectUsers,
});

export default injectIntl(connect(mapStateToProps)(Users));
