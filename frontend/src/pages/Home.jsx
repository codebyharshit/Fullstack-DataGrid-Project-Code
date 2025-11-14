import React from 'react';
import { Typography, Box, Container, Paper, Chip, Stack, Avatar } from '@mui/material';
import {
  ElectricCar as ElectricCarIcon,
  Dashboard as DashboardIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import DataGrid from '../components/DataGrid';

const Home = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 4, sm: 5, md: 6 },
          boxShadow: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: { xs: 60, sm: 70 },
                height: { xs: 60, sm: 70 },
                mr: 2,
              }}
            >
              <ElectricCarIcon sx={{ fontSize: { xs: 35, sm: 45 } }} />
            </Avatar>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Electric Cars Database
            </Typography>
          </Box>

          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 3,
              opacity: 0.95,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Explore our comprehensive database of electric vehicles with advanced search and filtering capabilities
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 2 }}
          >
            <Chip
              icon={<DashboardIcon />}
              label="Interactive Grid"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                fontWeight: 'bold',
                px: 1,
              }}
            />
            <Chip
              icon={<SearchIcon />}
              label="Smart Search"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                fontWeight: 'bold',
                px: 1,
              }}
            />
            <Chip
              icon={<FilterIcon />}
              label="Advanced Filters"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                fontWeight: 'bold',
                px: 1,
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* Data Grid Section */}
      <Container maxWidth="xl" sx={{ mt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <DataGrid />
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
