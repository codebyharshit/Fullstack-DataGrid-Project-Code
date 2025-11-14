import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { electricCarsAPI } from '../services/api';

const Compare = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCarsForComparison();
  }, []);

  const loadCarsForComparison = async () => {
    try {
      setLoading(true);
      const ids = searchParams.get('ids')?.split(',') || [];

      if (ids.length === 0) {
        setError('No cars selected for comparison');
        setLoading(false);
        return;
      }

      const carPromises = ids.map(id => electricCarsAPI.getById(id));
      const responses = await Promise.all(carPromises);
      setCars(responses.map(res => res.data));
      setError(null);
    } catch (err) {
      setError('Failed to fetch car details');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || cars.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'No cars to compare'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
            variant="contained"
          >
            Back to List
          </Button>
        </Box>
      </Container>
    );
  }

  const comparisonRows = [
    { label: 'Brand', field: 'brand', type: 'text' },
    { label: 'Model', field: 'model', type: 'text' },
    { label: 'Body Style', field: 'body_style', type: 'text' },
    { label: 'Segment', field: 'segment', type: 'text' },
    { label: 'Seats', field: 'seats', type: 'number' },
    { label: 'Price (EUR)', field: 'price_euro', type: 'currency' },
    { label: 'Acceleration (0-100 km/h)', field: 'accel_sec', type: 'number', unit: 's', highlight: 'min' },
    { label: 'Top Speed (km/h)', field: 'top_speed_kmh', type: 'number', highlight: 'max' },
    { label: 'Range (km)', field: 'range_km', type: 'number', highlight: 'max' },
    { label: 'Efficiency (Wh/km)', field: 'efficiency_whkm', type: 'number', highlight: 'min' },
    { label: 'Fast Charge Speed (km/h)', field: 'fast_charge_kmh', type: 'number', highlight: 'max' },
    { label: 'Power Train', field: 'power_train', type: 'text' },
    { label: 'Plug Type', field: 'plug_type', type: 'text' },
    { label: 'Rapid Charge', field: 'rapid_charge', type: 'boolean' },
  ];

  const findBestValue = (row, cars) => {
    const values = cars.map(car => car[row.field]).filter(v => v !== null && v !== undefined);
    if (values.length === 0) return null;

    if (row.highlight === 'max') {
      return Math.max(...values);
    } else if (row.highlight === 'min') {
      return Math.min(...values);
    }
    return null;
  };

  const formatCellValue = (value, type, unit = '') => {
    if (value === null || value === undefined) return 'N/A';

    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'number':
        return `${value}${unit ? ' ' + unit : ''}`;
      case 'boolean':
        return value === 'Yes' ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />;
      default:
        return value;
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 3,
          boxShadow: 2,
        }}
      >
        <Container maxWidth="xl">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
            sx={{
              color: 'white',
              mb: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Back to List
          </Button>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Compare Electric Cars
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            Comparing {cars.length} {cars.length === 1 ? 'car' : 'cars'}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Car Names Header */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="text.secondary">
                Specifications
              </Typography>
            </Box>
          </Grid>
          {cars.map((car, index) => (
            <Grid item xs={12} md={cars.length === 2 ? 4.5 : 3} key={index}>
              <Card
                elevation={3}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {car.brand}
                </Typography>
                <Typography variant="h6">
                  {car.model}
                </Typography>
                <Chip
                  label={car.body_style}
                  size="small"
                  sx={{
                    mt: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Comparison Table */}
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableBody>
              {comparisonRows.map((row, rowIndex) => {
                const bestValue = findBestValue(row, cars);
                return (
                  <TableRow
                    key={rowIndex}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: '#f9fafb',
                      },
                      '&:hover': {
                        backgroundColor: '#ede9fe',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        minWidth: 200,
                        bgcolor: 'background.paper',
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                      }}
                    >
                      {row.label}
                    </TableCell>
                    {cars.map((car, carIndex) => {
                      const value = car[row.field];
                      const isBest = bestValue !== null && value === bestValue && row.highlight;

                      return (
                        <TableCell
                          key={carIndex}
                          align="center"
                          sx={{
                            fontWeight: isBest ? 700 : 400,
                            bgcolor: isBest ? '#e0f2fe' : 'inherit',
                            color: isBest ? '#0369a1' : 'inherit',
                            borderLeft: carIndex > 0 ? '1px solid #e5e7eb' : 'none',
                          }}
                        >
                          {formatCellValue(value, row.type, row.unit)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Legend */}
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> Highlighted cells in blue indicate the best value in that category
            (lowest for acceleration and efficiency, highest for range, top speed, and charge speed).
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Compare;
