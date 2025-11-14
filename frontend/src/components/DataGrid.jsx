import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { Button, IconButton, CircularProgress, Alert, Box, Chip, Stack, Paper, Typography } from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Compare as CompareIcon,
  Euro as EuroIcon,
  Speed as SpeedIcon,
  BatteryChargingFull as BatteryIcon,
  LocalOffer as OfferIcon,
  DirectionsCar as CarIcon,
  Numbers as NumbersIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  LocalGasStation as RangeIcon,
  EvStation as EvStationIcon,
  EventSeat as SeatsIcon,
  Category as CategoryIcon,
  Bolt as BoltIcon,
} from '@mui/icons-material';
import { electricCarsAPI } from '../services/api';
import DataGridToolbar from './DataGridToolbar';

ModuleRegistry.registerModules([AllCommunityModule]);

const DataGrid = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const response = await electricCarsAPI.getAll();
      setAllData(response.data);
      setRowData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please make sure the backend server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchCars = async (query) => {
    console.log('Search triggered with query:', query);

    if (!query || query.trim() === '') {
      console.log('Empty query, showing all data');
      setRowData(allData);
      setActiveQuickFilter(null);
      return;
    }

    try {
      setLoading(true);
      console.log('Calling search API with query:', query);
      const response = await electricCarsAPI.search(query);
      console.log('Search API response:', response);
      setRowData(response.data);
      setActiveQuickFilter(null);
      setError(null);
    } catch (err) {
      setError('Failed to search data');
      console.error('Error searching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (filters) => {
    console.log('Filter triggered with filters:', filters);

    if (!filters || filters.length === 0) {
      console.log('No filters provided, showing all data');
      setRowData(allData);
      setActiveQuickFilter(null);
      return;
    }

    try {
      setLoading(true);
      console.log('Calling filter API with filters:', JSON.stringify(filters, null, 2));
      const response = await electricCarsAPI.filter(filters);
      console.log('Filter API response:', response);
      setRowData(response.data);
      setActiveQuickFilter(null);
      setError(null);
    } catch (err) {
      setError('Failed to filter data');
      console.error('Error filtering data:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setRowData(allData);
    setActiveQuickFilter(null);
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  const deleteCar = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await electricCarsAPI.delete(id);
        const updatedData = allData.filter(item => item.id !== id);
        setAllData(updatedData);
        setRowData(rowData.filter(item => item.id !== id));
      } catch (err) {
        alert('Failed to delete record');
        console.error('Error deleting record:', err);
      }
    }
  };

  const gridReady = (params) => {
    setGridApi(params.api);
  };

  const rowSelected = () => {
    if (gridApi) {
      const selected = gridApi.getSelectedRows();
      setSelectedRows(selected);
    }
  };

  const quickFilters = [
    {
      label: 'Affordable (< €40k)',
      icon: <EuroIcon fontSize="small" />,
      filter: (data) => data.filter(car => car.price_euro < 40000),
      color: 'success',
    },
    {
      label: 'Long Range (> 400km)',
      icon: <BatteryIcon fontSize="small" />,
      filter: (data) => data.filter(car => car.range_km > 400),
      color: 'primary',
    },
    {
      label: 'Fast (0-100 < 5s)',
      icon: <SpeedIcon fontSize="small" />,
      filter: (data) => data.filter(car => car.accel_sec < 5),
      color: 'error',
    },
    {
      label: 'Best Value (< €50k, > 350km)',
      icon: <OfferIcon fontSize="small" />,
      filter: (data) => data.filter(car => car.price_euro < 50000 && car.range_km > 350),
      color: 'secondary',
    },
  ];

  const toggleQuickFilter = (filterIndex) => {
    if (activeQuickFilter === filterIndex) {
      setActiveQuickFilter(null);
      setRowData(allData);
    } else {
      setActiveQuickFilter(filterIndex);
      const filtered = quickFilters[filterIndex].filter(allData);
      setRowData(filtered);
    }
  };

  const compareSelected = () => {
    if (selectedRows.length < 2) {
      alert('Please select at least 2 cars to compare');
      return;
    }
    if (selectedRows.length > 4) {
      alert('You can compare maximum 4 cars at a time');
      return;
    }
    const ids = selectedRows.map(row => row.id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  const viewCar = (id) => {
    navigate(`/car/${id}`);
  };

  const ActionsCell = (props) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => viewCar(props.data.id)}
          title="View Details"
        >
          <ViewIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => deleteCar(props.data.id)}
          title="Delete"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  const columnDefs = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 70,
      maxWidth: 90,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      filter: true,
      sortable: true,
      flex: 1,
      minWidth: 110,
    },
    {
      field: 'model',
      headerName: 'Model',
      filter: true,
      sortable: true,
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: 'accel_sec',
      headerName: '0-100',
      filter: 'agNumberColumnFilter',
      sortable: true,
      flex: 0.7,
      minWidth: 90,
      headerTooltip: 'Acceleration 0-100 km/h (seconds)',
      valueFormatter: (params) => params.value ? `${params.value}s` : '',
    },
    {
      field: 'top_speed_kmh',
      headerName: 'Speed',
      filter: 'agNumberColumnFilter',
      sortable: true,
      flex: 0.8,
      minWidth: 100,
      headerTooltip: 'Top Speed (km/h)',
      valueFormatter: (params) => params.value ? `${params.value} km/h` : '',
    },
    {
      field: 'range_km',
      headerName: 'Range',
      filter: 'agNumberColumnFilter',
      sortable: true,
      flex: 0.8,
      minWidth: 100,
      headerTooltip: 'Range (km)',
      valueFormatter: (params) => params.value ? `${params.value} km` : '',
    },
    {
      field: 'efficiency_whkm',
      headerName: 'Effic.',
      filter: 'agNumberColumnFilter',
      sortable: true,
      flex: 0.8,
      minWidth: 100,
      headerTooltip: 'Efficiency (Wh/km)',
      valueFormatter: (params) => params.value ? `${params.value} Wh/km` : '',
    },
    {
      field: 'price_euro',
      headerName: 'Price',
      filter: 'agNumberColumnFilter',
      sortable: true,
      flex: 0.9,
      minWidth: 120,
      headerTooltip: 'Price (EUR)',
      valueFormatter: (params) => {
        if (params.value) {
          return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
    },
    {
      field: 'body_style',
      headerName: 'Body',
      filter: true,
      sortable: true,
      flex: 0.9,
      minWidth: 100,
      headerTooltip: 'Body Style',
    },
    {
      field: 'seats',
      headerName: 'Seats',
      filter: 'agNumberColumnFilter',
      sortable: true,
      flex: 0.5,
      minWidth: 80,
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionsCell,
      flex: 0.7,
      minWidth: 100,
      pinned: 'right',
      sortable: false,
      filter: false,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
  }), []);

  const gridOptions = {
    pagination: true,
    paginationPageSize: 50,
    rowSelection: 'multiple',
    suppressHorizontalScroll: false,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const customTheme = themeQuartz.withParams({
    backgroundColor: '#ffffff',
    browserColorScheme: 'light',
    chromeBackgroundColor: {
      ref: 'foregroundColor',
      mix: 0.07,
      onto: 'backgroundColor',
    },
    headerBackgroundColor: '#667eea',
    headerTextColor: '#ffffff',
    headerFontWeight: 600,
    oddRowBackgroundColor: '#f9fafb',
    rowBorder: true,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    wrapperBorderRadius: 8,
    spacing: 8,
    rowHeight: 50,
    headerHeight: 56,
    fontSize: 14,
    fontFamily: 'Roboto, sans-serif',
  });

  return (
    <Box sx={{ width: '100%' }}>
      <DataGridToolbar
        onSearch={searchCars}
        onFilter={applyFilters}
        onClear={clearFilters}
      />

      <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Quick Filters
          </Typography>
          {selectedRows.length > 0 && (
            <Button
              variant="contained"
              size="small"
              startIcon={<CompareIcon />}
              onClick={compareSelected}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                },
              }}
            >
              Compare {selectedRows.length} {selectedRows.length === 1 ? 'Car' : 'Cars'}
            </Button>
          )}
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {quickFilters.map((qf, index) => (
            <Chip
              key={index}
              icon={qf.icon}
              label={qf.label}
              onClick={() => toggleQuickFilter(index)}
              color={activeQuickFilter === index ? qf.color : 'default'}
              variant={activeQuickFilter === index ? 'filled' : 'outlined'}
              sx={{
                fontWeight: activeQuickFilter === index ? 600 : 400,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            />
          ))}
          {activeQuickFilter !== null && (
            <Chip
              label="Clear Filter"
              onDelete={() => toggleQuickFilter(activeQuickFilter)}
              color="default"
              size="small"
            />
          )}
        </Stack>
      </Paper>

      <Box
        className="ag-theme-quartz"
        sx={{
          height: { xs: '500px', sm: '650px', md: '75vh' },
          width: '100%',
          overflow: 'auto',
          '& .ag-root-wrapper': {
            borderRadius: '12px',
            overflow: 'hidden',
          },
          '& .ag-header': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          },
          '& .ag-header-cell': {
            fontWeight: 600,
            fontSize: '14px',
            color: '#ffffff',
          },
          '& .ag-row-odd': {
            backgroundColor: '#f9fafb',
            transition: 'background-color 0.2s ease',
          },
          '& .ag-row-even': {
            backgroundColor: '#ffffff',
            transition: 'background-color 0.2s ease',
          },
          '& .ag-row:hover': {
            backgroundColor: '#ede9fe !important',
            transform: 'scale(1.001)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          },
          '& .ag-cell': {
            display: 'flex',
            alignItems: 'center',
            paddingTop: '8px',
            paddingBottom: '8px',
          },
          '& .ag-row': {
            borderBottom: '1px solid #e5e7eb',
            transition: 'all 0.2s ease',
          },
          '& .ag-body-viewport': {
            transition: 'opacity 0.2s ease',
          },
        }}
      >
        <AgGridReact
          theme={customTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={gridReady}
          onSelectionChanged={rowSelected}
          {...gridOptions}
        />
      </Box>
    </Box>
  );
};

export default DataGrid;
