import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { RECURSOS, type Recurso, type Recursos } from '../common/jugador';

/* Mismo diseno que ElegirAbundancia.tsx e intercambioBanca.tsx (Dialog con
   Select), pero con un solo recurso: todos los demas jugadores le dan al que
   juega la carta todo lo que tengan de ese recurso. */

interface Props {
  abierto: boolean;
  enviando: boolean;
  misRecursos: Recursos;
  onCerrar: () => void;
  onConfirmar: (recurso: Recurso) => void;
}

function ElegirMonopolio({ abierto, enviando, misRecursos, onCerrar, onConfirmar }: Props) {
  const [recurso, setRecurso] = useState<Recurso | ''>('');

  const puedeConfirmar = !enviando && recurso !== '';

  return (
    <Dialog open={abierto} onClose={enviando ? undefined : onCerrar} fullWidth maxWidth="xs">
      <DialogTitle>Carta de monopolio</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Elige un recurso: todos los demás jugadores te darán todo lo que tengan de ese recurso.
        </DialogContentText>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <FormControl fullWidth disabled={enviando}>
            <InputLabel id="monopolio-recurso-label">Recurso</InputLabel>
            <Select labelId="monopolio-recurso-label" label="Recurso" value={recurso}
              onChange={(evento) => setRecurso(evento.target.value as Recurso)}>
              {RECURSOS.map((r) => (
                <MenuItem key={r} value={r}>
                  {r} (tienes {misRecursos[r]})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onCerrar} disabled={enviando}>Cancelar</Button>
        <Button type="button" variant="contained" disabled={!puedeConfirmar}
          onClick={() => {
            if (recurso && puedeConfirmar) onConfirmar(recurso);
          }}>
          {enviando ? 'Pidiendo…' : 'Pedir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ElegirMonopolio;
