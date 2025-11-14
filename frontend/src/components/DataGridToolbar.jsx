import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Collapse,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const DataGridToolbar = ({ onSearch, onFilter, onClear }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([]);

  const columns = [
    { value: 'brand', label: 'Brand' },
    { value: 'model', label: 'Model' },
    { value: 'body_style', label: 'Body Style' },
    { value: 'power_train', label: 'Power Train' },
    { value: 'price_euro', label: 'Price' },
    { value: 'range_km', label: 'Range' },
    { value: 'top_speed_kmh', label: 'Top Speed' },
    { value: 'accel_sec', label: 'Acceleration' },
    { value: 'efficiency_whkm', label: 'Efficiency' },
    { value: 'seats', label: 'Seats' },
  ];

  const operators = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
    { value: 'lessThanOrEqual', label: 'Less Than or Equal' },
  ];

  const doSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const updateQuery = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  };

  const addFilter = () => {
    setFilters([
      ...filters,
      { field: 'brand', operator: 'contains', value: '' },
    ]);
  };

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const updateFilter = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const submitFilters = () => {
    const validFilters = filters.filter(
      (f) => f.operator === 'isEmpty' || f.value.trim() !== ''
    );
    if (validFilters.length > 0) {
      onFilter(validFilters);
    }
  };

  const resetAll = () => {
    setSearchQuery('');
    setFilters([]);
    onClear();
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={9} lg={10}>
          <TextField
            fullWidth
            size="medium"
            placeholder="Search by brand, model, body style, segment, power train, plug type..."
            value={searchQuery}
            onChange={updateQuery}
            onKeyPress={handleEnter}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                },
                '&.Mui-focused': {
                  backgroundColor: 'background.paper',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon sx={{ display: { xs: 'none', sm: 'inline' } }} />}
              onClick={doSearch}
              fullWidth
              size="small"
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon sx={{ display: { xs: 'none', sm: 'inline' } }} />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
              sx={{ minWidth: { xs: '45%', sm: 'auto' } }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon sx={{ display: { xs: 'none', sm: 'inline' } }} />}
              onClick={resetAll}
              size="small"
              sx={{ minWidth: { xs: '45%', sm: 'auto' } }}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Collapse in={showFilters}>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2">Advanced Filters</Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addFilter}
            >
              Add Filter
            </Button>
          </Box>

          {filters.map((filter, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Field</InputLabel>
                  <Select
                    value={filter.field}
                    label="Field"
                    onChange={(e) => updateFilter(index, 'field', e.target.value)}
                  >
                    {columns.map((col) => (
                      <MenuItem key={col.value} value={col.value}>
                        {col.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={filter.operator}
                    label="Operator"
                    onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                  >
                    {operators.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, 'value', e.target.value)}
                  disabled={filter.operator === 'isEmpty'}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton
                  color="error"
                  onClick={() => removeFilter(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {filters.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={submitFilters}
              >
                Apply Filters
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default DataGridToolbar;
