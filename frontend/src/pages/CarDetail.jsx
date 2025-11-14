import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  BatteryChargingFull as BatteryIcon,
  Euro as EuroIcon,
  EventSeat as SeatsIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  ElectricCar as ElectricCarIcon,
  EvStation as ChargingIcon,
  FlashOn as RapidChargeIcon,
  Power as PlugIcon,
  LocalGasStation as RangeIcon,
  EmojiEvents as TopSpeedIcon,
  EmojiEvents,
} from '@mui/icons-material';
import { electricCarsAPI } from '../services/api';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCarDetails();
  }, [id]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      const response = await electricCarsAPI.getById(id);
      setCar(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch car details');
      console.error('Error fetching car details:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

  if (error || !car) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Car not found'}
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

  const InfoCard = ({ icon, title, items, color = 'primary' }) => (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="h2" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Stack spacing={2}>
          {items.map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon && <Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>}
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="600" sx={{ ml: 2 }}>
                  {item.value}
                </Typography>
              </Box>
              {index < items.length - 1 && (
                <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mt: 1.5 }} />
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 3,
          boxShadow: 2,
        }}
      >
        <Container maxWidth="lg">
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
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            {car.brand} {car.model}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<CategoryIcon />}
              label={car.body_style}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
            <Chip
              icon={<SeatsIcon />}
              label={`${car.seats} Seats`}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
            <Chip
              label={`Segment ${car.segment}`}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Price Banner */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', width: 56, height: 56 }}>
                <EuroIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Starting Price
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(car.price_euro)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Power Train
              </Typography>
              <Chip
                icon={<ElectricCarIcon />}
                label={car.power_train}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '1rem',
                  height: 40,
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Information Cards Grid */}
        <Grid container spacing={3}>
          {/* General Information */}
          <Grid item xs={12} md={6}>
            <InfoCard
              icon={<CarIcon />}
              title="General Information"
              color="primary"
              items={[
                { icon: <CarIcon fontSize="small" />, label: 'Brand', value: car.brand },
                { icon: null, label: 'Model', value: car.model },
                { icon: <CategoryIcon fontSize="small" />, label: 'Body Style', value: car.body_style },
                { icon: null, label: 'Segment', value: car.segment },
                { icon: <SeatsIcon fontSize="small" />, label: 'Seats', value: car.seats },
              ]}
            />
          </Grid>

          {/* Performance */}
          <Grid item xs={12} md={6}>
            <InfoCard
              icon={<SpeedIcon />}
              title="Performance"
              color="error"
              items={[
                {
                  icon: <TimelineIcon fontSize="small" />,
                  label: 'Acceleration (0-100 km/h)',
                  value: `${car.accel_sec} sec`
                },
                {
                  icon: <TopSpeedIcon fontSize="small" />,
                  label: 'Top Speed',
                  value: `${car.top_speed_kmh} km/h`
                },
                {
                  icon: <ElectricCarIcon fontSize="small" />,
                  label: 'Power Train',
                  value: car.power_train
                },
              ]}
            />
          </Grid>

          {/* Battery & Charging */}
          <Grid item xs={12} md={6}>
            <InfoCard
              icon={<BatteryIcon />}
              title="Battery & Charging"
              color="success"
              items={[
                {
                  icon: <RangeIcon fontSize="small" />,
                  label: 'Range',
                  value: `${car.range_km} km`
                },
                {
                  icon: <BatteryIcon fontSize="small" />,
                  label: 'Efficiency',
                  value: `${car.efficiency_whkm} Wh/km`
                },
                {
                  icon: <ChargingIcon fontSize="small" />,
                  label: 'Fast Charge Speed',
                  value: `${car.fast_charge_kmh} km/h`
                },
                {
                  icon: <RapidChargeIcon fontSize="small" />,
                  label: 'Rapid Charge',
                  value: car.rapid_charge
                },
                {
                  icon: <PlugIcon fontSize="small" />,
                  label: 'Plug Type',
                  value: car.plug_type
                },
              ]}
            />
          </Grid>

          {/* Key Specifications Summary */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mr: 2 }}>
                    <EmojiEvents />
                  </Avatar>
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    Key Highlights
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold">
                        {car.range_km}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        km Range
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold">
                        {car.accel_sec}s
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        0-100 km/h
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold">
                        {car.top_speed_kmh}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        km/h Top Speed
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold">
                        {car.fast_charge_kmh}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        km/h Charge Speed
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CarDetail;
