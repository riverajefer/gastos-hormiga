import { Fab, Zoom } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface FloatingActionButtonProps {
  onClick: () => void;
  visible?: boolean;
}

export function FloatingActionButton({ onClick, visible = true }: FloatingActionButtonProps) {
  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        aria-label="Agregar gasto"
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: 80, // Above bottom navigation
          right: 16,
          width: 60,
          height: 60,
          zIndex: 1000,
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>
    </Zoom>
  );
}
