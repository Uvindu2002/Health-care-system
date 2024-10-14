import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TablePagination
} from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

// Custom Pagination Component
const CustomPagination = ({ count, page, rowsPerPage, onPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      rowsPerPageOptions={[]} 
      labelRowsPerPage="" 
    />
  );
};

const useStyles = makeStyles((theme) => ({
  searchField: {
    marginBottom: '20px',
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  },
  criteriaSelect: {
    marginRight: '45px',
    minWidth: '150px',
    marginBottom: '30px',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
}));

const ViewTickets = () => {
  const classes = useStyles();
  const [ticketData, setTicketData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("ticketId");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/tickets/get-tickets');
        setTicketData(response.data);
      } catch (error) {
        console.error("There was an error fetching the ticket data!", error);
      }
    };

    fetchTicketData();
  }, []);

  const handleUpdate = (ticketId) => {
    navigate(`/update-ticket/${ticketId}`); // Navigate to the update page with the ticket ID
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/tickets/delete-ticket/${id}`);
      setTicketData(ticketData.filter(ticket => ticket._id !== id));
    } catch (error) {
      console.error("There was an error deleting the ticket!", error);
    }
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredTickets = ticketData.filter(ticket => {
    if (!searchQuery) return true;
    const field = ticket[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedTickets = filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box display="flex">
      <Sidebar />
      <Box className={classes.contentContainer}>
        <Box
          alignItems="center"
          justifyContent="space-between"
          marginTop={"60px"}
          width="100%"
          display="flex"
          flexDirection="row"
        >
          <Typography
            variant="h4"
            gutterBottom
            style={{
              marginBottom: '20px',
              fontFamily: 'cursive',
              fontWeight: 'bold',
              color: 'purple',
              textAlign: 'center'
            }}
          >
            View Tickets
          </Typography>
          <Box display="flex" alignItems="center">
            <FormControl className={classes.criteriaSelect}>
              <InputLabel>Search By</InputLabel>
              <Select
                value={searchCriteria}
                onChange={handleCriteriaChange}
                label="Search By"
              >
                <MenuItem value="ticketId">Ticket ID</MenuItem>
                <MenuItem value="customerName">Customer Name</MenuItem>
                <MenuItem value="issue">Issue</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              placeholder={`Search by ${searchCriteria}`}
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className={classes.searchField}
            />
          </Box>
        </Box>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                <TableCell style={{ color: 'white' }}>Ticket ID</TableCell>
                <TableCell style={{ color: 'white' }}>Customer Name</TableCell>
                <TableCell style={{ color: 'white' }}>Issue</TableCell>
                <TableCell style={{ color: 'white' }}>Status</TableCell>
                <TableCell style={{ color: 'white' }}>Created Date</TableCell>
                <TableCell style={{ color: 'white' }}>Update</TableCell>
                <TableCell style={{ color: 'white' }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell>{ticket.ticketId}</TableCell>
                  <TableCell>{ticket.customerName}</TableCell>
                  <TableCell>{ticket.issue}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{new Date(ticket.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleUpdate(ticket._id)}
                    >
                      Update
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(ticket._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomPagination
          count={filteredTickets.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
        />
      </Box>
    </Box>
  );
};

export default ViewTickets;
