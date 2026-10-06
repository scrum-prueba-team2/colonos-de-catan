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

/* Mismo diseno que intercambioBanca.tsx (Dialog con dos Select), pero los dos
   son recursos que se reciben gratis de la banca. Se puede pedir el mismo
   recurso dos veces si la banca tiene al menos 2. */

interface Props {
  abierto: boolean;
  enviando: boolean;
  recursosBanca: Recursos;
  onCerrar: () => void;
  onConfirmar: (recurso1: Recurso, recurso2: Recurso) => void;
}

function ElegirAbundancia({ abierto, enviando, recursosBanca, onCerrar, onConfirmar }: Props) {
  const [recurso1, setRecurso1] = useState<Recurso | ''>('');
  const [recurso2, setRecurso2] = useState<Recurso | ''>('');

  // Cuantos le quedan a la banca de un recurso si ya se eligio en el otro Select.
  const disponible = (recurso: Recurso, elegidoEnElOtro: Recurso | '') =>
    recursosBanca[recurso] - (recurso === elegidoEnElOtro ? 1 : 0);

  const puedeConfirmar = !enviando && recurso1 !== '' && recurso2 !== ''
    && (recurso1 === recurso2
      ? recursosBanca[recurso1] >= 2
      : recursosBanca[recurso1] >= 1 && recursosBanca[recurso2] >= 1);

  function cerrar() {
    setRecurso1('');
    setRecurso2('');
    onCerrar();
  }

  return (
    <Dialog open={abierto} onClose={enviando ? undefined : cerrar} fullWidth maxWidth="xs">
      <DialogTitle>Carta de abundancia</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Elige 2 recursos que quieres recibir gratis de la banca. Pueden ser iguales.
        </DialogContentText>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <FormControl fullWidth disabled={enviando}>
            <InputLabel id="abundancia-recurso1-label">Recurso 1</InputLabel>
            <Select labelId="abundancia-recurso1-label" label="Recurso 1" value={recurso1}
              onChange={(evento) => setRecurso1(evento.target.value as Recurso)}>
              {RECURSOS.map((recurso) => (
                <MenuItem key={recurso} value={recurso} disabled={disponible(recurso, recurso2) < 1}>
                  {recurso} (banca: {recursosBanca[recurso]})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={enviando}>
            <InputLabel id="abundancia-recurso2-label">Recurso 2</InputLabel>
            <Select labelId="abundancia-recurso2-label" label="Recurso 2" value={recurso2}
              onChange={(evento) => setRecurso2(evento.target.value as Recurso)}>
              {RECURSOS.map((recurso) => (
                <MenuItem key={recurso} value={recurso} disabled={disponible(recurso, recurso1) < 1}>
                  {recurso} (banca: {recursosBanca[recurso]})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={cerrar} disabled={enviando}>Cancelar</Button>
        <Button type="button" variant="contained" disabled={!puedeConfirmar}
          onClick={() => {
            if (recurso1 && recurso2 && puedeConfirmar) onConfirmar(recurso1, recurso2);
          }}>
          {enviando ? 'Recibiendo…' : 'Recibir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ElegirAbundancia;
